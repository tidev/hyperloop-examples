/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
var fs = require('fs'),
	util = require('util'),
	utillib = require('./generate/util'),
	spawn = require('child_process').spawn;

/**
 * generate Swift AST output from a swift file
 */
function generateSwiftAST (sdkPath, iosMinVersion, xcodeTargetOS, fn, callback) {
	var args = ['swiftc', '-sdk', sdkPath, '-dump-ast', fn];
	if (xcodeTargetOS === 'iphoneos') {
		args.push('-target');
		//armv7 should be ok across all devices. But to note that we can do armv7s and arm64 here
		args.push('armv7-apple-ios' + iosMinVersion);
	}
 	var child = spawn('xcrun', args),
		buf = '';
	// swiftc -sdk /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator9.0.sdk -dump-ast MySwift.swift
	child.on('error', callback);
	child.stderr.on('data', function (data) {
		buf += data.toString();
	});
	child.on('exit', function (ec) {
		if (ec === 1) {
			return callback(new Error('Swift file at '+ fn + ' has compiler problems. Please check to make sure it compiles OK.'), buf);
		}
		callback(null, buf);
	});
}

/**
 * return an encoding for a value
 */
function getEncodingForValue (value) {
	value = value.toLowerCase();
	switch (value) {
		case 'int': return 'i';
		case 'long': return 'l';
		case 'float': return 'f';
		case 'double': return 'd';
		case 'void': return 'v';
		case 'char': return 'c';
		case 'short': return 's';
		case 'bool': return 'B';
		case 'long_long':
		case 'long long': return 'q';
		case 'unsigned int': return 'I';
		case 'unsigned long': return 'L';
		case 'unsigned long long': return 'Q';
		case 'unsigned char': return 'C';
		case 'unsigned short': return 'S';
		case 'char *': case 'char_s': return '*';
		case 'id': return '@';
		case 'sel': return ':';
		case 'class': return '#';
	}
	return value;
}

/**
 * encode a structure
 */
function structDefinitionToEncoding (value) {
	var str = '{' + value.name + '=';
	value.fields && value.fields.forEach(function (field) {
		str += field.encoding || getEncodingForValue(field.type || field.value);
	});
	return str + '}';
}

/**
 * attempt to resolve a type object for a value
 */
function resolveType (filename, metabase, value) {
	if (utillib.isPrimitive(value.toLowerCase())) {
		value = value.toLowerCase();
		return {
			value: value,
			type: value,
			encoding: getEncodingForValue(value)
		};
	} else if (metabase.classes && value in metabase.classes) {
		var cls = metabase.classes[value];
		return {
			value: value,
			type: value,
			encoding: '@'
		};
	} else if (metabase.structs && value in metabase.structs) {
		var str = metabase.structs[value];
		return {
			value: value,
			type: value,
			encoding: structDefinitionToEncoding(str)
		};
	} else if (metabase.typedefs && value in metabase.typedefs) {
		var typedef = metabase.typedefs[value];
		return {type:typedef.type, value: value, encoding: typedef.encoding};
	}
	console.error('Swift Generation failed with unknown or unsupported type (' + value + ') found while compiling', filename);
	process.exit(1);
}

/**
 * extract all the imports found in the buffer
 */
function extractImports (buf) {
	return (buf.match(/import\s*(\w+)/g) || []).map(function (m) {
		return m.substring(6).replace(/;$/, '').trim();
	});
}

function metabaseMerge (a, b) {
	// simplified merge metabase json
	['typedefs','classes','structs','blocks','enums','functions','unions','vars'].forEach(function (k) {
		if (k in b) {
			Object.keys(b[k]).forEach(function (kk) {
				if (!(kk in a)) {
					a[kk] = b[kk];
				}
			});
		}
	});
	return a;
}

function uniq (a) {
	var copy = [];
	for (var c = 0; c < a.length; c++) {
		var e = a[c];
		if (copy.indexOf(e) < 0) {
			copy.push(e);
		}
	}
	return copy;
}

/**
 * return a merged metabase
 */
function generateAndMerge (buildDir, sdk, sdkPath, iosMinVersion, imports, metabase, callback) {
	if (imports.length === 0) { return callback(null, metabase); }
	if (metabase.$includes) {
		// if we have all the imports already in our metabase, just return instead of merging
		var need = [];
		for (var c = 0; c < imports.length; c++) {
			if (metabase.$includes.indexOf(imports[c]) < 0) {
				need.push(imports[c]);
			}
		}
		if (need.length === 0) {
			return callback(null, metabase);
		}
		// only generate any missing imports to speed up the merge
		imports = need;
	}
	var metabasegen = require('./metabase');
	metabasegen.generateMetabase(buildDir, sdk, sdkPath, iosMinVersion, imports, false, function (err, json) {
		if (err) { return callback(err); }
		var includes = uniq(metabase.$includes.concat(imports));
		metabase = metabaseMerge(metabase, json);
		metabase.$includes = includes;
		return callback(null, metabase);
	});
}

/**
 * return the swift managed class name for a given application and class name
 */
function generateSwiftMangledClassName (appName, className) {
	return '_TtC' + appName.length + appName + className.length + className;
}

/**
 * parse a swift file into a metabase type JSON result
 */
function generateSwiftMetabase (buildDir, sdk, sdkPath, iosMinVersion, xcodeTargetOS, metabase, framework, fn, callback) {
	generateSwiftAST(sdkPath, iosMinVersion, xcodeTargetOS, fn, function (err, buf) {
		if (err) {
			return callback(err, buf); 
		}
		var classes = {},
			classdef,
			methodef,
			vardef,
			// read our imports from the file so we can generate an appropriate metabase
			imports = extractImports(fs.readFileSync(fn).toString()),
			tok,
			name,
			i,
			lines = buf.split(/\n/),
			componentRE = /component id='(.*)'/,
			patternNamedRE = /pattern_named type='(\w+)' '(\w+)'/,
			typeRE = /type='(\w+)'/,
			// turn our imports into includes for the metabase generation
			includes = imports.map(function (name) {
				return '<' + name + '/' + name + '.h>';
			});

		// we need to merge our metabase with any imports found in our swift file in case there are imports found in
		// swift that we haven't imported in the incoming metabase
		generateAndMerge(buildDir, sdk, sdkPath, iosMinVersion, includes, metabase, function (err, metabase) {
			if (err) { return callback(err); }

			lines.forEach(function (line, index) {
				line = line.toString().trim();
				if (line) {
					// console.log('line=>', line.substring(0, 5));
					if (line.indexOf('(class_decl ') === 0) {
						tok = line.split(' ');
						var cls = tok[1].replace(/"/g, '').trim();
						classdef = {
							name: cls,
							public: false,
							methods: {},
							properties: {},
							filename: fn,
							thirdparty: true,
							framework: framework,
							language: 'swift'
						};
						tok.slice(2).forEach(function (t, i) {
							if (t.indexOf('access=public') === 0) {
								classdef.public = true;
							} else if (t.indexOf('inherits:') === 0) {
								classdef.superclass = tok[i + 3]; // 2 is sliced so add + 1
							}
						});
						if (classdef.public) {
							delete classdef.public;
							classes[classdef.name] = classdef;
							metabase.classes[classdef.name] = classdef;
						} else {
							classdef = null;
						}
					} else if (line.indexOf('(var_decl') === 0 && classdef) {
						tok = line.split(' ');
						name = tok[1].replace(/"/g, '').trim();
						vardef = {
							name: name,
							public: false
						};
						tok.splice(2).forEach(function (t, i) {
							if (t.indexOf('access=public') === 0) {
								vardef.public = true;
							} else if (t.indexOf('type=') === 0) {
								vardef.type = resolveType(fn, metabase, typeRE.exec(t)[1]);
							}
						});
						if (vardef.public) {
							delete vardef.public;
							classdef.properties[name] = vardef;
						}
					} else if (line.indexOf('(func_decl ') === 0 && line.indexOf('getter_for=') < 0) {
						tok = line.split(' ');
						name = tok[1].replace(/"/g, '').trim();
						i = name.indexOf('(');
						var args = [];
						methodef = {
							name: name,
							public: false,
							instance: true
						};
						if (i) {
							methodef.name = name.substring(0, i);
							methodef.selector = methodef.name;
							methodef.arguments = [];
							name.substring(i + 1, name.length - 1).split(':').slice(1).forEach(function (t, i) {
								methodef.selector += ':' + t;
							});
						}
						tok.splice(2).forEach(function (t, i) {
							if (t.indexOf('access=public') === 0) {
								methodef.public = true;
							} else if (t.indexOf('type=') === 0) {
								if (t.indexOf('type=\'' + classdef.name + '.Type') === 0) {
									// this is a class method
									methodef.instance = false;
								}
							}
						});
						if (classdef && methodef.public) {
							delete methodef.public;
							classdef.methods[methodef.name] = methodef;
						} else {
							methodef = null;
						}
					} else if (methodef && line.indexOf('(pattern_named ') === 0 && patternNamedRE.test(line)) {
						var re = patternNamedRE.exec(line);
						var t = resolveType(fn, metabase, re[1]);
						methodef.arguments.push({
							name: re[2],
							type: t
						});
					} else if (methodef && line.indexOf('(result') === 0 && lines[index + 1].trim().indexOf('(type_ident') === 0 && lines[index + 2].trim().indexOf('(component ') === 0) {
						methodef.returns = resolveType(fn, metabase, componentRE.exec(lines[index+2].trim())[1]);
						methodef = null;
					}
				}
			});

			callback(null, {
				imports: imports,
				classes: classes,
				filename: fn
			}, metabase);

		});

	});
}

exports.generateSwiftMetabase = generateSwiftMetabase;
exports.generateSwiftMangledClassName = generateSwiftMangledClassName;
