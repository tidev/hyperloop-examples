/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
var util = require('./util'),
	path = require('path'),
	fs = require('fs');

function makeModule (json, module, state) {
	var entry = {
		class: {
			name: module.name,
			properties: [],
			class_methods: [],
			obj_class_method: [],
			static_variables: {},
			blocks: module.blocks
		},
		framework: module.framework,
		filename: module.filename,
		imports: {},
		frameworks: module.frameworks || {}
	};
	// filter static variables
	module.static_variables && Object.keys(module.static_variables).forEach(function (name) {
		if (state.isSetterPropertyReferenced(name) || state.isGetterPropertyReferenced(name)) {
			var v = module.static_variables[name];
			entry.class.static_variables[name] = v;
		}
	});
	// functions
	module.functions.forEach(function (fn) {
		if (/^__/.test(fn.name)) {
			return;
		}
		if (state.isFunctionReferenced(fn.name)) {
			entry.class.class_methods.push(util.generateFunction(entry, json, fn));
			var code = util.generateObjCFunction(entry, json, fn);
			if (entry.class.obj_class_method.indexOf(code) < 0) {
				entry.class.obj_class_method.push(code);
			}
		}
	});
	// constant variables
	module.variables.forEach(function (v) {
		var name = v.name;
		if (state.isSetterPropertyReferenced(name) || state.isGetterPropertyReferenced(name)) {
			entry.class.properties.push(util.generateProp(entry, json, v, true, '$class'));
			var fn = {
				name: name,
				arguments: [],
				returns: v
			};
			var code = util.generateObjCFunction(entry, json, fn, true);
			entry.class.obj_class_method.push(code);
		}
	});

	entry.imports = util.makeImports(json, entry.imports);
	return entry;
}

/**
 * generate a module file and it's module objective-c class
 */
function generate (dir, json, mod, state) {
	// for now, skip non frameworks
	if (mod.framework.indexOf('/') >= 0) { return; }
	// generate the objective-c module
	var m = makeModule(json, mod, state);
	var found = json.classes[mod.name];
	m.excludeHeader = !!found;
	if (m.class.properties.length ||
		m.class.class_methods.length ||
		m.class.obj_class_method.length ||
		Object.keys(m.class.static_variables).length ||
		m.class.blocks.length) {
		if (mod.filename && mod.filename.indexOf('/') > 0) {
			m.import = mod.filename;
		} else {
			m.frameworks[mod.framework] = 1;
		}
		var output = util.generateTemplate('module.m', {
			data: m
		});
		util.generateFile(dir, mod.name, mod, output, '.m');
	}

	// generate the JS module
	var jsoutput = util.generateTemplate('module', {
		data: m
	});

	// if we found a Class the same name of the Module/Framework, we will just
	// append the generated module to the end of the file instead of overwriting
	// the existing one
	if (found) {
		var fn = path.join(dir, mod.framework, mod.name + '.js');
		var buf = fs.readFileSync(fn);
		buf += jsoutput;
		fs.writeFileSync(fn, buf);
	} else {
		util.generateFile(dir, mod.name, mod, jsoutput);
	}
}

exports.generate = generate;
