/**
 * This hook is an example.
 *
 * @copyright
 * Copyright (c) 2015 by YOUR NAME. All Rights Reserved.
 */

'use strict';

/** The plugin's identifier */
exports.id = 'hyperloop';

/** The Titanium CLI version that this hook is compatible with */
exports.cliVersion = '>=3.2';

(function () {
	var path = require('path'),
		findit = require('findit'),
		fs = require('fs'),
		chalk = require('chalk'),
		wrench = require('wrench'),
		appc = require('node-appc'),
		DOMParser = require('xmldom').DOMParser,
		async = require('async'),
		metabase = require(path.join(__dirname, 'metabase'));

	/*
	 State.
	 */
	var config,
		cli,
		logger,
		HL = chalk.magenta.inverse('Hyperloop'),
		projectDir,
		resourcesDir,
		filesDir,
		hyperloopBuildDir,
		afs,
		references = {},
		files = {},
		jars = [],
		aars = {},
		cleanup = [],
		requireRegex = /require\s*\([\\"']+([\w_\/-\\.]+)[\\"']+\)/ig;

	/*
	 Config.
	 */

	exports.init = function (_logger, _config, _cli, appc) {
		config = _config;
		cli = _cli;
		logger = _logger;
		afs = appc.fs;

		projectDir = path.join(cli.argv['project-dir'], 'Resources');

		var buildDir = path.join(projectDir, '..', 'build');
		resourcesDir = path.join(buildDir, 'platform');
		if (!afs.exists(buildDir)) {
			fs.mkdirSync(buildDir);
		}
		if (!afs.exists(resourcesDir)) {
			fs.mkdirSync(resourcesDir);
		}

		// create a temporary hyperloop directory
		hyperloopBuildDir = path.join(buildDir, 'hyperloop', 'android');
		if (!fs.existsSync(hyperloopBuildDir)) {
			wrench.mkdirSyncRecursive(hyperloopBuildDir);
		}

		// set the resources directory
		cli.argv['platform-dir'] = resourcesDir;

		cli.on('build.pre.compile', {
			priority: 99999,
			post: prepareBuild
		});

		cli.on('build.android.copyResource', {
			priority: 99999,
			pre: function (build, finished) {
				build.ctx._minifyJS = build.ctx.minifyJS;
				build.ctx.minifyJS = true;
				finished();
			},
			post: function (build, finished) {
				build.ctx.minifyJS = build.ctx._minifyJS;
				delete build.ctx._minifyJS;
				finished();
			}
		});

		cli.on('build.android.compileJsFile', {
			priority: 99999,
			pre: function (build, finished) {
				//TODO: switch to using the AST directly
				var fn = build.args[1];
				if (files[fn]) {
					// var ref = build.ctx._minifyJS ? 'contents' : 'original';
					build.args[0]['original'] = files[fn];
					build.args[0]['contents'] = files[fn];
					finished();
				} else {
					finished();
				}
			}
		});

		cli.on('build.android.removeFiles', {
			priority: 99999,
			post: function (build, finished) {
				logger.debug('removing temporary hyperloop files');
				cleanup.forEach(function (fn) {
					logger.debug('removing %s', fn);
					fs.unlinkSync(fn);
				});
				fs.rmdirSync(filesDir);
				finished();
			}
		});

		cli.on('build.android.aapt', {
			pre: function (data) {
				var args = data.args[1],
					index = args.indexOf('--extra-packages'),
					extraPackages = args[index + 1],
					packageNames = [],
					extraArgs = [];

				// Iterate over the AARs
				Object.keys(aars).forEach(function (key) {
					var packageName = aars[key];
					packageNames.push(packageName);
					extraArgs.push('-S');
					extraArgs.push(path.join(hyperloopBuildDir, key, 'res'));
				});

				data.args[1][index + 1] = extraPackages.concat(packageNames.join(':'));
				data.args[1] = data.args[1].concat(extraArgs);
			}
		});

		cli.on('build.android.dexer', {
			pre: function (data) {
				data.args[1] = data.args[1].concat(jars.slice(1));
			}
		});
	};

	/*
	 Hooks.
	 */

	/**
	 * Sets up the build for using the hyperloop module.
	 */
	function prepareBuild(builder, callback) {
		var metabaseJSON,
			aarFiles = [],
			platformAndroid = path.join(cli.argv['project-dir'], 'platform', 'android');

		logger.info('Starting ' + HL + ' assembly');

		// set our CLI logger
		metabase.util.setLog(logger);

		jars = [builder.androidTargetSDK.androidJar];

		async.series([
			// Find 3rd-party JARs and AARs
			function (next) {
				if (!fs.existsSync(platformAndroid)) {
					return next();
				}
				findit(platformAndroid)
					.on('file', function (file, stat) {
						if (path.extname(file) == '.jar') {
							jars.push(file);
						} else if (path.extname(file) == '.aar') {
							aarFiles.push(file);
						}
					})
					.on('end', next);
			},
			// Handle AARs
			function (next) {
				async.each(aarFiles, function (file, cb) {
					handleAAR(file, function (err, foundJars) {
						if (err) {
							return cb(err);
						}
						jars.push(foundJars);
						cb();
					});
				}, next);
			},
			// Do metabase generation from JARs
			function (next) {
				// TODO It'd be good to split out some mapping between the JAR and the types inside it.
				// Then we can know if a JAR file is "unused" and not copy/package it!
				// Kind of similar to how Jeff detects system frameworks and maps includes by framework.
				// we can map requires by containing JAR
				
				// Simple way may be to generate a "metabase" per-JAR
				logger.info(jars);
				metabase.metabase.loadMetabase(jars, {platform: 'android-' + builder.realTargetSDK}, function (err, json) {
					if (err) {
						logger.error("Failed to generated metabase: " + err);
						return next(err);
					}
					metabaseJSON = json;
					next();
				});
			},
			function (next) {
				// Need to generate the metabase first to know the full set of possible native requires as a filter when we look at requires in user's JS!
				// look for any reference to hyperloop native libraries in our JS files
				findit(projectDir)
					.on('file', function (file, stat) {
						// Only consider JS files.
						if (path.extname(file) !== '.js') {
							return;
						}
						// Skip files inside of the hyperloop metabase dir.
						if (file.indexOf('hyperloop') >= 0) {
							return;
						}
						match(file);
					})
					.on('end', function () {
						generateSourceFiles(copyNativeReferences);
						next();
					});
			}
		], function (err) {
			if (err) {
				return callback(err);
			}
		});

		/**
		 * handles an aar file for the build process:
		 * extracting like a zipfile
		 * copying resources around
		 * 
		 * @returns {Array[String]} paths to JAR files we extracted
		 **/
		function handleAAR(aarFile, finished) {
			var basename = path.basename(aarFile, '.aar'),
				extractedDir = path.join(hyperloopBuildDir, basename),
				foundJars = [path.join(extractedDir, 'classes.jar')];

			if (fs.existsSync(extractedDir)) {
				wrench.rmdirSyncRecursive(extractedDir);
			}
			// Create destination dir
			wrench.mkdirSyncRecursive(extractedDir);

			async.series([
				// Unzip aar file to destination
				function (next) {
					appc.zip.unzip(aarFile, extractedDir, {}, next);
				},
				// Then handles it's contents in parallel operations
				function (next) {
					async.parallel([
						// Extract package name from AndroidManifest.xml
						function (cb) {
							var manifestFile = path.join(extractedDir, 'AndroidManifest.xml'),
								contents = fs.readFileSync(manifestFile).toString(),
								doc = new DOMParser().parseFromString(contents, 'text/xml').documentElement;
							
							// Map from the folder name we're storing under to the specified package in manifest
							aars[basename] = doc.getAttribute('package');
							cb();
						},
						// copy assets
						function (cb) {
							var src = path.join(extractedDir, 'assets'),
								dest = path.join(cli.argv['project-dir'], 'build', 'android', 'assets');

							afs.copyDirRecursive(src, dest, cb, {logger: logger});
						},
						// Find libs/*.jar
						function (cb) {
							var libsDir = path.join(extractedDir, 'libs');
							// directory is optional
							if (!fs.existsSync(libsDir)) {
								return cb();
							}
							findit(libsDir)
								.on('file', function (file, stat) {
									if (path.extname(file) !== '.jar') {
										return;
									}
									foundJars.push(file);
								})
								.on('end', cb);
						},
						// Native .so files
						function (cb) {
							var jniDir = path.join(extractedDir, 'jni'),
								buildLibs = path.join(cli.argv['project-dir'], 'build', 'libs');

							// directory is optional
							if (!fs.existsSync(jniDir)) {
								return cb();
							}

							findit(jniDir)
								.on('file', function (file, stat) {
									if (path.extname(file) !== '.so') {
										return;
									}
									var dest = path.join(buildLibs, path.relative(jniDir, file));
									// make dest dir
									wrench.mkdirSyncRecursive(path.dirname(dest));
									// copy .so over
									afs.copyFileSync(file, dest, {logger: logger});
								})
								.on('end', cb);
						}], next);
				}],
				function (err, results) {
					if (err) {
						logger.error('Failed to extract/handle aar zip: %s', chalk.cyan(aarFile) + '\n');
						return finished(err, foundJars);
					}
					logger.debug("Processed AAR file : " + aarFile);
					finished(null, foundJars);
				});
		}

		function copyNativeReferences () {
			var keys = Object.keys(references);
			// only if we found references, otherwise, skip
			if (keys.length) {
				var hyperloopResources = path.join(projectDir, 'android', 'hyperloop');
				wrench.mkdirSyncRecursive(hyperloopResources);
				afs.copyDirRecursive(filesDir, hyperloopResources, function (err) {
					logger.info('Finished ' + HL + ' assembly');
					if (err) {
						logger.error(err);
					}
					callback(err);
				}, {logger: logger});
			} else {
				logger.info('Finished ' + HL + ' assembly');
				callback();
			}
		}

		function match (file) {
			var matches = findHyperloopRequires(file);
			if (matches.length && matches[0].length) {
				files[file] = matches[1];
				matches[0].forEach(function (ref) {
					references[ref] = 1;
				});
				return true;
			}
			return false;
		}

		// replace the contents of a buffer
		function replaceAll (haystack, needle, replaceStr) {
			var newBuffer = haystack;
			while (1) {
				var index = newBuffer.indexOf(needle);
				if (index < 0) {
					break;
				}
				var before = newBuffer.substring(0, index),
					after = newBuffer.substring(index + needle.length);
				newBuffer = before + replaceStr + after;
			}
			return newBuffer;
		}

		// look for any require which matches our hyperloop system frameworks
		function findHyperloopRequires (file) {
			if (!fs.existsSync(file)) {
				return [];
			}
			else {
				var contents = fs.readFileSync(file, 'UTF-8');
				var found = [];
				(contents.match(requireRegex) || []).forEach(function (m) {
					var re = /require\s*\([\\"']+([\w_\/-\\.]+)[\\"']+\)/i.exec(m),
						className = re[1],
						lastIndex;

					// Is this a Java type we found in the JARs/APIs?
					var type = metabaseJSON.classes[className];
					if (!type) {
						// fallback for using dot notation to refer to nested class
						lastIndex = className.lastIndexOf('.');
						className = className.slice(0, lastIndex) + '$' + className.slice(lastIndex + 1);
						type = metabaseJSON.classes[className];
						if (!type) {
							return;
						}
					}
					// Looks like it's a Java type, so let's hack it and add it to our list!
					// replace the require to point to our generated file path
					var ref = 'hyperloop/' + className;
					var str = "require('" + ref + "')";
					contents = replaceAll(contents, m, str);
					found.push(ref);
				});
				return [found, contents];
			}
		}

		// generate the metabase from required hyperloop files
		// and then generate the source files from that metabase
		function generateSourceFiles (next) {
			var classes = Object.keys(references);
			// no hyperloop files detected, we can stop here
			if (!classes.length) {
				logger.info('Skipping ' + HL + ' compile, no usage found ...');
				return next();
			}

			filesDir = path.join(hyperloopBuildDir, 'js');
			if (!fs.existsSync(filesDir)) {
				wrench.mkdirSyncRecursive(filesDir);
			}

			// drop hyperloop/ from each entry in references to get just the class names
			classes = classes.map(function(element) {
				return element.slice(10);
			});

			return metabase.generate.generateFromJSON(filesDir, metabaseJSON, classes, next);
		}
	}
})();
