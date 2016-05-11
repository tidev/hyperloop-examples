/**
 * Hyperloop ®
 * Copyright (c) 2015-2016 by Appcelerator, Inc.
 * All Rights Reserved. This library contains intellectual
 * property protected by patents and/or patents pending.
 */

'use strict';

module.exports = HyperloopiOSBuilder;

// set this to enforce a ios-min-version
var IOS_MIN = '7.0';
// set this to enforce a minimum Titanium SDK
var TI_MIN = '5.4.0';
// set the iOS SDK minium
var IOS_SDK_MIN = '9.0';

var path = require('path'),
	hm = require('hyperloop-metabase'),
	fs = require('fs'),
	crypto = require('crypto'),
	chalk = hm.chalk,
	async = hm.async,
	wrench = hm.wrench,
	HL = chalk.magenta.inverse('Hyperloop');

/**
 * The Hyperloop builder object. Contains the build logic and state.
 * @class
 * @constructor
 * @param {Object} logger - The Titanium CLI logger.
 * @param {Object} config - The Titanium CLI config.
 * @param {Object} cli - The Titanium CLI instance.
 * @param {Object} appc - Reference to node-appc.
 * @param {Object} hyperloopConfig - Object containing a union of base, local, and user Hyperloop settings.
 * @param {Builder} builder - A platform specific build command Builder object.
 */
function HyperloopiOSBuilder(logger, config, cli, appc, hyperloopConfig, builder) {
	this.logger = logger;
	this.config = config;
	this.cli = cli;
	this.appc = appc;
	this.hyperloopConfig = hyperloopConfig || {};
	this.hyperloopConfig.ios || (this.hyperloopConfig.ios = {});
	this.builder = builder;

	this.resourcesDir = path.join(builder.projectDir, 'Resources');
	this.hyperloopBuildDir = path.join(builder.projectDir, 'build', 'hyperloop', 'ios');
	this.hyperloopJSDir = path.join(this.hyperloopBuildDir, 'js');
	this.hyperloopResourcesDir = path.join(this.builder.xcodeAppDir, 'hyperloop');

	this.forceMetabase = false;
	this.forceStubGeneration = false;
	this.parserState = null;
	this.frameworks = {};
	this.systemFrameworks = {};
	this.includes = [];
	this.swiftSources = [];
	this.jsFiles = {};
	this.references = {};
	this.packages = {};
	this.metabase = {};
	this.nativeModules = {};
	this.buildSettings = {};
	this.headers = null;

	// set our CLI logger
	hm.util.setLog(builder.logger);
}

/**
 * called for each JS resource to process them
 */
HyperloopiOSBuilder.prototype.copyResource = function (builder, callback) {
	this.patchJSFile(builder.args[1], callback);
};

/**
 * The main build logic.
 * @param {Function} callback - A function to call after the logic finishes.
 */
HyperloopiOSBuilder.prototype.init = function init(callback) {
	this.appc.async.series(this, [
		'validate',
		'setup',
		'wireupBuildHooks',
		'getSystemFrameworks',
		'generateCocoaPods',
		'processThirdPartyFrameworks'
	], callback);
};

HyperloopiOSBuilder.prototype.run = function run(builder, callback) {
	var start = Date.now();
	this.logger.info('Starting ' + HL + ' assembly');
	this.appc.async.series(this, [
		'generateSourceFiles',
		'generateSymbolReference',
		'compileResources',
		'generateStubs',
		'copyHyperloopJSFiles',
		'updateXcodeProject'
	], function (err) {
		this.logger.info('Finished ' + HL + ' assembly in ' + (Math.round((Date.now() - start) / 10) / 100) + ' seconds');
		callback(err);
	});
};

/**
 * Validates the settings and environment.
 */
HyperloopiOSBuilder.prototype.validate = function validate() {
	// hyperloop requires a minimum iOS SDK
	if (!this.appc.version.gte(this.builder.iosSdkVersion, IOS_SDK_MIN)) {
		this.logger.error('You cannot use the Hyperloop compiler with a version of iOS SDK older than ' + IOS_SDK_MIN);
		this.logger.error('Please update to the latest iOS SDK and try again.\n');
		process.exit(1);
	}

	// hyperloop requires a later version
	if (!this.appc.version.gte(this.builder.titaniumSdkVersion, TI_MIN)) {
		this.logger.error('You cannot use the Hyperloop compiler with a version of Titanium older than ' + TI_MIN);
		this.logger.error('Set the value of <sdk-version> to a newer version in tiapp.xml.');
		this.logger.error('For example:');
		this.logger.error('	<sdk-version>' + TI_MIN + '.GA</sdk-version>\n');
		process.exit(1);
	}

	// check that hyperloop module was found in the tiapp.xml
	var usingHyperloop = this.builder.tiapp.modules.some(function (m) {
		return m.id === 'hyperloop' && (!m.platform || m.platform.indexOf('ios') !== -1 || m.platform.indexOf('iphone') !== -1);
	});
	if (!usingHyperloop) {
		var pkg = require(path.join(__dirname, '..', 'package.json'));
		this.logger.error('You cannot use the Hyperloop compiler without configuring the module.');
		this.logger.error('Add the following to your tiapp.xml <modules> section:');
		this.logger.error('');
		this.logger.error('	<module version="' + pkg.version + '" platform="ios">hyperloop</module>\n');
		process.exit(1);
	}

	if (!(this.builder.tiapp.properties && this.builder.tiapp.properties.hasOwnProperty('run-on-main-thread') && this.builder.tiapp.properties['run-on-main-thread'].value)) {
		this.logger.error('You cannot use the Hyperloop compiler without configuring iOS to use main thread execution.');
		this.logger.error('Add the following to your tiapp.xml <ti:app> section:');
		this.logger.error('');
		this.logger.error('	<property name="run-on-main-thread" type="bool">true</property>');
		process.exit(1);
	}

	// check for min ios version
	if (this.appc.version.lt(this.builder.minIosVer, IOS_MIN)) {
		this.logger.error('Hyperloop compiler works best with iOS ' + IOS_MIN + ' or greater.');
		this.logger.error('Your setting is currently set to: ' + (this.builder.tiapp.ios['min-ios-ver'] || this.builder.minIosVer));
		this.logger.error('You can change the version by adding the following to your');
		this.logger.error('tiapp.xml <ios> section:');
		this.logger.error('');
		this.logger.error('	<min-ios-ver>' + IOS_MIN + '</min-ios-ver>\n');
		process.exit(1);
	}
};

/**
 * Sets up the build for the Hyperloop module.
 * @param {Function} callback - A function to call when all setup tasks have completed.
 */
HyperloopiOSBuilder.prototype.setup = function setup() {
	// check for built-in JSCore but only warn if not set
	if (this.builder.tiapp.ios['use-jscore-framework'] === undefined) {
		this.logger.info('Hyperloop compiler works best with the built-in iOS JavaScript library.');
		this.logger.info('Add the following to your tiapp.xml <ios> section to enable or disable this:');
		this.logger.info('');
		this.logger.info('	<use-jscore-framework>true</use-jscore-framework>');
		this.logger.info('');
		this.logger.info('Using Apple JavaScriptCore by default when not specified.');
		this.builder.tiapp.ios['use-jscore-framework'] = true;
	}

	// create a temporary hyperloop directory
	if (!fs.existsSync(this.hyperloopBuildDir)) {
		wrench.mkdirSyncRecursive(this.hyperloopBuildDir);
	}

	// update to use the correct libhyperloop based on which JS engine is configured
	this.builder.nativeLibModules.some(function (mod) {
		if (mod.id === 'hyperloop') {
			var frag = this.builder.tiapp.ios['use-jscore-framework'] ? 'js' : 'ti';
			mod.libName = 'libhyperloop-' + frag + 'core.a';
			mod.libFile = path.join(mod.modulePath, mod.libName);
			mod.hash = crypto.createHash('md5').update(fs.readFileSync(mod.libFile)).digest('hex');
			this.logger.debug('Using Hyperloop library -> ' + mod.libName);
			return true;
		}
	}, this);
};

/**
 * Gets the system frameworks from the Hyperloop Metabase.
 */
HyperloopiOSBuilder.prototype.getSystemFrameworks = function getSystemFrameworks(callback) {
	hm.metabase.getSystemFrameworks(this.builder.buildDir, this.builder.xcodeTargetOS, this.builder.minIosVer, function (err, systemFrameworks) {
		if (!err) {
			// setup our system framework mappings
			this.systemFrameworks = systemFrameworks;

			// copy in our system frameworks into frameworks
			// which will include both system and user generated
			Object.keys(systemFrameworks).forEach(function (k) {
				this.frameworks[k] = systemFrameworks[k];
			}, this);
		}

		callback(err);
	}.bind(this));
};

/**
 * Has the Hyperloop Metabase generate the CocoaPods and then adds the symbols to the map of frameworks.
 */
HyperloopiOSBuilder.prototype.generateCocoaPods = function generateCocoaPods(callback) {
	// attempt to handle cocoapods for third-party frameworks
	hm.metabase.generateCocoaPods(this.hyperloopBuildDir, this.builder.projectDir, this.builder.xcodeAppDir, this.builder.xcodeTargetOS, this.builder.iosSdkVersion, IOS_MIN, this.builder.xcodeEnv.executables, function (err, settings, symbols) {
		if (!err) {
			this.buildSettings = settings;
			symbols && Object.keys(symbols).forEach(function (k) {
				this.frameworks[k] = symbols[k];
			}, this);
		}
		callback(err);
	}.bind(this));
};

/**
 * Gets frameworks for any third-party dependencies defined in the Hyperloop config and compiles them.
 */
HyperloopiOSBuilder.prototype.processThirdPartyFrameworks = function processThirdPartyFrameworks(callback) {
	// if we have any custom includes, we need to also add them so we can reference them
	if (!this.hyperloopConfig.ios.thirdparty) {
		return callback();
	}

	var frameworks = this.frameworks;
	var swiftSources = this.swiftSources;
	var hyperloopBuildDir = this.hyperloopBuildDir;
	var thirdparty = this.hyperloopConfig.ios.thirdparty;
	var projectDir = this.builder.projectDir;
	var xcodeAppDir = this.builder.xcodeAppDir;
	var sdk = this.builder.xcodeTargetOS + this.builder.iosSdkVersion;
	var builder = this.builder;
	var allHeaders = this.headers = [];

	function arrayifyAndResolve(it) {
		if (it) {
			return (Array.isArray(it) ? it : [it]).map(function (name) {
				return path.resolve(projectDir, name);
			});
		}
		return null;
	}

	async.eachLimit(Object.keys(thirdparty), 5, function (frameworkName, next) {
		var lib = thirdparty[frameworkName];

		async.series([
			function (cb) {
				var headers = arrayifyAndResolve(lib.header);
				if (headers) {
					Array.prototype.push.apply(allHeaders, headers);
					hm.metabase.getUserFrameworks(
						hyperloopBuildDir,
						headers,
						function (err, includes) {
							if (!err && includes && includes[frameworkName]) {
								frameworks[frameworkName] = includes[frameworkName];
							}
							cb(err);
						},
						frameworkName
					);
				} else {
					cb();
				}
			},

			function (cb) {
				var resources = arrayifyAndResolve(lib.resource);
				if (resources) {
					var extRegExp = /\.(xib|storyboard|m|mm|cpp|h|hpp|swift|xcdatamodel)$/;
					async.eachLimit(resources, 5, function (dir, cb2) {
						// compile the resources (.xib, .xcdatamodel, .xcdatamodeld,
						// .xcmappingmodel, .xcassets, .storyboard)
						hm.metabase.compileResources(dir, sdk, xcodeAppDir, false, function (err) {
							if (!err) {
								builder.copyDirSync(dir, xcodeAppDir, {
									ignoreFiles: extRegExp
								});
							}

							cb2(err);
						});
					}, cb);
				} else {
					cb();
				}
			},

			function (cb) {
				// generate metabase for swift files (if found)
				var sources = arrayifyAndResolve(lib.source);
				var swiftRegExp = /\.swift$/;

				sources && sources.forEach(function (dir) {
					fs.readdirSync(dir).forEach(function (filename) {
						if (swiftRegExp.test(filename)) {
							swiftSources.push({
								framework: frameworkName,
								source: path.join(dir, filename)
							});
						}
					});
				});
				cb();
			}
		], next);
	}, callback);
};

/**
 * Re-write generated JS source
 */
HyperloopiOSBuilder.prototype.patchJSFile = function patchJSFile(file, cb) {
	// look for any require which matches our hyperloop system frameworks
	var contents = fs.readFileSync(file).toString();

	// skip empty content
	if (!contents.length) {
		return cb();
	}

	// parse the contents
	// TODO: move all the regex require stuff into the parser
	this.parserState = hm.generate.parseFromBuffer(contents, file, this.parserState || undefined);

	// empty AST
	if (!this.parserState) {
		return cb();
	}

	var relPath = path.relative(this.resourcesDir, file);

	// get the result source code in case it was transformed and replace all system framework
	// require() calls with the Hyperloop layer
	var newContents = (this.parserState.getSourceCode() || contents).replace(
		/require\s*\([\\"']+([\w_/-\\.]+)[\\"']+\)/ig,
		function (orig, match) {
			// hyperloop includes will always have a slash
			var tok = match.split('/');
			var pkg = tok[0];

			if (pkg === 'alloy' || pkg.charAt(0) === '.' || pkg.charAt(0) === '/') {
				return orig;
			}

			// if we use something like require("UIKit")
			// that should require the helper such as require("UIKit/UIKit");
			var className = tok[1] || pkg;
			var framework = this.frameworks[pkg];
			var include = framework && framework[className];
			var isBuiltin = pkg === 'Titanium';

			// if the framework is not found, then check if it was possibly mispelled
			if (!framework && !isBuiltin) {
				var pkgSoundEx = soundEx(pkg);
				var maybes = Object.keys(this.frameworks).filter(function (frameworkName) {
					return soundEx(frameworkName) === pkgSoundEx;
				});

				if (maybes.length) {
					this.logger.warn('The iOS framework "' + pkg + '" could not be found. Are you trying to use ' +
						maybes.map(function (s) { return '"' + s + '"' }).join(' or ') + ' instead? (' + relPath + ')');
				}

				return orig;
			}

			// remember our packages
			if (!isBuiltin) {
				this.packages[pkg] = 1;
			}

			// if we haven't found it by now, then we try to help before failing
			if (!include && className !== pkg && !isBuiltin) {
				var classNameSoundEx = soundEx(className);

				Object.keys(this.frameworks).forEach(function (frameworkName) {
					if (this.frameworks[frameworkName][className]) {
						throw new Error('Are you trying to use the iOS class "' + className + '" located in the framework "' + frameworkName + '", not in "' + pkg + '"? (' + relPath + ')');
					}

					if (soundEx(frameworkName) === classNameSoundEx) {
						throw new Error('The iOS class "' + className + '" could not be found in the framework "' + pkg + '". Are you trying to use "' + frameworkName + '" instead? (' + relPath+ ')');
					}
				}, this);

				throw new Error('The iOS class "' + className + '" could not be found in the framework "' + pkg + '". (' + relPath + ')');
			}

			var ref = 'hyperloop/' + pkg.toLowerCase() + '/' + className.toLowerCase();
			this.references[ref] = 1;

			if (include) {
				// record our includes in which case we found a match
				this.includes[include] = 1;
			}

			// replace the require to point to our generated file path
			return "require('" + ref + "')";
		}.bind(this));

		if (contents === newContents) {
			this.logger.debug('No change, skipping ' + chalk.cyan(file));
			cb();
		} else {
			this.logger.debug('Writing ' + chalk.cyan(file));
			fs.writeFile(file, newContents, cb);
		}
};

/**
 * Generates the metabase from the required Hyperloop files and then generate the source the source
 * files from that metabase.
 */
HyperloopiOSBuilder.prototype.generateSourceFiles = function generateSourceFiles(callback) {
	// no hyperloop files detected, we can stop here
	if (!this.includes.length && !Object.keys(this.references).length) {
		this.logger.info('Skipping ' + HL + ' compile, no usage found ...');
		return callback();
	}

	fs.existsSync(this.hyperloopJSDir) || wrench.mkdirSyncRecursive(this.hyperloopJSDir);

	if (this.builder.forceCleanBuild || this.forceMetabase) {
		this.logger.trace('Forcing a metabase rebuild');
	} else {
		this.logger.trace('Not necessarily forcing a metabase rebuild if already cached');
	}

	function generateMetabaseCallback(err, metabase, outfile, header, cached) {
		if (err) {
			return callback(err);
		}

		this.metabase = metabase;

		if (cached && this.swiftSources.length === 0 && !this.forceMetabase) {
			// if cached, skip generation
			this.logger.info('Skipping ' + HL + ' compile, already generated...');
			return callback();
		}

		// this has to be serial because each successful call to generateSwiftMetabase() returns a
		// new metabase object that will be passed into the next file
		async.eachSeries(this.swiftSources, function (entry, cb) {
			this.logger.info('Generating metabase for swift ' + chalk.cyan(entry.framework + ' ' + entry.source));
			hm.metabase.generateSwiftMetabase(
				this.hyperloopBuildDir,
				this.frameworks.$metadata.sdkType,
				this.frameworks.$metadata.sdkPath,
				this.frameworks.$metadata.minVersion,
				this.builder.xcodeTargetOS,
				this.metabase,
				entry.framework,
				entry.source,
				function (err, result, newMetabase) {
					if (!err) {
						this.metabase = newMetabase;
					} else if (result) {
						this.logger.error(result);
					}
					cb(err);
				}.bind(this)
			);
		}.bind(this), callback);
	}

	// generate the metabase from our includes
	hm.metabase.generateMetabase(
		this.hyperloopBuildDir,
		this.frameworks.$metadata.sdkType,
		this.frameworks.$metadata.sdkPath,
		this.frameworks.$metadata.minVersion,
		Object.keys(this.includes),
		false, // don't exclude system libraries
		generateMetabaseCallback.bind(this),
		this.builder.forceCleanBuild || this.forceMetabase
	);
};

/**
 * Generates the symbol reference based on the references from the metabase's parser state.
 */
HyperloopiOSBuilder.prototype.generateSymbolReference = function generateSymbolReference() {

	if (!this.parserState) {
		this.logger.info('Skipping ' + HL + ' generating of symbol references. Empty AST. ');
		return;
	}
	var symbolRefFile = path.join(this.hyperloopBuildDir, 'symbol_references.json'),
		json = JSON.stringify(this.parserState.getReferences(), null, 2);
	if (!fs.existsSync(symbolRefFile) || fs.readFileSync(symbolRefFile).toString() !== json) {
		this.forceStubGeneration = true;
		this.logger.trace('Forcing regeneration of wrappers');
		fs.writeFileSync(symbolRefFile, json);
	} else {
		this.logger.trace('Symbol references up-to-date');
	}
};

/**
 * Compiles the resources from the metabase.
 */
HyperloopiOSBuilder.prototype.compileResources = function compileResources(callback) {
	var sdk = this.builder.xcodeTargetOS + this.builder.iosSdkVersion;
	hm.metabase.compileResources(this.resourcesDir, sdk, this.builder.xcodeAppDir, false, callback);
};

/**
 * Generates stubs from the metabase.
 */
HyperloopiOSBuilder.prototype.generateStubs = function generateStubs(callback) {

	if (!this.parserState) {
		this.logger.info('Skipping ' + HL + ' stub generation. Empty AST.');
		return callback();
	}
	if (!this.forceStubGeneration) {
		this.logger.debug('Skipping stub generation');
		return callback();
	}

	// now generate the stubs
	this.logger.debug('Generating stubs');
	hm.generate.generateFromJSON(
		this.builder.tiapp.name,
		this.hyperloopJSDir,
		this.metabase,
		this.parserState,
		callback,
		this.frameworks
	);
};

/**
 * Copies Hyperloop generated JavaScript files into the app's `Resources/hyperloop` directory.
 */
HyperloopiOSBuilder.prototype.copyHyperloopJSFiles = function copyHyperloopJSFiles() {
	// copy any native generated file references so that we can compile them
	// as part of xcodebuild
	var keys = Object.keys(this.references);

	// only if we found references, otherwise, skip
	if (!keys.length) {
		return;
	}

	// check to see if we have any specific file native modules and copy them in
	keys.forEach(function (ref) {
		var file = path.join(this.hyperloopJSDir, ref.replace(/^hyperloop\//, '') + '.m');
		if (fs.existsSync(file)) {
			this.nativeModules[file] = 1;
		}
	}, this);

	// check to see if we have any package modules and copy them in
	Object.keys(this.packages).forEach(function (pkg) {
		var file = path.join(this.hyperloopJSDir, pkg.toLowerCase() + '/' + pkg.toLowerCase() + '.m');
		if (fs.existsSync(file)) {
			this.nativeModules[file] = 1;
		}
	}, this);

	var builder = this.builder,
		logger = this.logger,
		jsRegExp = /\.js$/;

	(function scan(srcDir, destDir) {
		fs.readdirSync(srcDir).forEach(function (name) {
			var srcFile = path.join(srcDir, name),
				srcStat = fs.statSync(srcFile);

			if (srcStat.isDirectory()) {
				return scan(srcFile, path.join(destDir, name));
			}

			if (!jsRegExp.test(name)) {
				return;
			}

			var rel = path.relative(builder.projectDir, srcFile),
				destFile = path.join(destDir, name),
				destExists = fs.existsSync(destFile),
				srcMtime = JSON.parse(JSON.stringify(srcStat.mtime)),
				prev = builder.previousBuildManifest.files && builder.previousBuildManifest.files[rel],
				contents = null,
				hash = null,
				changed = !destExists || !prev || prev.size !== srcStat.size || prev.mtime !== srcMtime || prev.hash !== (hash = builder.hash(contents = fs.readFileSync(srcFile).toString()));

			builder.unmarkBuildDirFiles(destFile);

			builder.currentBuildManifest.files[rel] = {
				hash:  contents === null && prev ? prev.hash  : hash || builder.hash(contents || ''),
				mtime: contents === null && prev ? prev.mtime : srcMtime,
				size:  contents === null && prev ? prev.size  : srcStat.size
			};

			if (changed) {
				logger.debug('Writing ' + chalk.cyan(destFile));
				fs.existsSync(destDir) || wrench.mkdirSyncRecursive(destDir);
				fs.writeFileSync(destFile, contents || fs.readFileSync(srcFile).toString());
			} else {
				logger.trace('No change, skipping ' + chalk.cyan(destFile));
			}
		});
	}(this.hyperloopJSDir, this.hyperloopResourcesDir));

};

/**
 * Wire up the build hooks.
 */
HyperloopiOSBuilder.prototype.wireupBuildHooks = function wireupBuildHooks() {
	this.cli.on('build.ios.xcodeproject', {
		pre: this.hookUpdateXcodeProject.bind(this)
	});

	this.cli.on('build.ios.copyResource', {
		post: this.copyResource.bind(this)
	});

	this.cli.on('build.pre.build', {
		pre: this.run.bind(this)
	});

	this.cli.on('build.ios.removeFiles', {
		pre: this.hookRemoveFiles.bind(this)
	});

	this.cli.on('build.ios.xcodebuild', {
		pre: this.hookXcodebuild.bind(this)
	});
};

/**
 * The Xcode project build hook handler. Injects frameworks and source files into the Xcode project.
 * @param {Object} data - The hook payload.
 */
HyperloopiOSBuilder.prototype.hookUpdateXcodeProject = function hookUpdateXcodeProject(data) {
	this.xcodeprojectdata = data;
};

/**
 * Injects frameworks and source files into the Xcode project and regenerates it
 */
HyperloopiOSBuilder.prototype.updateXcodeProject = function updateXcodeProject() {
	var data = this.xcodeprojectdata;
	var nativeModules = Object.keys(this.nativeModules);

	if (!nativeModules.length) {
		return;
	}

	var projectDir = this.builder.projectDir;
	var appName = this.builder.tiapp.name;
	var xcodeProject = data.args[0];
	var xobjs = xcodeProject.hash.project.objects;
	var projectUuid = xcodeProject.hash.project.rootObject;
	var pbxProject = xobjs.PBXProject[projectUuid];
	var mainTargetUuid = pbxProject.targets.filter(function (t) { return t.comment.replace(/^"/, '').replace(/"$/, '') === appName; })[0].value;
	var mainTarget = xobjs.PBXNativeTarget[mainTargetUuid];
	var mainGroupChildren = xobjs.PBXGroup[pbxProject.mainGroup].children;

	// find all the frameworks
	var frameworks = {};
	Object.keys(xobjs.PBXFrameworksBuildPhase).forEach(function (id) {
		if (xobjs.PBXFrameworksBuildPhase[id] && typeof xobjs.PBXFrameworksBuildPhase[id] === 'object') {
			xobjs.PBXFrameworksBuildPhase[id].files.forEach(function (file) {
				var name = xobjs.PBXBuildFile[file.value].fileRef_comment;
				frameworks[name] = 1;
			});
		}
	});

	// once Titanium SDK 5.x is no longer supported, we can remove this shim
	if (typeof this.builder.generateXcodeUuid !== 'function') {
		var uuidIndex = 1;
		var uuidRegExp =/^(0{18}\d{6})$/;
		var lpad = this.appc.string.lpad;

		Object.keys(xobjs).forEach(function (section) {
			Object.keys(xobjs[section]).forEach(function (uuid) {
				var m = uuid.match(uuidRegExp);
				var n = m && parseInt(m[1]);
				if (n && n > uuidIndex) {
					uuidIndex = n + 1;
				}
			});
		});

		this.builder.generateXcodeUuid = function generateXcodeUuid() {
			return lpad(uuidIndex++, 24, '0');
		};
	}

	var generateUuid = this.builder.generateXcodeUuid.bind(this.builder, xcodeProject);

	var frameworksGroup = xobjs.PBXGroup[mainGroupChildren.filter(function (child) { return child.comment === 'Frameworks'; })[0].value];
	var frameworksBuildPhase = xobjs.PBXFrameworksBuildPhase[mainTarget.buildPhases.filter(function (phase) { return xobjs.PBXFrameworksBuildPhase[phase.value]; })[0].value];
	var frameworkRegExp = /\.framework$/;
	var frameworksToAdd = [];

	// make sure our found frameworks are in the xcode project and if not found,
	// we are going to add it
	Object.keys(this.packages).forEach(function (pkg) {
		if (this.systemFrameworks[pkg]) {
			frameworksToAdd.push(pkg);
		}
	}, this);

	// attempt to add any custom configured frameworks
	if (this.hyperloopConfig.ios.xcodebuild && Array.isArray(this.hyperloopConfig.ios.xcodebuild.frameworks)) {
		this.hyperloopConfig.ios.xcodebuild.frameworks.forEach(function (framework) {
			framework && frameworksToAdd.push(framework);
		});
	}

	// add the frameworks to the Xcode project
	frameworksToAdd.forEach(function (framework) {
		if (!frameworkRegExp.test(framework)) {
			framework += '.framework';
		}
		if (frameworks[framework]) {
			return;
		}
		frameworks[framework] = 1;

		var fileRefUuid = generateUuid();
		var buildFileUuid = generateUuid();

		// add the file reference
		xobjs.PBXFileReference[fileRefUuid] = {
			isa: 'PBXFileReference',
			lastKnownFileType: 'wrapper.framework',
			name: '"' + framework + '"',
			path: '"System/Library/Frameworks/' + framework + '"',
			sourceTree: 'SDKROOT'
		};
		xobjs.PBXFileReference[fileRefUuid + '_comment'] = framework;

		// add the library to the Frameworks group
		frameworksGroup.children.push({
			value: fileRefUuid,
			comment: framework
		});

		// add the build file
		xobjs.PBXBuildFile[buildFileUuid] = {
			isa: 'PBXBuildFile',
			fileRef: fileRefUuid,
			fileRef_comment: framework
		};
		xobjs.PBXBuildFile[buildFileUuid + '_comment'] = framework + ' in Frameworks';

		frameworksBuildPhase.files.push({
			value: buildFileUuid,
			comment: framework + ' in Frameworks'
		});
	});

	// create a Hyperloop group so that the code is nice and tidy in the Xcode project
	var hyperloopGroupUuid = (mainGroupChildren.filter(function (child) { return child.comment === 'Hyperloop'; })[0] || {}).value;
	var hyperloopGroup = hyperloopGroupUuid && xobjs.PBXGroup[hyperloopGroupUuid];
	if (!hyperloopGroup) {
		hyperloopGroupUuid = generateUuid();
		mainGroupChildren.push({
			value: hyperloopGroupUuid,
			comment: 'Hyperloop'
		});

		hyperloopGroup = {
			isa: 'PBXGroup',
			children: [],
			name: 'Hyperloop',
			sourceTree: '"<group>"'
		};

		xobjs.PBXGroup[hyperloopGroupUuid] = hyperloopGroup;
		xobjs.PBXGroup[hyperloopGroupUuid + '_comment'] = 'Hyperloop';
	}

	var swiftRegExp = /\.swift$/;
	var containsSwift = false;
	var groups = {};

	// add any source files we want to include in the compile
	if (this.hyperloopConfig.ios.thirdparty) {
		var objcRegExp = /\.mm?$/;
		Object.keys(this.hyperloopConfig.ios.thirdparty).forEach(function (framework) {
			var source = this.hyperloopConfig.ios.thirdparty[framework].source;
			if (!source) {
				return;
			}

			if (!Array.isArray(source)) {
				source = [source];
			}

			groups[framework] || (groups[framework] = {});

			source
				.map(function (src) {
					return path.join(projectDir, src);
				})
				.forEach(function walk(file) {
					if (fs.existsSync(file)) {
						if (fs.statSync(file).isDirectory()) {
							fs.readdirSync(file).forEach(function (name) {
								walk(path.join(file, name));
							});
						} else if (objcRegExp.test(file)) {
							groups[framework][file] = 1;
						} else if (swiftRegExp.test(file)) {
							containsSwift = true;
							groups[framework][file] = 1;
						}
					}
				});
		}, this);
	}

	// if we have any swift files, enable swift support
	if (containsSwift) {
		Object.keys(xobjs.PBXNativeTarget).forEach(function (targetUuid) {
			var target = xobjs.PBXNativeTarget[targetUuid];
			if (target && typeof target === 'object') {
				xobjs.XCConfigurationList[target.buildConfigurationList].buildConfigurations.forEach(function (buildConf) {
					var buildSettings = xobjs.XCBuildConfiguration[buildConf.value].buildSettings;
					buildSettings.EMBEDDED_CONTENT_CONTAINS_SWIFT = 'YES';

					// LD_RUNPATH_SEARCH_PATHS is a space separated string of paths
					var searchPaths = (buildSettings.LD_RUNPATH_SEARCH_PATHS || '').replace(/^"/, '').replace(/"$/, '');
					if (searchPaths.indexOf('$(inherited)') === -1) {
						searchPaths += ' $(inherited)';
					}
					if (searchPaths.indexOf('@executable_path/Frameworks') === -1) {
						searchPaths += ' @executable_path/Frameworks';
					}
					buildSettings.LD_RUNPATH_SEARCH_PATHS = '"' + searchPaths.trim() + '"';
				});
			}
		});
	}

	// add the source files to xcode to compile
	if (nativeModules.length) {
		groups['Native'] || (groups['Native'] = {});
		nativeModules.forEach(function (mod) {
			groups['Native'][mod] = 1;
		});
	}

	// check to see if we compiled a custom class and if so, we need to add it to the project
	var customClass = path.join(this.hyperloopJSDir, 'hyperloop', 'custom.m');
	if (fs.existsSync(customClass)) {
		groups['Custom'] || (groups['Custom'] = {});
		groups['Custom'][customClass] = 1;
	}

	var sourcesBuildPhase = xobjs.PBXSourcesBuildPhase[mainTarget.buildPhases.filter(function (phase) { return xobjs.PBXSourcesBuildPhase[phase.value]; })[0].value];

	// loop over the groups and the files in each group and add them to the Xcode project
	Object.keys(groups).forEach(function (groupName) {
		var groupUuid = generateUuid();

		hyperloopGroup.children.push({
			value: groupUuid,
			comment: groupName
		});

		var group = {
			isa: 'PBXGroup',
			children: [],
			name: '"' + groupName + '"',
			sourceTree: '"<group>"'
		};

		xobjs.PBXGroup[groupUuid] = group
		xobjs.PBXGroup[groupUuid + '_comment'] = groupName;

		Object.keys(groups[groupName]).forEach(function (file) {
			var name = path.basename(file);
			var fileRefUuid = generateUuid();
			var buildFileUuid = generateUuid();

			// add the file reference
			xobjs.PBXFileReference[fileRefUuid] = {
				isa: 'PBXFileReference',
				fileEncoding: 4,
				lastKnownFileType: 'sourcecode.' + (swiftRegExp.test(file) ? 'swift' : 'c.objc'),
				name: '"' + name + '"',
				path: '"' + file + '"',
				sourceTree: '"<absolute>"'
			};
			xobjs.PBXFileReference[fileRefUuid + '_comment'] = name;

			// add the library to the Frameworks group
			group.children.push({
				value: fileRefUuid,
				comment: name
			});

			// add the build file
			xobjs.PBXBuildFile[buildFileUuid] = {
				isa: 'PBXBuildFile',
				fileRef: fileRefUuid,
				fileRef_comment: name,
				settings: {COMPILER_FLAGS : '"-fobjc-arc"' }
			};
			xobjs.PBXBuildFile[buildFileUuid + '_comment'] = name + ' in Sources';

			sourcesBuildPhase.files.push({
				value: buildFileUuid,
				comment: name + ' in Sources'
			});
		});
	});

	var contents = xcodeProject.writeSync(),
		dest = xcodeProject.filepath,
		parent = path.dirname(dest),
		i18n = this.appc.i18n(__dirname),
		__ = i18n.__;

	if (!fs.existsSync(dest) || contents !== fs.readFileSync(dest).toString()) {
		if (!this.forceRebuild) {
			this.logger.info(__('Forcing rebuild: Xcode project has changed since last build'));
			this.forceRebuild = true;
		}
		this.logger.debug(__('Writing %s', dest.cyan));
		fs.existsSync(parent) || wrench.mkdirSyncRecursive(parent);
		fs.writeFileSync(dest, contents);
	} else {
		this.logger.trace(__('No change, skipping %s', dest.cyan));
	}

};

/**
 * Clean up unwanted files.
 * @param {Object} data - The hook payload.
 */
HyperloopiOSBuilder.prototype.hookRemoveFiles = function hookRemoveFiles(data) {
	// remove empty Framework directory that might have been created by cocoapods
	var frameworksDir = path.join(this.builder.xcodeAppDir, 'Frameworks');
	if (fs.existsSync(frameworksDir) && fs.readdirSync(frameworksDir).length === 0) {
		wrench.rmdirSyncRecursive(frameworksDir);
	}
};

/**
 * Inject additional parameters into the xcodebuild arguments.
 * @param {Object} data - The hook payload.
 */
HyperloopiOSBuilder.prototype.hookXcodebuild = function hookXcodebuild(data) {
	var params = {};

	function addParam(key, value) {
		if (!params[key]) {
			params[key] = [];
		}
		if (params[key].indexOf(value) === -1) {
			params[key].push(value);
		}
	}

	// speed up the build by only building the target architecture
	if (this.builder.deployType === 'development' && this.builder.target === 'simulator') {
		addParam('ONLY_ACTIVE_ARCH', 1);
	}

	// add any compiler specific flags
	if (this.hyperloopConfig.ios.xcodebuild && this.hyperloopConfig.ios.xcodebuild.flags) {
		Object.keys(this.hyperloopConfig.ios.xcodebuild.flags).forEach(function (key) {
			addParam(key, this.hyperloopConfig.ios.xcodebuild.flags[key]);
		}, this);
	}

	// add any build settings from the generate cocoapods phase
	this.buildSettings && Object.keys(this.buildSettings).forEach(function (key) {
		addParam(key, this.buildSettings[key]);
	}, this);

	// add our header include paths if we have custom ones
	if (this.headers) {
		addParam('HEADER_SEARCH_PATHS', '$(inherited)');
		this.headers.forEach(function (header) {
			addParam('HEADER_SEARCH_PATHS', header);
		});
	}

	addParam('GCC_PREPROCESSOR_DEFINITIONS', '$(inherited) HYPERLOOP=1');

	// inject the params into the xcodebuild args
	var args = data.args[1];
	var quotesRegExp = /^\".*\"$/;
	Object.keys(params).forEach(function (key) {
		var value = params[key];
		if (value.indexOf(' ') !== -1 && !quotesRegExp.test(value)) {
			value = '"' + value + '"';
		}

		// check if the param is already in the xcodebuild arguments
		for (var i = 0; i < args.length; i++) {
			var parts = args[i].split('=');
			if (parts.length > 1 && parts[0] === key) {
				// yes, so merge the values
				var values = parts[1].match(/(?:[^\s"]+|"[^"]*")+/g);
				if (values.indexOf(value) === -1) {
					args[i] = key + '=' + parts[1] + ' ' + value;
				}
				return;
			}
		}

		// param does not exist, so just add it
		args.push(key + '=' + params[key]);
	});
};

/**
 * Computes the soundex for a string.
 * https://github.com/LouisT/node-soundex/blob/master/index.js
 * @param {String} str - The string to analyze.
 * @param {Boolean} [scale=false] - If true, a Higgs boson is created.
 * @returns {String}
 */
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

	var build = split.map(function (letter) {
		for (var num in keys) {
			if (keys[num].indexOf(letter) != -1) {
				return map[keys[num]];
			}
		}
	});
	var first = build.shift();

	build = build.filter(function (num, index, array) {
		return ((index === 0) ? num !== first : num !== array[index - 1]);
	});

	var len = build.length,
		max = (scale ? ((max = ~~((len * 2 / 3.5))) > 3 ? max : 3) : 3);

	return split[0] + (build.join('') + (new Array(max + 1).join('0'))).slice(0, max);
}
