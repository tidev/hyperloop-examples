/**
 * Android hyperloop JS proxy generation.
 */
var metabase = require('./metabase'),
	fs = require('fs'),
	wrench = require('wrench'),
	path = require('path'),
	async = require('async'),
	ejs = require('ejs'),
	util = require('./util'),
	CLASS_TEMPLATE = fs.readFileSync(path.join(__dirname, 'templates', 'class.ejs')).toString(),
	INTERFACE_TEMPLATE = fs.readFileSync(path.join(__dirname, 'templates', 'interface.ejs')).toString(),
	PACKAGE_TEMPLATE = fs.readFileSync(path.join(__dirname, 'templates', 'package.ejs')).toString();

/**
 * Given the metabase's definition for a class, generate a JS proxy wrapper from an EJS template and return the JS source.
 *
 * @param {Object}   The class definition from the metabase.
 *
 * @returns {String} populated class template
 **/
function generateClass(classDefinition) {
	if (classDefinition.metatype == 'interface') {
		return ejs.render(INTERFACE_TEMPLATE, {classDefinition: classDefinition});
	}
	return ejs.render(CLASS_TEMPLATE, {classDefinition: classDefinition});
}

/**
 * Given the definition for a package, generate a JS proxy wrapper from an EJS template and return the JS source.
 *
 * @param {Object}   The package definition from the metabase.
 *
 * @returns {String} populated package template
 **/
function generatePackage(packageDefinition) {
	return ejs.render(PACKAGE_TEMPLATE, {packageDefinition: packageDefinition});
}

/**
 * Expand all transitive dependencies for given set of class names.
 *
 * @param {Object}   The generated metabase
 * @param {String}   The name of the class we're trying to expand out
 * @param {Array[String]} An array keeping track of classes we've already done.
 *
 * @returns {Array[String]} full set of classes for this class.
 **/
function expandClassDependencies(metabaseJSON, className, done) {
	var expanded = [],
		classDef = metabaseJSON.classes[className];

	// no class by this name in the metabase, need no dependencies (including this class!)
	// This also catches primitives from being added.
	if (!classDef) {
		return expanded;
	}

	// Avoid checking the same type repeatedly
	// if we've done this type before, return empty array and move on
	if (done.indexOf(className) != -1) {
		return expanded;
	}
	// Mark that we visited this type so we don't multiple times
	done.push(className);

	//util.logger.trace('Expanding: ' + className);

	// Include this class in our dependency list
	expanded.push(className);

	// Add superclass
	if (classDef.superClass) {
		expanded = expanded.concat(expandClassDependencies(metabaseJSON, classDef.superClass, done));
	}

	// Method arguments and return types
	for (var methodName in classDef.methods) {
		var methodOverloads = classDef.methods[methodName];
		for (var j = 0; j < methodOverloads.length; j++) {
			var methodDef = methodOverloads[j];
			expanded = expanded.concat(expandClassDependencies(metabaseJSON, methodDef.returnType, done));
			for (var k = 0; k < methodDef.args.length; k++) {
				var arg = methodDef.args[k];
				expanded = expanded.concat(expandClassDependencies(metabaseJSON, arg.type, done));
			}
		}
	}

	// field/constant types
	for (var propertyName in classDef.properties) {
		var propertyDefinition = classDef.properties[propertyName];
		expanded = expanded.concat(expandClassDependencies(metabaseJSON, propertyDefinition.type, done));
	}

	// if this is an innerclass, add it's enclosing class as dependency
	if (className.indexOf('$') != -1) {
		// inner class, add it's enclosing class as dependency
		expanded.push(className.slice(0, className.indexOf('$')));
	} else {
		// if this is not an inner class, add any inner classes underneath it as dependencies
		for (var otherClass in metabaseJSON.classes) {
			if (otherClass.indexOf(className + '$') == 0) {
				classDef.innerClasses = classDef.innerClasses || [];
				classDef.innerClasses.push(otherClass);
				expanded.push(otherClass);
			}
		}
	}

	return expanded;
}

/**
 * Expand all transitive dependencies for given set of class names.
 *
 * @param {Object}   The generated metabase
 * @param {Array[String]}    Array of String, names of the classes to limit to. We need to expand to all dependencies
 *
 * @returns {Array[String]} full set of classes we need based on the input array of classnames.
 **/
function expandDependencies(metabaseJSON, classes) {
	var expanded = [],
		done = [];
	for (var i = 0; i < classes.length; i++) {
		expanded = expanded.concat(expandClassDependencies(metabaseJSON, classes[i], done));
	}
	// Sort by name and remove duplicates
	expanded = expanded.sort();
	expanded = expanded.filter(function(elem, pos) {
		return expanded.indexOf(elem) == pos;
	});
	return expanded;
}

/**
 * Replaces special reserved words/names with sanitized versions safe to use as JS variable names.
 * @param  {String} name The original name of the base variable/type/package
 * @return {String}      The sanitized/safe-to-use-as-a-JS-identifier version.
 */
function safeName(name) {
	// Replace keywords
	if (name.match(/^(case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|undefined|var|void|volatile|while|with|yield)$/)) {
		return '_' + name;
	}
	// Replace builtin types
	if (name.match(/^(Array|ArrayBuffer|Atomics|Boolean|DataView|Date|Error|EvalError|Float32Array|Float64Array|Function|Generator|GeneratorFunction|Infinity|Int16Array|Int32Array|Int8Array|InternalError|Intl|Collator|DateTimeFormat|NumberFormat|Iterator|JSON|Map|Math|NaN|Number|Object|ParallelArray|Promise|Proxy|RangeError|ReferenceError|Reflect|RegExp|SIMD|Set|SharedArrayBuffer|StopIteration|String|Symbol|SyntaxError|TypeError|TypedArray|URIError|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|WeakMap|WeakSet)$/)) {
		return '_' + name;
	}
	// Replace builtin functions
	if (name.match(/^(decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|escape|eval|isFinite|isNaN|parseFloat|parseInt|unescape|uneval)$/)) {
		return '_' + name;
	}
	return name;
}

/**
 * Generate JS proxy wrappers from the metabase.
 * On completion, the callback will be called.
 *
 * @param {String}   output directory for JS wrappers
 * @param {Object}   The generated metabase
 * @param {Array}    Array of String, names of the classes to limit to. We need to expand to all dependencies
 * @param {Function} callback Executed upon completion or error
 *
 * @returns {void}
 **/
function generateFromJSON(dir, metabaseJSON, classes, callback) {
	var className = '',
		packages = {};

	if (fs.existsSync(dir)) {
		wrench.rmdirSyncRecursive(dir);
	}
	fs.mkdirSync(dir);

	// TODO Do we need to write the date? What should we use as the cache key? SHA/HASH of the json from metabase?
	fs.writeFile(path.join(dir, 'version.json'), "{ 'version': " + String(Date.now()) + " }", function (err) {
		if (err) {
			callback(err);
		}
	});

	classes = classes || [];
	if (classes.length > 0) {
		classes = expandDependencies(metabaseJSON, classes);
	} else {
		// empty array, means do them all
		classes = Object.keys(metabaseJSON.classes);
	}

	// Write out our JS wrappers up to 25 at a time async
	async.eachLimit(classes, 25, function(className, next) {
		var json = metabaseJSON.classes[className],
			dest = path.join(dir, className + '.js'),
			parts = className.replace('$', '.').split('.'),
			baseName = parts[parts.length - 1],
			contents = '',
			packageName = className.slice(0, className.lastIndexOf('.')),
			packageArray = packages[packageName] || [],
			packageParts = packageName.split('.');
		packageArray.push(className);
		packages[packageName] = packageArray;
		// Generate package entries all the way up!
		for (var i = 0; i < packageParts.length - 1; i++) {
			var tmpPackageName = packageParts.slice(0, i + 1).join('.');
			packages[tmpPackageName] = packages[tmpPackageName] || {};
		}

		json.name = className;
		json.safeName = safeName(baseName);
		contents = generateClass(json);
		// TODO Don't write out contents if they haven't changed
		fs.writeFile(dest, contents, function(err) {
			if (err) {
				next(err);
			} else {
				util.logger.trace('JS Wrapper for class ' + className + ' created...');
				next();
			}
		});
	}, function (err, result) {
		if (err) {
			callback(err);
		}

		// Write out our JS package wrappers up to 10 at a time async
		async.eachLimit(Object.keys(packages), 10, function(packageName, next) {
			var parts = packageName.split('.'),
				json = {
					classes: packages[packageName],
					name: packageName,
					safeName: safeName(parts[parts.length - 1])
				},
				dest = path.join(dir, packageName + '.js'),
				contents = '';
			contents = generatePackage(json);
			// TODO Don't write out contents if they haven't changed
			fs.writeFile(dest, contents, function(err) {
				if (err) {
					next(err);
				} else {
					util.logger.trace('JS Wrapper for package ' + packageName + ' created...');
					next();
				}
			});
		}, callback);
	});
}

exports.generateFromJSON = generateFromJSON;

// standalone metabase/wrapper generator
if (!module.parent) {
	var outputDir = path.join(__dirname, 'hyperloop'),
		ANDROID_API_LEVEL = 'android-10',
		classpathToAdd = process.argv[2] || '~/Library/android-sdk-macosx/platforms/' + ANDROID_API_LEVEL + '/android.jar';
	metabase.loadMetabase(classpathToAdd, {platform: ANDROID_API_LEVEL}, [], function(e, data) {
		if (e) {
			util.logger.error(e);
		} else {
			generateFromJSON(outputDir, data, function(err) {
				if (err) {
					util.logger.error(err);
				}
			});
		}
	});
}
