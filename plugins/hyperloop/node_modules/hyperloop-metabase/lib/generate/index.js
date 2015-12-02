/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	wrench = require('wrench'),
	genclass = require('./class'),
	genmodule = require('./module'),
	genstruct = require('./struct'),
	genblock = require('./block'),
	gencustom = require('./custom'),
	util = require('./util');

function makeModule (modules, e, state) {
	if (e.framework) {
		if (!(e.framework in modules)) {
			modules[e.framework] = {
				name: e.framework,
				framework: e.framework,
				filename: e.filename,
				functions: [],
				variables: [],
				static_variables: {},
				blocks: [],
				frameworks: {},
				state: state
			};
		}
		return modules[e.framework];
	}
}

function merge (src, dest) {
	if (src) {
		dest =  dest || {};
		for (var k in src) {
			if (!(k in dest)) {
				dest[k] = src[k];
			}
		}
	}
}

function superClassImplementsProxy (json, cls, proto) {
	var prev;
	while (cls && cls.superclass) {
		prev = cls;
		cls = cls.superclass;
		if (cls) {
			cls = json.classes[cls];
		}
	}
	return (prev && prev.protocols && prev.protocols.indexOf(proto) !== -1);
}

function generateBuiltins (json, callback) {
	var dir = path.join(__dirname, '..', '..', 'templates', 'builtins');
	fs.readdir(dir, function (err, files) {
		if (err) { return callback(err); }
		async.eachSeries(files, function (fn, cb) {
			var gen = require(path.join(dir, fn));
			gen(json, cb);
		}, callback);
	});
}

function generateFromJSON (name, dir, json, state, callback, includes) {
	var started = Date.now();

	// set the name of the app in the state object
	state.appName = name;

	if (!json) { return callback(); }

	json.classes = json.classes || {};

	if (!fs.existsSync(dir)) {
		wrench.mkdirSyncRecursive(dir);
	}

	generateBuiltins(json, function (err) {
		if (err) { return callback(err); }

		if (!json.classes.NSObject) {
			json.classes.NSObject = {
				methods:{},
				properties:{},
				framework:'Foundation',
				name: 'NSObject'
			};
		}

		// attach these base methods to NSObject
		['stringValue','boolValue','intValue','charValue','floatValue','shortValue',
		'longValue','longLongValue','unsignedIntValue','unsignedCharValue',
		'unsignedShortValue','unsignedLongLongValue',
		'unsignedLongValue','isNull', 'protect', 'unprotect'].forEach(function(t) {
			json.classes.NSObject.methods[t] = {
				instance: true,
				name: t,
				arguments: [],
				selector: t,
				returns: {
					encoding: '@',
					value: 'id',
					type: 'id'
				},
				impl: function () {
					return 'var result = Hyperloop.' + t + '(this.$native);';
				}
			};
		});

		json.classes.NSObject.methods.extend = {
			instance: false,
			name: 'extend',
			impl: function () {
				return 'Hyperloop.extend(this.$class, arguments[0], arguments[1]);';
			}
		};

		// remove these functions for now until we can fix them
		['NSLogv', 'NSLog', 'UIApplicationMain'].forEach(function (fn) {
			delete json.functions[fn];
		});

		// we must have a root object even those this is a protocol and
		// handled special in objective-c
		json.classes.NSObject.framework = 'Foundation';

		// create an inverse map of custom classfiles to framework
		var custom_frameworks = {};
		if (includes) {
			var frameworks = Object.keys(includes);
			for (var i = 0; i < frameworks.length; i++) {
				var name = frameworks[i];
				var classes = Object.keys(includes[name]);
				for (var c = 0; c < classes.length; c++) {
					var clsfile = includes[name][classes[c]];
					custom_frameworks[clsfile] = name;
				}
			}
		}

		// classes
		Object.keys(json.classes).forEach(function (k) {
			var cls = json.classes[k];
			if (cls.filename === '/usr/include/objc/NSObject.h') {
				cls.framework = 'Foundation';
			}
			// add protocols
			if (cls.protocols && cls.protocols.length) {
				cls.protocols.forEach(function (p) {
					if (superClassImplementsProxy(json, cls, p)) {
						return;
					}
					var protocol = json.protocols[p];
					if (protocol) {
						merge(protocol.properties, cls.properties);
						merge(protocol.methods, cls.methods);
					}
				});
			}
			if (cls.thirdparty && includes) {
				// consult our includes to potentially override the framework
				// in which case we need to see if we have the custom class
				// in the includes and use it's framework in this map
				cls.framework = custom_frameworks[cls.filename] || cls.framework;
			}
			// TODO: add categories
			genclass.generate(dir, json, cls, state);
		});

		// structs
		json.structs && Object.keys(json.structs).forEach(function (k) {
			var struct = json.structs[k];
			if (/^_+/.test(k)) {
				// if we have leading underscores for struct names, trim them
				struct.name = struct.name.replace(/^(_)+/g,'').trim();
			}
			genstruct.generate(dir, json, struct);
		});

		// modules
		var modules = {};
		// define module based functions
		json.functions && Object.keys(json.functions).forEach(function (k) {
			var func = json.functions[k];
			var mod = makeModule(modules, func, state);
			mod && mod.functions.push(func);
		});
		// define module based constant variables
		json.vars && Object.keys(json.vars).forEach(function (k) {
			var varobj = json.vars[k];
			var mod = makeModule(modules, varobj, state);
			mod && mod.variables.push(varobj);
		});
		// define module based enums
		json.enums && Object.keys(json.enums).forEach(function (k) {
			var enumobj = json.enums[k];
			var mod = makeModule(modules, enumobj, state);
			if (mod && enumobj.values) {
				Object.keys(enumobj.values).forEach(function (n) {
					mod.static_variables[n] =  enumobj.values[n];
				});
			}
		});
		// define blocks
		json.blocks && Object.keys(json.blocks).forEach(function (k) {
			var blocks = json.blocks[k];
			var mod = makeModule(modules, {framework:k, filename:''}, state);
			mod && blocks.forEach(function (block) {
				block && mod.blocks.push(genblock.generateBlockWrapper(mod, json, block));
			});
		});

		// generate the modules
		modules && Object.keys(modules).forEach(function (k) {
			genmodule.generate(dir, json, modules[k], state);
		});

		// generate any custom classes
		gencustom.generate(dir, state, json, state);

		var duration = Date.now() - started;

		util.logger.info('Generation took ' + duration + ' ms');

		callback();
	});
}

/**
 * generate
 */
function generate (name, dir, fn, custom, callback) {
	if (arguments.length !== 5) {
		throw new Error('update usage');
	}
	fs.readFile(fn, function (err, buf) {
		if (err) { return callback(err); }
		// turn it into JSON
		return generateFromJSON(name, dir, JSON.parse(buf), custom, callback);
	});
}

/**
 * parse from a buffer
 */
function parseBuffer(buf, fn, state) {
	var parser = new gencustom();
	return parser.parse(buf, fn, state);
}

/**
 * parse a file
 */
function parse (fn, state) {
	return parseBuffer(fs.readFileSync(fn), fn, state);
}

/**
 * generate an empty state object
 */
function generateState() {
	return new gencustom.ParserState();
}

exports.generate = generate;
exports.generateFromJSON = generateFromJSON;
exports.parse = parse;
exports.parseFromBuffer = parseBuffer;
exports.generateState = generateState;
