/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
var util = require('./util'),
	swift = require('../swift');

function makeClass (json, cls, state) {
	var entry = {
		class: {
			name: cls.name,
			mangledName: cls.language === 'swift' ? swift.generateSwiftMangledClassName(state.appName, cls.name) : cls.name,
			properties: [],
			instance_methods: [],
			class_methods: []
		},
		framework: cls.framework,
		filename: cls.filename,
		imports: {},
		superclass: cls.superclass && json.classes[cls.superclass],
		state: state
	};
	cls.properties && Object.keys(cls.properties).sort().forEach(function (k) {
		var prop = util.generateProp(entry, json, cls.properties[k]);
		if (!state.isGetterPropertyReferenced(k)) {
			prop.getter = null;
		}
		if (!state.isSetterPropertyReferenced(k)) {
			prop.setter = null;
		}
		if (prop.setter || prop.getter) {
			entry.class.properties.push(prop);
		}
	});
	cls.methods && Object.keys(cls.methods).sort().forEach(function (k) {
		var method = cls.methods[k];
		if (!method.framework) {
			method.framework = cls.framework;
		}
		if (cls.properties && k in cls.properties) {
			return;
		}
		if (!state.isFunctionReferenced(method.name)) {
			return;
		}
		if (method.instance) {
			entry.class.instance_methods.push(util.generateInstanceMethod(entry, json, method));
		} else {
			entry.class.class_methods.push(util.generateClassMethod(entry, json, method));
		}
	});
	entry.imports = util.makeImports(json, entry.imports);
	return entry;
}

/**
 * generate a class file
 */
function generate (dir, json, cls, state) {
	var output = util.generateTemplate('class', {
		data: makeClass(json, cls, state)
	});
	util.generateFile(dir, 'class', cls, output);
}

exports.generate = generate;
