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
	INTERFACE_TEMPLATE = fs.readFileSync(path.join(__dirname, 'templates', 'interface.ejs')).toString();

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
	var className = '';

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
			contents = '';
		json.name = className;
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
	}, callback);
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
