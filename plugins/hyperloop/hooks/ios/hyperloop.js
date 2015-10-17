/**
 * Hyperloop ®
 * Copyright (c) 2015 by Appcelerator, Inc.
 * All Rights Reserved. This library contains intellectual
 * property protected by patents and/or patents pending.
 */
(function () {

	// set this to enforce a ios-min-version
	var IOS_MIN = '7.1';
	// set this to enforce a minimum Titanium SDK
	var TI_MIN = '5.1.0';

	var path = require('path'),
		findit = require('findit'),
		hm = require('hyperloop-metabase'),
		fs = require('fs'),
		crypto = require('crypto'),
		chalk = require(path.join(__dirname, '..', '..', 'node_modules', 'hyperloop-metabase','node_modules','chalk'));

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
		generatedResourcesDir,
		hyperloopBuildDir,
		minIOSVersion,
		buildDir,
		target,
		afs,
		force,
		references = {},
		files = {},
		natives = {},
		packages = {},
		cleanup = [],
		pluginDir = path.join(__dirname, '..'),
		metabaseDir = path.join(pluginDir, 'metabase'),
		requireRegex = /require\s*\([\\"']+([\w_/-\\.]+)[\\"']+\)/ig,
		xcodeIdPrefix = '90000000000000000000000',
		xcodeId = 0;

	//copied from https://github.com/ryanmcgrath/wrench-js/blob/master/lib/wrench.js
	function mkdirSyncRecursive(p, mode) {
		p = path.normalize(p)
		try {
			fs.mkdirSync(p, mode);
		} catch(err) {
			if(err.code === "ENOENT") {
				var slashIdx = p.lastIndexOf(path.sep);
				if(slashIdx > 0) {
					var parentPath = p.substring(0, slashIdx);
					mkdirSyncRecursive(parentPath, mode);
					mkdirSyncRecursive(p, mode);
				} else {
					throw err;
				}
			} else if(err.code === "EEXIST") {
				return;
			} else {
				throw err;
			}
		}
	}

	/* copied from https://github.com/ryanmcgrath/wrench-js/blob/master/lib/wrench.js
	 *
	 *  Recursively dives through directories and obliterates everything about it. This is a
	 *  Sync-function, which blocks things until it's done. No idea why anybody would want an
	 *  Asynchronous version. :\
	 */
	function rmdirSyncRecursive (fp, failSilent) {
		var files;
		var isWindows = !!process.platform.match(/^win/);

		try {
			files = fs.readdirSync(fp);
		} catch (err) {

			if(failSilent) return;
			throw new Error(err.message);
		}

		/*  Loop through and delete everything in the sub-tree after checking it */
		for(var i = 0; i < files.length; i++) {
			var file = path.join(fp, files[i]);
			var currFile = fs.lstatSync(file);

			if(currFile.isDirectory())  {
				// Recursive function back to the beginning
				rmdirSyncRecursive(file);
			} else if(currFile.isSymbolicLink()) {
				// Unlink symlinks
				if (isWindows) {
					fs.chmodSync(file, 666) // Windows needs this unless joyent/node#3006 is resolved..
				}

				fs.unlinkSync(file);
			} else {
				// Assume it's a file - perhaps a try/catch belongs here?
				if (isWindows) {
					fs.chmodSync(file, 666) // Windows needs this unless joyent/node#3006 is resolved..
				}

				fs.unlinkSync(file);
			}
		}

		/*  Now that we know everything in the sub-tree has been deleted, we can delete the main
		 directory. Huzzah for the shopkeep. */
		return fs.rmdirSync(fp);
	}

	/**
	 * inject a Framework into the xcode project
	 */
	function addXCodeFramework (proj, name) {
		var PBXBuildFile = proj.PBXBuildFile;
		var PBXFrameworksBuildPhase = proj.PBXFrameworksBuildPhase;
		var PBXFileReference = proj.PBXFileReference;
		var x1 = xcodeIdPrefix + (xcodeId++);
		var x2 = xcodeIdPrefix + (xcodeId++);
		PBXBuildFile[x1] = {
			isa: 'PBXBuildFile',
			fileRef: x2
		};
		PBXBuildFile[x1+'_comment'] = name + ' in Frameworks';
		PBXFileReference[x2] = {
			isa: 'PBXFileReference',
			lastKnownFileType: 'wrapper.framework',
			name: name,
			path: 'System/Library/Frameworks/' + name,
			sourceTree: 'SDKROOT'
		};
		PBXFileReference[x2 + '_comment'] = name;
		PBXFrameworksBuildPhase['1D60588F0D05DD3D006BFB54'].files.push({
			value: x1,
			comment: name + ' in Frameworks'
		});
	}

	/**
	 * inject a source file into the xcode project
	 */
	function addXCodeSourceFile(proj, fn) {
		var PBXBuildFile = proj.PBXBuildFile;
		var PBXFileReference = proj.PBXFileReference;
		var PBXSourcesBuildPhase = proj.PBXSourcesBuildPhase;
		var PBXGroup = proj.PBXGroup;
		var x1 = xcodeIdPrefix + (xcodeId++);
		var x2 = xcodeIdPrefix + (xcodeId++);
		var x3 = xcodeIdPrefix + (xcodeId++);
		var name = path.basename(fn);
		PBXBuildFile[x1] = {
			isa: 'PBXBuildFile',
			fileRef: x2
		};
		PBXBuildFile[x1+'_comment'] = name + ' in Sources';
		PBXFileReference[x2] = {
			isa: 'PBXFileReference',
			fileEncoding: 4,
			lastKnownFileType: 'sourcecode.c.objc',
			name: name,
			path: '"' + fn + '"',
			sourceTree: '"<absolute>"'
		};
		PBXFileReference[x2 + '_comment'] = name;
		var group = proj.PBXGroup['24CA8A0B111161E10084E2DE'];
		PBXSourcesBuildPhase['1D60588E0D05DD3D006BFB54'].files.push({
			value: x1,
			comment: name + ' in Sources'
		});
		PBXGroup[x3] = {
			isa: 'PBXGroup',
			children: [
				{
					value: x2,
					comment: name
				}
			],
			name: 'Hyperloop',
			sourceTree: '"<group>"'
		};
		PBXGroup[x3 + '_comment'] = 'Hyperloop';
		PBXGroup['24CA8A09111161D60084E2DE'].children.push({
			value: x3,
			comment: 'Hyperloop'
		});
	}

	/**
	 * main entry point for our plugin
	 */
	exports.init = function (_logger, _config, _cli, appc) {
		config = _config;
		cli = _cli;
		logger = _logger;
		afs = appc.fs;

		// hyperloop requires a later version
		if (!appc.version.satisfies(_cli.sdk.manifest.version, '>=' + TI_MIN)) {
			logger.error('You cannot use the Hyperloop compiler with a version of Titanium older than ' + TI_MIN);
			logger.error('Set the value of <sdk-version> to a newer version in tiapp.xml.');
			logger.error('For example:');
			logger.error('	<sdk-version>' + TI_MIN + '.GA</sdk-version>');
			process.exit(1);
		}

		projectDir = cli.argv['project-dir'];
		if (fs.existsSync(path.join(projectDir, 'app'))) {
			generatedResourcesDir = path.join(projectDir, 'Resources');
			projectDir = path.join(projectDir, 'app');
		}
		else {
			projectDir = path.join(projectDir, 'Resources');
			generatedResourcesDir = projectDir;
		}

		buildDir = path.join(projectDir, '..', 'build');
		resourcesDir = path.join(buildDir, 'platform');
		if (!afs.exists(buildDir)) {
			fs.mkdirSync(buildDir);
		}
		if (!afs.exists(resourcesDir)) {
			fs.mkdirSync(resourcesDir);
		}

		// create a temporary hyperloop directory
		hyperloopBuildDir = path.join(buildDir, 'hyperloop', 'ios');
		if (!fs.existsSync(hyperloopBuildDir)) {
			mkdirSyncRecursive(hyperloopBuildDir);
		}

		// set the resources directory
		cli.argv['platform-dir'] = resourcesDir;

		cli.on('build.pre.construct', function (builder, callback) {
			force = builder.cli.argv.force;
			minIOSVersion = builder.minIosVer;
			buildDir = builder.buildDir;
			target = builder.target === 'simulator' ? 'iphonesimulator' : 'iphone';

			// check to make sure the hyperloop module is actually configured
			var moduleFound = builder.modules.map(function (i) {
				if (i.id === 'hyperloop') { return i };
			}).filter(function (a) { return !!a; });

			// check that it was found
			if (!moduleFound.length) {
				logger.error('You cannot use the Hyperloop compiler without configuring the module.');
				logger.error('Add the following to your tiapp.xml <modules> section:');
				var pkg = JSON.parse(path.join(__dirname, '../package.json'));
				logger.error('');
				logger.error('	<module version="' + pkg.version + '">hyperloop</module>');
				logger.warn('');
				process.exit(1);
			}

			// check for the run-on-main-thread configuration
			if (!builder.tiapp.ios['run-on-main-thread']) {
				logger.error('You cannot use the Hyperloop compiler without configuring iOS to use main thread execution.');
				logger.error('Add the following to your tiapp.xml <ios> section:');
				logger.error('');
				logger.error('	<run-on-main-thread>true</run-on-main-thread>');
				logger.warn('');
				process.exit(1);
			}

			// check for built-in JSCore but only warn if not set
			if (builder.tiapp.ios['use-jscore-framework'] === undefined) {
				logger.info('Hyperloop compiler works best with the built-in iOS JavaScript library.');
				logger.info('Add the following to your tiapp.xml <ios> section to enable or disable this:');
				logger.info('');
				logger.info('	<use-jscore-framework>true</use-jscore-framework>');
				logger.info('');
				logger.info('Using Apple JavaScriptCore by default when not specified.');
				builder.tiapp.ios['use-jscore-framework'] = true;
			}

			// check for min ios version
			if (parseFloat(builder.tiapp.ios['min-ios-ver']) < parseFloat(IOS_MIN)) {
				logger.error('Hyperloop compiler works best with iOS ' + IOS_MIN + ' or greater.');
				logger.error('Your setting is currently set to: ' + builder.tiapp.ios['min-ios-ver']);
				logger.error('You can change the version by adding the following to your');
				logger.error('tiapp.xml <ios> section:');
				logger.error('');
				logger.error('	<min-ios-ver>' + IOS_MIN + '</min-ios-ver>');
				logger.warn('');
				process.exit(1);
			}

			// update to use the correct libhyperloop based on which JS engine is configured
			if (builder.nativeLibModules) {
				for (var c = 0; c < builder.nativeLibModules.length; c++) {
					var mod = builder.nativeLibModules[c];
					if (mod.id == 'hyperloop') {
						var frag = builder.tiapp.ios['use-jscore-framework'] ? 'js' : 'ti';
						mod.libName = 'libhyperloop-' + frag + 'core.a';
						mod.libFile = path.join(mod.modulePath, mod.libName);
						mod.hash = crypto.createHash('md5').update(fs.readFileSync(mod.libFile)).digest('hex');
						logger.debug('Using Hyperloop library -> ' + mod.libName);
						break;
					}
				}
			}

			callback();
		});

		cli.addHook('build.ios.xcodeproject', {
			pre: function (build, finished) {
				var keys = Object.keys(natives);
				if (keys.length) {
					var proj = build.args[0].hash.project.objects,
						frameworks = {};

					// find all the frameworks
					proj.PBXFrameworksBuildPhase['1D60588F0D05DD3D006BFB54'].files.forEach(function (k) {
						k.comment && (frameworks[k.comment.split(' ')[0]] = 1);
					});

					// make sure our found frameworks are in the xcode project and if not found,
					// we are going to add it
					Object.keys(packages).forEach(function (n) {
						var name = n + '.framework';
						if (!(name in frameworks)) {
							// we need to add it
							addXCodeFramework(proj, name);
						}
					});

					// add the source files to xcode to compile
					keys.forEach(function (fn) {
						addXCodeSourceFile(proj, fn);
					});
				}
				finished();
			}
		});

		cli.addHook('build.ios.xcodebuild', {
			pre: function (builder, finished) {
				if (builder.ctx.deployType === 'development' && builder.ctx.target === 'simulator') {
					// speed up the build by only building the target architecture
					builder.args[1].push('ONLY_ACTIVE_ARCH=1');
				}
				finished();
			}
		});

		// hook copy for simulator to replace our JS files with ones that have been transpiled
		cli.addHook('build.ios.copyResource', {
			post: function (builder, finished) {
				if (builder.ctx.deployType === 'development' && builder.ctx.target === 'simulator') {
					var from = builder.args[0],
						to = builder.args[1];
					if (files[from]) {
						return fs.writeFile(to, files[from], finished);
					}
				}
				finished();
			}
		});

		// for device, we should hit the compile step (but not in simulator)
		cli.addHook('build.ios.compileJsFile', {
			pre: function (build, finished) {
				var fn = build.args[1];
				if (files[fn]) {
					build.args[0]['original'] = files[fn];
					build.args[0]['contents'] = files[fn];
					finished();
				} else {
					finished();
				}
			}
		});

		cli.addHook('build.pre.compile', {
			post: function (build, finished) {
				prepareBuild(finished);
			}
		});

		cli.addHook('build.ios.removeFiles', {
			post: function (build, finished) {
				logger.debug('removing temporary hyperloop files');
				cleanup.forEach(function (fn) {
					logger.debug('removing %s', fn);
					fs.unlinkSync(fn);
				});
				var hyperloopResources = path.join(projectDir, 'hyperloop');
				if (fs.existsSync(hyperloopResources)) {
					rmdirSyncRecursive(hyperloopResources);
				}
				finished();
			}
		});
	};

	/**
	 * Sets up the build for using the hyperloop module.
	 */
	function prepareBuild(callback) {
		logger.info('Starting ' + HL + ' assembly');

		var frameworks,
			includes = [];

		// set our CLI logger
		hm.util.setLog(logger);

		// find our system frameworks
		hm.metabase.getSystemFrameworks(buildDir, target, minIOSVersion, function (err, json) {
			if (err) { return callback(err); }

			// setup our framework mappings
			frameworks = json;

			// look for any hyperloop libraries in our JS files
			findit(generatedResourcesDir)
				.on('file', function (file, stat) {
					// Only consider JS files.
					if (path.extname(file) !== '.js') {
						return;
					}
					match (file);
				})
				.on('end', function () {
					generateSourceFiles(buildDir, Object.keys(includes), json, copyNativeReferences);
				});
		});

		// copy any native generated file references so that we can compile them
		// as part of xcodebuild
		function copyNativeReferences () {
			var keys = Object.keys(references);
			// only if we found references, otherwise, skip
			if (keys.length) {
				// check to see if we have any specific file native modules and copy them in
				keys.forEach(function (ref) {
					var fp = path.join(filesDir, ref.replace(/^hyperloop\//,'') + '.m');
					if (fs.existsSync(fp)) {
						natives[fp] = 1;
					}
				});
				// check to see if we have any package modules and copy them in
				Object.keys(packages).forEach(function (k) {
					var fp = path.join(filesDir, k.toLowerCase() + '/' + k.toLowerCase() + '.m');
					if (fs.existsSync(fp)) {
						natives[fp] = 1;
					}
				});
				var hyperloopResources = path.join(generatedResourcesDir, 'hyperloop');
				mkdirSyncRecursive(hyperloopResources);
				afs.copyDirRecursive(filesDir, hyperloopResources, function (err) {
					logger.info('Finished Hyperloop assembly');
					callback(err);
				});
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

		//https://github.com/LouisT/node-soundex/blob/master/index.js
		function soundEx(str, scale) {
			var split = String(str).toUpperCase().replace(/[^A-Z]/g, '').split(''),
				map = {
					BFPV: 1,
					CGJKQSXZ: 2,
					DT: 3,
					L: 4,
					MN: 5,
					R: 6
				},
				keys = Object.keys(map).reverse();
			var build = split.map(function (letter, index, array) {
				for (var num in keys) {
					if (keys[num].indexOf(letter) != -1) {
						return map[keys[num]];
					};
				};
			});
			var first = build.splice(0, 1)[0];
			build = build.filter(function (num, index, array) {
				return ((index === 0) ? num !== first : num !== array[index - 1]);
			});
			var len = build.length,
				max = (scale ? ((max = ~~((len * 2 / 3.5))) > 3 ? max : 3) : 3);
			return split[0] + (build.join('') + (new Array(max + 1).join('0'))).slice(0, max);
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
					var re = /require\s*\([\\"']+([\w_/-\\.]+)[\\"']+\)/i.exec(m),
						fn = re[1],
						tok = fn.split('/');

					// hyperloop includes will always have a slash
					if (tok[0] === 'alloy' || tok[0].charAt(0) === '.' || tok[0].charAt(0) === '/') {
						return;
					}

					var pkg = tok[0],
						// if we use something like require("UIKit")
						// that should require the helper such as require("UIKit/UIKit");
						fn = tok[1] || pkg,
						fwk = frameworks[pkg],
						isBuiltin = pkg === 'Titanium';

					if (!fwk && !isBuiltin) {
						var fwkeys = Object.keys(frameworks);
						for (var f = 0; f < fwkeys.length; f++) {
							var framework = fwkeys[f];
							if (soundEx(framework) === soundEx(pkg)) {
								logger.error('The iOS framework "' + pkg + '" could not be found. Are you trying to use "' + framework + '" instead? (' + path.relative(generatedResourcesDir, file) + ')');
								process.exit(1);
							}
						}
						return;
					}

					// remember our packages
					if (!isBuiltin) {
						packages[pkg] = 1;
					}

					var include = fwk[fn];

					if (!include && fn !== pkg) {
						var fkeys = Object.keys(frameworks);
						for (var c = 0; c < fkeys.length; c++) {
							var f = fkeys[c];
							var ckeys = Object.keys(frameworks[f]);
							for (var i = 0; i < ckeys.length; i++) {
								var k = ckeys[i];
								if (k === fn) {
									logger.error('Are you trying to use the iOS class "' + fn + '" located in the framework "' + f + '", not in "' + pkg + '"? (' + path.basename(file) + ')');
									process.exit(1);
								}
							}
						}
						var keys = Object.keys(fwk);
						for (var c = 0; c < keys.length; c++) {
							var key = keys[c];
							if (soundEx(key) === soundEx(fn)) {
								logger.error('The iOS class "' + fn + '" could not be found in the framework "' + pkg + '". Are you trying to use "' + key + '" instead? (' + path.basename(file) + ')');
								process.exit(1);
							}
						}
						logger.error('The iOS class "' + fn + '" could not be found in the framework "' + pkg + '". (' + path.basename(file) + ')');
						process.exit(1);
					}

					// replace the require to point to our generated file path
					var ref = 'hyperloop/' + pkg.toLowerCase() + '/' + fn.toLowerCase();
					var str = "require('" + ref + "')";

					contents = replaceAll(contents, m, str);
					found.push(ref);

					fwk = fwk && fwk[fn];
					if (fwk) {
						// record our includes in which case we found a match
						includes[fwk] = 1;
					}
				});
				return [found, contents];
			}
		}

		// generate the metabase from required hyperloop files
		// and then generate the source files from that metabase
		function generateSourceFiles (buildDir, includes, json, callback) {
			// no hyperloop files detected, we can stop here
			if (!includes.length && !Object.keys(references).length) {
				logger.info('Skipping ' + HL + ' compile, no usage found ...');
				return callback();
			}

			filesDir = path.join(hyperloopBuildDir, 'js');
			if (!fs.existsSync(filesDir)) {
				mkdirSyncRecursive(filesDir);
			}

			// generate the metabase from our includes
			return hm.metabase.generateMetabase(hyperloopBuildDir, json.$metadata.sdkType, json.$metadata.sdkPath, json.$metadata.minVersion, includes, false, function (err, result, outfile, header, cached) {
				if (cached) {
					// if cached, skip generation
					logger.info('Skipping ' + HL + ' compile, already generated ...');
					callback();
				} else {
					// now generate the stubs
					hm.generate.generateFromJSON (filesDir, result, callback);
				}
			}, force);
		}

	}
})();
