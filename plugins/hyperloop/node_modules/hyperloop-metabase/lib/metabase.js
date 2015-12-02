/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
var spawn = require('child_process').spawn,
	exec = require('child_process').exec,
	path = require('path'),
	fs = require('fs'),
	plist = require('plist'),
	async = require('async'),
	semver = require('semver'),
	crypto = require('crypto'),
	wrench = require('wrench'),
	chalk = require('chalk'),
	util = require('./generate/util'),
	swiftlilb = require('./swift'),
	binary = path.join(__dirname, '..', 'bin', 'metabase');


/**
 * return the configured SDK path
 */
function getSDKPath (sdkType, callback) {
	exec('/usr/bin/xcrun --sdk ' + sdkType + ' --show-sdk-path', function (err, stdout) {
		if (err) { return callback(err); }
		return callback(null, stdout.trim());
	});
}

/**
 * convert an apple style version (9.0) to a semver compatible version
 */
function appleVersionToSemver (ver) {
	var v = String(ver).split('.');
	if (v.length === 1) {
		return ver + '.0.0';
	}
	if (v.length === 2) {
		return ver + '.0';
	}
	return ver;
}

/**
 * return a parsed plist for a given framework
 */
function getPlistForFramework (info, callback) {
	if (fs.existsSync(info)) {
		var child = spawn('/usr/bin/plutil',['-convert', 'xml1', info, '-o', '-']);
		var out = '';
		child.stdout.on('data', function (buf) {
			out += buf.toString();
		});
		child.on('close', function (ex) {
			if (ex) {
				return callback(new Error("plistutil cannot convert " + info));
			}
			var result = plist.parse(out);
			return callback(null, result);
		});
	} else {
		return callback();
	}
}

var implRE = /@interface\s*(.*)/g,
	swiftClassRE = /class\s*(\w+)/g;

function extractImplementations (fn, files) {
	var content = fs.readFileSync(fn).toString();
	var matches;
	if (/\.swift$/.test(fn)) {
		matches = content.match(swiftClassRE);
		if (matches && matches.length) {
			matches.forEach(function (match) {
				var m = swiftClassRE.exec(match);
				if (m && m.length) {
					files[m[1]] = fn;
				}
			});
		}
	} else {
		matches = content.match(implRE);
		var found = 0;
		if (matches && matches.length) {
			matches.forEach(function (match) {
				// skip categories
				var p = match.indexOf('(');
				if (p < 0) {
					var m = match.substring(11);
					var i = m.indexOf(':');
					// make sure this is an actual declaration (vs. comment);
					if (i > 0) {
						m = m.substring(0, i).trim();
						// trim off any qualifiers such as
						// @interface NSSet<__covariant ObjectType>
						i = m.indexOf('<');
						if (i > 0) {
							m = m.substring(0, i).trim();
						}
						files[m] = fn;
						found++;
					}
				} else {
					var name = match.substring(11, p).trim();
					if (!(name in files)) {
						files[name] = fn;
						found++;
					}
				}
			});
		}
		if (!found) {
			// convention for user-generated files like Foo+Bar.h where Bar is a
			// category of Foo, we exclude those
			if (fn.indexOf('+') < 0) {
				files[path.basename(fn).replace('.h','').trim()] = fn;
			}
		}
	}
}

/**
 * generate system framework includes mapping
 */
function generateSystemFrameworks (sdkPath, iosMinVersion, callback) {
	var skip = [],
		frameworkPath = path.resolve(path.join(sdkPath,'System/Library/Frameworks')),
		frameworks = fs.readdirSync(frameworkPath).filter(function(n){ return /\.framework$/.test(n) && !!~~skip.indexOf(n); }),
		iosMinVersionSemver = appleVersionToSemver(iosMinVersion),
		mapping = {};

	async.each(frameworks, function (fw, next) {
		var hd = path.join(frameworkPath, fw, 'Headers'),
			fp = path.join(hd, fw.replace('.framework','.h'));
		if (fs.existsSync(fp)) {
			getPlistForFramework(path.join(frameworkPath, fw, 'Info.plist'), function (err, p) {
				if (err) { return next(err); }
				// check min version
				if (p && p.MinimumOSVersion) {
					if (semver.gt(iosMinVersionSemver, appleVersionToSemver(p.MinimumOSVersion))) {
						return;
					}
				}
				if (p && p.UIDeviceFamily) {
					// TODO: check device family we are targeting
				}
				var files = {};
				fs.readdirSync(hd).forEach(function (n) {
					extractImplementations(path.join(hd, n), files);
				});
				mapping[fw.replace('.framework', '')] = files;
				next();
			});
		}
		else {
			return next();
		}
	}, function (err) {
		return callback(err, mapping);
	});
}

/**
 * generate a metabase
 *
 * @param {String} buildDir cache directory to write the files
 * @param {String} sdk the sdk type such as iphonesimulator
 * @param {String} sdk path the path to the SDK
 * @param {String} iosMinVersion the min version such as 9.0
 * @param {Array} includes array of header paths (should be absolute paths)
 * @param {Boolean} excludeSystem if true, will exclude any system libraries in the generated output
 * @param {Function} callback function to receive the result which will be (err, json, json_file, header_file)
 * @param {Boolean} force if true, will not use cache
 */
function generateMetabase (buildDir, sdk, sdkPath, iosMinVersion, includes, excludeSystem, callback, force, extraHeaders) {
	var cacheToken = crypto.createHash('md5').update(sdkPath + iosMinVersion + excludeSystem + JSON.stringify(includes)).digest('hex');
	var header = path.join(buildDir, 'metabase-' + iosMinVersion + '-' + sdk + '-' + cacheToken + '.h');
	var outfile = path.join(buildDir, 'metabase-' + iosMinVersion + '-' + sdk + '-' + cacheToken + '.json');

	// check for cached version and attempt to return if found
	if (!force && fs.existsSync(header) && fs.existsSync(outfile)) {
		try {
			var json = JSON.parse(fs.readFileSync(outfile));
			json.$includes = includes;
			return callback(null, json, path.resolve(outfile), path.resolve(header), true);
		}
		catch (e) {
			// fall through and re-generate again
		}
	}

	force && util.logger.trace('forcing generation of metabase to', outfile);

	var contents =  '/**\n' +
					' * HYPERLOOP GENERATED - DO NOT MODIFY\n' +
					' */\n' +
					includes.map(function (fn) {
						if (fn) {
							if (fn.charAt(0) === '<') {
								return '#import ' + fn;
							} else {
								return '#import "' + fn + '"';
							}
						}
					}).join('\n') +
					'\n';
	fs.writeFileSync(header, contents);
	var args = [
		'-i', path.resolve(header),
		'-o', path.resolve(outfile),
		'-sim-sdk-path', sdkPath,
		'-min-ios-ver', iosMinVersion,
		'-pretty'
	];
	if (excludeSystem) {
		args.push('-x');
	}
	if (extraHeaders) {
		args.push('-hsp');
		args.push('"' + extraHeaders.join(',') + '"');
	}
	util.logger.trace('running', binary, 'with', args.join(' '));
	var ts = Date.now();
	var child = spawn(binary, args);
	child.stdout.on('data', function (buf) {
		// process.stdout.write(buf);
		util.logger.debug(String(buf).replace(/\n$/,''));
	});
	child.stderr.on('data', function (buf) {
		// process.stderr.write(buf);
		// util.logger.error(String(buf).replace(/\n$/,''));
	});
	child.on('error', callback);
	child.on('exit', function (ex) {
		util.logger.trace('metabase took', (Date.now()-ts), 'ms to generate');
		if (ex) {
			return callback(new Error('Metabase generation failed'));
		}
		var json = JSON.parse(fs.readFileSync(outfile));
		json.$includes = includes;
		return callback(null, json, path.resolve(outfile), path.resolve(header), false);
	});
}

/**
 * return the system frameworks mappings as JSON for a given sdkType and minVersion
 */
function getSystemFrameworks (cacheDir, sdkType, minVersion, callback) {
	var fn = 'metabase-mappings-' + sdkType + '-' + minVersion + '.json';
	if (!fs.existsSync(cacheDir)) {
		fs.mkdirSync(cacheDir);
	}
	var cacheFilename = path.join(cacheDir, fn);
	if (fs.existsSync(cacheFilename)) {
		try {
			return callback(null, JSON.parse(fs.readdirSync(cacheFilename)));
		} catch (E) {
			// errors, re-generate it
		}
	}
	getSDKPath(sdkType, function (err, sdkPath) {
		if (err) { return callback(err); }
		generateSystemFrameworks(sdkPath, minVersion, function (err, json) {
			if (err) { return callback(err); }
			json.$metadata = {
				sdkType: sdkType,
				minVersion: minVersion,
				sdkPath: sdkPath
			};
			fs.writeFileSync(cacheFilename, JSON.stringify(json));
			callback(null, json);
		});
	});
}

function recursiveReadDir (dir, result) {
	result = result || [];
	var files = fs.readdirSync(dir);
	files.forEach(function (fn) {
		var fp = path.join(dir, fn);
		if (fs.statSync(fp).isDirectory()) {
			recursiveReadDir(fp, result);
		} else {
			result.push(fp);
		}
	});
	return result;
}

/**
 * for an array of directories, return all validate header files
 */
function getAllHeaderFiles (directories) {
	var files = [];
	directories.forEach(function (dir) {
		recursiveReadDir(dir).forEach(function (fn) {
			if (/\.(h(pp)?|swift)$/.test(fn)) {
				files.push(fn);
			}
		});
	});
	return files;
}

/**
 * for a given set of user headers, return a mapping of frameworks
 */
function getUserFrameworks (cacheDir, directories, callback, frameworkName) {
	var files = getAllHeaderFiles(directories),
		cacheToken =  crypto.createHash('md5').update(cacheDir + frameworkName + JSON.stringify(files)).digest('hex'),
		fn = 'metabase-mappings-user-' + cacheToken + '.json',
		cacheFilename = path.join(cacheDir, fn);

	if (fs.existsSync(cacheFilename)) {
		try {
			return callback(null, JSON.parse(fs.readdirSync(cacheFilename)), true);
		} catch (E) {
			// errors, re-generate it
		}
	}
	if (!fs.existsSync(cacheDir)) {
		fs.mkdirSync(cacheDir);
	}
	var result = {};
	files.forEach(function (fn) {
		var fw = frameworkName;
		if (!frameworkName) {
			var pos = fn.lastIndexOf('/');
			fw = fn;
			if (pos > 0) {
				var ppos = fn.lastIndexOf('/', pos - 1);
				if (ppos) {
					fw = fn.substring(ppos + 1, pos);
				} else {
					fw = fn.substring(0, pos);
				}
			}
		}
		var f = result[fw] || {};
		extractImplementations(fn, f);
		result[fw] = f;
	});
	fs.writeFileSync(cacheFilename, JSON.stringify(result));
	return callback(null, result, false);
}

/**
 * for a given project directory, return a mapping of symbols for CocoaPods
 * third-party libraries
 */
function generateCocoaPodsFrameworks (cacheDir, basedir, callback) {
	var podDir = path.join(basedir, 'Pods');
	if (fs.existsSync(podDir)) {
		var headers = path.join(podDir, 'Headers', 'Public');
		if (fs.existsSync(headers)) {
			return getUserFrameworks(cacheDir, [headers], callback);
		}
	}
	callback();
}

/**
 * handle buffer output
 */
function createLogger (obj, fn) {
	return (function () {
		var cur = '';
		obj.on('data', function (buf) {
			cur += buf;
			if (cur.charAt(cur.length - 1) === '\n') {
				cur.split(/\n/).forEach(function (line) {
					line && fn(chalk.green('CocoaPods') + ' ' + line);
				});
				cur = '';
			}
		});
		obj.on('exit', function () {
			// flush
			if (cur) {
				cur.split(/\n/).forEach(function (line) {
					line && fn(chalk.green('CocoaPods') + ' ' + line);
				});
			}
		});
	})();
}

/**
 * run the ibtool
 */
function runIBTool (runDir, args, callback) {
	var spawn = require('child_process').spawn,
		child = spawn('/usr/bin/ibtool', args, {cwd: runDir});
	util.logger.debug('running /usr/bin/ibtool ' + args.join(' ') + ' ' + runDir);
	createLogger(child.stdout, util.logger.trace);
	createLogger(child.stderr, util.logger.warn);
	child.on('error', callback);
	child.on('exit', function (ec) {
		if (ec !== 0) {
			return callback(new Error('the ibtool failed running from ' + runDir));
		}
		callback();
	});
}

function runMomcTool (runDir, sdk, args, callback) {
	var spawn = require('child_process').spawn,
		child = spawn('/usr/bin/xcrun', ['--sdk', sdk, 'momc'].concat(args), {cwd: runDir});
	util.logger.debug('running /usr/bin/xcrun momc' + args.join(' ') + ' ' + runDir);
	createLogger(child.stdout, util.logger.trace);
	createLogger(child.stderr, util.logger.warn);
	child.on('error', callback);
	child.on('exit', function (ec) {
		if (ec !== 0) {
			return callback(new Error('the xcrun momc failed running from ' + runDir));
		}
		callback();
	});
}

function runMapcTool (runDir, sdk, args, callback) {
	var spawn = require('child_process').spawn,
		child = spawn('/usr/bin/xcrun', ['--sdk', sdk, 'mapc'].concat(args), {cwd: runDir});
	util.logger.debug('running /usr/bin/xcrun mapc' + args.join(' ') + ' ' + runDir);
	createLogger(child.stdout, util.logger.trace);
	createLogger(child.stderr, util.logger.warn);
	child.on('error', callback);
	child.on('exit', function (ec) {
		if (ec !== 0) {
			return callback(new Error('the xcrun mapc failed running from ' + runDir));
		}
		callback();
	});
}

function compileResources (dir, sdk, appDir, wildcard, callback) {
	// copy them into our target
	var files = recursiveReadDir(dir);
	async.each(files, function (file, cb) {
		var rel = path.basename(path.relative(dir, file));
		var args;
		switch (path.extname(rel)) {
			case '.xib': {
				args = [
					'--reference-external-strings-file',
					'--errors',
					'--output-format', 'binary1',
					'--compile', path.join(appDir, rel.replace(/\.xib$/, '.nib')),
					'--sdk', sdk,
					file
				];
				return runIBTool(path.dirname(file), args, cb);
			}
			case '.xcdatamodel': {
				args = [
					file,
					path.join(appDir, rel.replace(/\.xcdatamodel$/, '.mom'))
				];
				return runMomcTool(path.dirname(file), sdk, args, cb);
			}
			case '.xcdatamodeld': {
				args = [
					file,
					path.join(appDir, rel.replace(/\.xcdatamodeld$/, '.momd'))
				];
				return runMomcTool(path.dirname(file), sdk, args, cb);
			}
			case '.xcmappingmodel': {
				args = [
					file,
					path.join(appDir, rel.replace(/\.xcmappingmodel$/, '.cdm'))
				];
				return runMapcTool(path.dirname(file), sdk, args, cb);
			}
			case '.xcassets': {
				//FIXME:
				break;
			}
			case '.storyboard': {
				args = [
					'--reference-external-strings-file',
					'--errors',
					'--output-format', 'binary1',
					'--compile', path.join(appDir, rel.replace(/\.storyboard$/, '.storyboardc')),
					'--sdk', sdk,
					file
				];
				return runIBTool(path.dirname(file), args, cb);
			}
			default: {
				if (wildcard) {
					if (!/\.(m|mm|h|cpp|hpp|c|s)$/.test(file)) {
						var buf = fs.readFileSync(file);
						var out = path.join(appDir, rel);
						var d = path.dirname(out);
						if (!fs.existsSync(d)) {
							wrench.mkdirSyncRecursive(d);
						}
						util.logger.trace('Copying Resource', chalk.cyan(file), 'to', chalk.cyan(out));
						return fs.writeFile(out, buf, cb);
					}
				}
				break;
			}
		}
		cb();
	}, callback);
}

/**
 * run CocoaPods to build any requires libraries
 */
function runCocoaPodsBuild (basedir, appDir, sdkType, sdkVersion, minSDKVersion, xcodesettings, callback) {
	var spawn = require('child_process').spawn,
		sdk = sdkType + sdkVersion,
		args = [
			'-alltargets',
			'IPHONEOS_DEPLOYMENT_TARGET=' + minSDKVersion,
			'-sdk', sdk
		],
		buildOutDir = path.join(basedir, 'build', 'Release-' + sdkType),
		runDir = path.join(basedir, 'Pods'),
		basename = path.basename(basedir),
		child = spawn(xcodesettings.xcodebuild, args, {cwd:runDir});
	util.logger.debug('running ' + xcodesettings.xcodebuild + ' ' + args.join(' ') + ' ' + runDir);
	util.logger.info('Building ' + chalk.green('CocoaPods') + ' dependencies');
	createLogger(child.stdout, util.logger.trace);
	createLogger(child.stderr, util.logger.warn);
	child.on('error', callback);
	child.on('exit', function (ec) {
		if (ec !== 0) {
			return callback(new Error('the xcodebuild failed running from ' + runDir));
		}
		if (!fs.existsSync(buildOutDir)) {
			return callback(new Error('xcodebuild did not produce the expected CocoaPods libraries at ' + buildOutDir));
		}
		var libs = [];
		// find all the libraries that CocoaPods built (exclude its stub library)
		// and copy any Resources
		async.each(fs.readdirSync(buildOutDir), function (fn, cb) {
			if (/\.a$/.test(fn) && fn.indexOf('libPods-') < 0) {
				libs.push(fn);
				var name = fn.substring(3).replace(/\.a$/, '').trim();
				var dir = path.join(basedir, 'Pods', name, name);
				if (fs.existsSync(dir)) {
					return compileResources(dir, sdk, appDir, true, cb);
				}
			}
			cb();
		});

		return callback(null, libs, buildOutDir);
	});
}

/**
 * parse the xcconfig file
 */
function parseCocoaPodXCConfig (fn) {
	var config = {};
	fs.readFileSync(fn).toString().split('\n').forEach(function (line) {
		var i = line.indexOf(' = ');
		if (i) {
			var k = line.substring(0, i).trim();
			var v = line.substring(i + 2).trim();
			config[k] = v;
		}
	});
	return config;
}

/**
 * generate a map of xcode settings for CocoaPods
 */
function getCocoaPodsXCodeSettings (basedir) {
	var podDir = path.join(basedir, 'Pods');
	if (fs.existsSync(podDir)) {
		var target = path.join(podDir, 'Target Support Files'),
			name = fs.readdirSync(target).filter(function (n) { return n.indexOf('Pods-') === 0; })[0],
			dir = path.join(target, name);
		if (fs.existsSync(dir)) {
			var fn = path.join(dir, name + '.release.xcconfig');
			if (fs.existsSync(fn)) {
				var config = parseCocoaPodXCConfig(fn);
				if (config.PODS_ROOT) {
					// fix the PODS_ROOT to point to the absolute path
					config.PODS_ROOT = path.resolve(podDir);
				}
				return config;
			}
		}
	}
}

function isPodInstalled (callback) {
	var exec = require('child_process').exec;
	return exec('which pod', function (err, stdout) {
		if (err) {
			return callback(new Error('CocoaPods not found in your PATH. You can install CocoaPods with: sudo gem install cocoapods'));
		}
		return callback(null, stdout.trim());
	});
}

function runPodInstallIfRequired(basedir, callback) {
	var Pods = path.join(basedir, 'Pods'),
		Podfile = path.join(basedir, 'Podfile'),
		cacheToken =  crypto.createHash('md5').update(fs.readFileSync(Podfile)).digest('hex'),
		cacheFile = path.join(basedir, 'build', '.podcache');
	if (!fs.existsSync(path.dirname(cacheFile))) {
		wrench.mkdirSyncRecursive(path.dirname(cacheFile));
	}
	if (!fs.existsSync(Pods) || !fs.existsSync(cacheFile) || (fs.existsSync(cacheFile) && fs.readFileSync(cacheFile).toString() !== cacheToken)) {
		isPodInstalled(function (err, pod) {
			if (err) { return callback(err); }
			util.logger.trace('found pod at ' +pod);
			util.logger.info(chalk.green('CocoaPods') + ' dependencies found. This will take a few moments but will be cached for subsequent builds');
			var spawn = require('child_process').spawn;
			var child = spawn(pod, ['install', '--no-integrate'], {cwd:basedir});
			createLogger(child.stdout, util.logger.trace);
			createLogger(child.stderr, util.logger.warn);
			child.on('error', callback);
			child.on('exit', function (ec) {
				if (ec !== 0) {
					return callback(new Error("pod install returned a non-zero exit code"));
				}
				fs.writeFileSync(cacheFile, cacheToken);
				return callback();
			});
		});
	} else {
		callback();
	}
}

function generateCocoaPods (cachedir, basedir, appDir, sdkType, sdkVersion, minSDKVersion, xcodesettings, callback) {
	var Podfile = path.join(basedir, 'Podfile');
	if (!fs.existsSync(Podfile)) {
		util.logger.debug('No CocoaPods file found');
		return callback();
	}
	runPodInstallIfRequired(basedir, function (err) {
		if (err) { return callback(err); }
		runCocoaPodsBuild(basedir, appDir, sdkType, sdkVersion, minSDKVersion, xcodesettings, function (err, libs, libDir) {
			if (err) { return callback(err); }
			var settings = getCocoaPodsXCodeSettings(basedir);
			if (libs && libs.length) {
				settings.LIBRARY_SEARCH_PATHS = (settings.LIBRARY_SEARCH_PATHS  || '$(inherited)') + ' "' + libDir + '"';
			}
			util.logger.trace(chalk.green('CocoaPods') + ' xcode settings will', JSON.stringify(settings, null, 2));
			generateCocoaPodsFrameworks(cachedir, basedir, function (err, includes) {
				return callback(err, settings, includes);
			});
		});
	});
}


// public API
exports.getSystemFrameworks = getSystemFrameworks;
exports.getUserFrameworks = getUserFrameworks;
exports.generateMetabase = generateMetabase;
exports.generateCocoaPods = generateCocoaPods;
exports.compileResources = compileResources;
exports.recursiveReadDir = recursiveReadDir;
exports.generateSwiftMetabase = swiftlilb.generateSwiftMetabase;
exports.generateSwiftMangledClassName = swiftlilb.generateSwiftMangledClassName;

if (module.id === ".") {
	// generateCocoaPods('/Users/jhaynie/work/proto/hyperloop-samples/build', '/Users/jhaynie/work/proto/hyperloop-samples', '/Users/jhaynie/work/proto/hyperloop-samples/build', 'iphonesimulator', '9.0', '7.0', {xcodebuild:'xcodebuild'}, function (err, result) {
	// 	console.log(err, result);
	// });
	// runCocoaPodsBuild('/Users/jhaynie/work/proto/hyperloop-samples', 'iphonesimulator', '9.0', 'xcodebuild', function (err, libs) {
	// 	console.log(libs);
	// });
	// generateCocoaPodsFrameworks('build', '/Users/jhaynie/work/proto/hyperloop-samples', function (err, results) {
	// 	console.log(results);
	// });
	// var hsp  = [
	// 	// "/Users/jhaynie/work/proto/hyperloop-samples/Pods/Headers/Public",
	// 	"/Users/jhaynie/work/proto/hyperloop-samples/Pods/Headers/Public/Stripe",
	// 	"/Users/jhaynie/work/proto/hyperloop-samples/Pods/Headers/Public/Google",
	// 	"/Users/jhaynie/work/proto/hyperloop-samples/Pods/Headers/Public/GoogleAnalytics"
	// ];
	// getUserFrameworks('build', hsp, function (err, results) {
	// 	console.log(results);
	// });
	getSystemFrameworks('build', 'iphonesimulator', '9.0', function (err, json) {
		// console.log(require('util').inspect(json, {colors:true, depth:100}));
		// process.exit(1);
		var includes = [];
		Object.keys(json).forEach(function (k) {
			if (k !== '$metadata') {
				Object.keys(json[k]).forEach(function (cn) {
					includes.push(json[k][cn]);
				});
			}
		});
		// console.log(require('util').inspect(includes, {colors:true, depth:100}));
		// process.exit(1);
		// includes.push(json.Foundation.NSURLSession);
		// includes.push(json.UIKit.UIView);
		// includes.push(json.CoreGraphics.CGRectMake);
		// includes.push(json.Foundation.NSString);
		// includes.push(json.UIKit.UIViewController);
		// includes.push(json.UIKit.UIScreen);
		// includes.push(json.UIKit.NSLayoutConstraint);
		// includes.push(json.UIKit.UILabel);
		// includes.push(json.Foundation.NSMutableAttributedString);
		// includes.push(json.UIKit.NSAttributedString);
		// generateMetabase('build', json.$metadata.sdkType, json.$metadata.sdkPath, json.$metadata.minVersion, includes, false, function (err, result) {
		// 	// console.log(require('util').inspect(result, {colors:true, depth:100}));
		// }, true);
		// includes.push('Stripe/Stripe.h');
		// includes.push('Google/Analytics.h');
		// includes.push('GoogleAnalytics/GAI.h');
		// var hsp  =[
		// 	"/Users/jhaynie/work/proto/hyperloop-samples/Pods/Headers/Public",
		// 	"/Users/jhaynie/work/proto/hyperloop-samples/Pods/Headers/Public/Stripe",
		// 	"/Users/jhaynie/work/proto/hyperloop-samples/Pods/Headers/Public/Google"
		// ];
		var hsp = [];
		generateMetabase('build', json.$metadata.sdkType, json.$metadata.sdkPath, json.$metadata.minVersion, includes, false, function (err, result) {
			// console.log(require('util').inspect(result, {colors:true, depth:100}));
		}, 1, hsp);
	});
}
