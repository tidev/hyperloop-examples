/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
var path = require('path'),
	fs = require('fs'),
	chalk = require('chalk'),
	ejs = require('ejs'),
	blockgen = require('./block'),
	templates = {},
	logger = {
		info: function () {
			console.log.apply(console, arguments);
		},
		debug: function () {
			console.log.apply(console, arguments);
		},
		trace: function () {
			console.log.apply(console, arguments);
		},
		warn: function () {
			console.log.apply(console, arguments);
		},
		error: function () {
			console.error.apply(console, arguments);
		}
	};

function generateTemplate (type, detail) {
	var render = templates[type];
	if (!render) {
		var template = path.join(__dirname, '..', '..', 'templates', type + '.ejs');
		var content = fs.readFileSync(template).toString();
		render = ejs.compile(content);
		templates[type] = render;
	}
	return render(detail);
}

function cleanupClassName (name) {
	return name.replace(/\*/g,'').trim();
}

function isPrimitive(type) {
	switch (type) {
		case 'i':
		case 'c':
		case 'd':
		case 'f':
		case 'B':
		case 's':
		case 'l':
		case 'q':
		case 'L':
		case 'Q':
		case 'I':
		case 'S':
		case 'C':
		case 'int':
		case 'uint':
		case 'unsigned int':
		case 'long':
		case 'ulong':
		case 'unsigned long':
		case 'ulonglong':
		case 'unsigned long long':
		case 'long long':
		case 'long_long':
		case 'double':
		case 'short':
		case 'ushort':
		case 'unsigned short':
		case 'float':
		case 'bool':
		case 'uchar':
		case 'unsigned char':
		case 'char':
		case 'char_s':
		case 'constant_array':
			return true;
	}
	return false;
}

function addImport (state, name, obj) {
	if (name === 'NSObject') {
		obj = obj || {};
		obj.framework = 'Foundation';
	}
	if (!name || !obj || name === state.class.name) {
		return;
	}
	state.imports[name] = obj;
	state.frameworks && (state.frameworks[obj.framework] = 1);
}

function isSpecialNumber (cls) {
	return cls.indexOf('float') !== -1 || cls.indexOf('ext_vector_type') > 0;
}

function isBlock (cls) {
	return cls.indexOf('(^)') > 0;
}

function isFunctionPointer (cls) {
	return cls.indexOf('(*)') > 0;
}

function isStructEncoding (encoding) {
	return encoding && encoding.charAt(0) === '{';
}

function isPointerEncoding (encoding) {
	return encoding && ((encoding.charAt(0) === '(' && encoding.indexOf('^') > 0) || encoding.charAt(0) === '^');
}

function getStructNameFromEncoding (encoding) {
	if (encoding && encoding.charAt(0) === '{') {
		var i = encoding.indexOf('=');
		return encoding.substring(1, i).replace(/^_+/,'').trim();
	}
}

function isProtocol (value) {
	return (value.indexOf('<') > 0) && !isBlock(value);
}

function getProtocolClass (value) {
	var i = value.indexOf('<');
	var name = value.substring(0, i).trim();
	if (name === 'id') {
		return 'NSObject';
	} else {
		return name;
	}
}

function newPrefix (state, cls, noimport) {
	if (state.class.name === cls || noimport) {
		return 'new ' + cls + '(';
	} else {
		return 'new $imports.' + cls + '(';
	}
}

function getResultWrapper (state, json, obj, instance) {
	var type = obj.type && obj.type.type || obj.type,
		value = obj.type && obj.type.value || obj.value || type,
		name = obj.name || value,
		struct,
		typedef;
	// console.log('>', name, type, value);
	switch (type) {
		case 'unexposed':
		case 'obj_interface':
		case 'objc_interface':
		case 'objc_pointer': {
			var cls = cleanupClassName(value);
			if (cls === 'instancetype' && instance) {
				return newPrefix(state, 'this.constructor', true);
			}
			if (cls === 'instancetype' || cls === state.class.name) {
				var varname = 'this';
				if (instance) {
					varname += '.constructor';
				}
				return newPrefix(state, varname, true);
			}
			if (cls in json.classes) {
				addImport(state, cls, json.classes[cls]);
				return newPrefix(state, cls);
			} else if (cls === 'id') {
				addImport(state, 'NSObject', json.classes.NSObject);
				return newPrefix(state, 'NSObject');
			} else if (isProtocol(cls)) {
				cls = getProtocolClass(cls);
				addImport(state, cls, json.classes[cls]);
				return newPrefix(state, cls);
			} else if (cls === 'SEL') {
				return '';
			} else if (cls === 'Class') {
				return '';
			} else if (isPrimitive(cls)) {
				return '';
			} else if (isSpecialNumber(cls)) {
				return '';
			} else if (cls === 'void') {
				return '';
			} else if (isBlock(value)) {
				//FIXME:
				return '';
			} else if (isFunctionPointer(value)) {
				//FIXME:
				return '';
			} else if (isPointerEncoding(obj.encoding)) {
				return '';
			} else if (isStructEncoding(obj.encoding)) {
				struct = json.structs[name];
				addImport(state, name, struct);
				return newPrefix(state, name);
			} else {
				typedef = json.typedefs[cls];
				if (typedef) {
					return getResultWrapper(state, json, typedef, instance);
				}
				if (obj.encoding === '*' || obj.encoding === 'r^v' || obj.encoding === 'r*' || /^r\^/.test(obj.encoding)) {
					// void pointer
					return '';
				}
				// see if it's a typedef to a class
				if (value.indexOf(' *') > 0) {
					cls = value.substring(0, value.indexOf('*')).trim();
					if (cls in json.classes) {
						addImport(state, cls, json.classes[cls]);
						return newPrefix(state, cls);
					}
				}
				// generate object type
				if (value === 'ObjectType' || value === 'objc_pointer' || value === 'ValueType') {
					cls = 'NSObject';
					addImport(state, cls, json.classes[cls]);
					return newPrefix(state, cls);
				}
				logger.warn("couldn't find class", value, JSON.stringify(obj));
				cls = 'NSObject';
				addImport(state, cls, json.classes[cls]);
				return newPrefix(state, cls);
			}
			break;
		}
		case 'id': {
			addImport(state, 'NSObject', json.classes.NSObject);
			return newPrefix(state, 'NSObject');
		}
		case 'incomplete_array':
		case 'vector':
		case 'pointer':
		case 'SEL': {
			return '';
		}
		case 'struct': {
			name = getStructNameFromEncoding(obj.encoding) || name;
			if (name === '?') {
				//TODO:
				return '';
			}
			struct = json.structs[name];
			addImport(state, name, struct);
			return newPrefix(state, name);
		}
		case 'enum': {
			return '';
		}
		case 'union': {
			//FIXME: not currently handled
			return '';
		}
		case 'record': {
			if (value.indexOf('struct ') === 0) {
				name = value.substring(7).replace(/^_+/,'').trim();
				struct = json.structs[name];
				if (struct) {
					// console.log('!!struct resolved to', struct);
					addImport(state, name, struct);
					return newPrefix(state, name);
				} else {
					logger.warn("Couldn't resolve struct:", value);
				}
			}
			if (value.indexOf('union ') === 0) {
				return '';
			}
			break;
		}
		case 'Class': {
			return '';
		}
		case 'typedef': {
			if (isPrimitive(value)) {
				return '';
			}
			typedef = json.typedefs[value];
			if (typedef) {
				// console.log('!!typedef resolved to', typedef);
				return getResultWrapper(state, json, typedef, instance);
			} else {
				logger.warn("Couldn't resolve typedef:", value);
			}
			break;
		}
		case 'block': {
			//FIXME: not yet implemented
			return '';
		}
		case 'function_callback': {
			//FIXME: not yet implemented
			return '';
		}
		case 'unknown': {
			return '';
		}
		case 'void': {
			return '';
		}
		default: {
			if (isPrimitive(type) || value.indexOf('*') > 0) {
				return '';
			}
		}
	}
	logger.warn('Not sure how to handle: name=', name, 'type=', type, 'value=',value);
	return '';
}

function repeat (ch, n) {
	return new Array(n).join(ch);
}

function generateArgList (state, json, args, startParens, endParens, def) {
	if (args && args.length) {
		var result = startParens;
		var found = {};
		result += args.map(function (arg, index) {
			// add underscore to ensure that JS reserved words (like arguments) aren't generated
			var name = '_' + (arg.isBlock ? arg.blockname : arg.name);
			// metabase will in rare cases have the same name for multiple args
			if (name in found) {
				name += '_' + index;
			}
			found[name] = 1;
			return name;
		}).join(', ');
		return result + endParens;
	}
	return def;
}

function generateMethodBody (state, json, method, preamble, instance, thisobj, argCallback) {
	// allow special overrides in method generation
	if (method.impl) {
		return method.impl(state, json, method, instance, thisobj);
	}
	var result = '';
	var end = '';
	var wrapper = null;
	if (method.returns.type !== 'void') {
		wrapper = getResultWrapper(state, json, method.returns, instance);
		end = wrapper ? ')' : '';
		result += wrapper;
	}
	var arglist = generateArgList(state,json,method.arguments,'[',']','null');
	if (argCallback) {
		arglist = argCallback(arglist);
	}
	method.arguments.forEach(function (arg, i) {
		if (arg.type === 'block') {
			var block = findBlock(json, arg.value, method);
			var blockName = blockgen.generateBlockMethodName(block.signature);
			var framework = method.framework;
			var name = arg.name;
			preamble.push('\t// convert to block: ' + block.signature);
			preamble.push('\tvar _' + name +'Callback = function () {');
			preamble.push('\t\tvar args = [];');
			preamble.push('\t\t// convert arguments into local JS classes');
			if (!block.arguments) {
				console.error(block);
				process.exit(1);
			}
			block.arguments.forEach(function (ba, i) {
				preamble.push('\t\tif (arguments.length > ' +i + ' && arguments[' + i + ']) {');
				var wrapper = getResultWrapper(state, json, ba, instance);
				preamble.push('\t\t\targs.push(' +  wrapper + 'arguments[' + i + ']' + (wrapper ? ')': '') + ');');
				preamble.push('\t\t} else {');
				preamble.push('\t\t\targs.push(null);');
				preamble.push('\t\t}');
			});
			preamble.push('\t\t_' + name + ' && _' + name + '.apply(_' + name + ', args);');
			preamble.push('\t};');
			preamble.push('\tvar _' + name + 'Block = $dispatch(Hyperloop.createProxy({ class: \'Hyperloop' + framework+'\', alloc: false, init: \'class\' }), \'' + blockName+':\', [_' + name +'Callback], false);');
			var pref = instance ? 'this' : state.class.name;
			preamble.push('\t' + pref + '.$private.' + method.name + '_' + name + ' = _' + name + ';');
			preamble.push('\t' + pref + '.$private.' + method.name + '_' + name + 'Callback = _' + name + 'Callback;');
			arg.blockname = name + 'Block';
			arg.isBlock = true;
			// re-generate the arg list with the new argument name
			arglist = generateArgList(state,json,method.arguments,'[',']','null');
			if (argCallback) {
				arglist = argCallback(arglist);
			}
		}
	});
	var fnname = method.selector || method.name;
	var nativeCall = '\t\t\tvar result = $dispatch(' + thisobj + ', \''+ fnname + '\', ' + arglist +', ' + instance + ');';
	if (!wrapper) {
		return nativeCall;
	}
	var lastChance = '\n\t\t\tif (result === undefined || result === null) return result;\n';
	return nativeCall + lastChance + '\t\t\tresult = ' + result + 'result' + end + ';';
}

function toValue (encoding, type) {
	switch (encoding) {
		case 'd':
			return 'doubleValue';
		case 'i':
			return 'intValue';
		case 'l':
			return 'longValue';
		case 'f':
			return 'floatValue';
		case 'q':
			return 'longLongValue';
		case 'c':
			return 'charValue';
		case 's':
			return 'shortValue';
		case 'B':
			return 'boolValue';
		case 'L':
			return 'unsignedLongValue';
		case 'Q':
			return 'unsignedLongLongValue';
		case 'I':
			return 'unsignedIntValue';
		case 'C':
			return 'unsignedCharValue';
		case 'S':
			return 'unsignedShortValue';
	}
	logger.error("Can't convert encoding: "+encoding +", type: "+type);
	process.exit(1);
}

function toValueDefault(encoding, type) {
	switch (encoding) {
		case 'd':
		case 'i':
		case 'l':
		case 'f':
		case 's':
		case 'L':
		case 'Q':
		case 'q':
		case 'I':
		case 'S':
			return '0';
		case 'C':
		case 'c':
			return "'\\0'";
		case 'B':
			return 'NO';
		case '@':
		case ':':
		case '#':
		case '^':
			return 'nil';
	}
	logger.error("Can't convert encoding: "+encoding +", type: "+type);
	process.exit(1);
}

function getObjCReturnType (value) {
	switch (value.type) {
		case 'unknown':
		case 'enum':
		case 'pointer':
		case 'union':
		case 'unexposed':
		case 'vector':
		case 'incomplete_array':
		case 'struct': {
			return value.value || 'void *';
		}
		case 'record': {
			if (!value.value) {
				return 'void *';
			}
			break;
		}
		case 'id':
		case 'obj_interface':
		case 'objc_pointer': {
			return 'id';
		}
		case 'class':
		case 'Class': {
			return 'Class';
		}
		case 'selector':
		case 'SEL': {
			return 'SEL';
		}
	}
	if (isPrimitive(value.type)) {
		return value.value || getPrimitiveValue(value.type);
	}
	console.log(value);
	logger.error("cannot figure out objc return type", value);
	process.exit(1);
}

function getObjCReturnResult (value, name, returns, asPointer) {
	name = name || 'result$';
	returns = returns || 'return';
	asPointer = asPointer === undefined ? '&' : asPointer;
	var fn;
	switch (value.type) {
		case 'unknown':
		case 'union':
		case 'unexposed':
		case 'vector':
		case 'incomplete_array':
		case 'pointer': {
			return returns + ' (' + name + ' == nil) ? (id)[NSNull null] : (id)[HyperloopPointer pointer:(const void *)' + asPointer + name + ' encoding:@encode(' + value.value + ')];';
		}
		case 'enum': {
			return returns + ' [HyperloopPointer pointer:(const void *)' + asPointer + name + ' encoding:@encode(' + value.value + ')];';
		}
		case 'struct': {
			if (value.framework && value.filename) {
				fn = path.basename(value.filename).replace(/\.h$/,'');
				return returns + ' [HyperloopPointer pointer:(const void *)' + asPointer + name + ' encoding:@encode(' + value.value + ') framework:@"' + value.framework + '" classname:@"' + fn + '"];';
			}
			return returns + ' [HyperloopPointer pointer:(const void *)' + asPointer + name + ' encoding:@encode(' + value.value + ')];';
		}
		case 'record': {
			if (!value.value) {
				return returns + ' (' + name + ' == nil) ? (id)[NSNull null] : (id)[HyperloopPointer pointer:(const void *)' + name + ' encoding:@encode(void *)];';
			}
			break;
		}
		case 'id':
		case 'objc_interface':
		case 'obj_interface':
		case 'objc_pointer': {
			if (value.framework && value.filename) {
				fn = path.basename(value.filename).replace(/\.h$/,'');
				return returns + ' (' + name + ' == nil || [(id)' + name + ' isEqual:[NSNull null]]) ? (id)[NSNull null] : (id)[HyperloopPointer pointer:(__bridge void *)' + name +' encoding:@encode(id) framework:@"' + value.framework + '" classname:@"' + fn + '"];';
			} else {
				return returns + ' (' + name + ' == nil || [(id)' + name + ' isEqual:[NSNull null]]) ? (id)[NSNull null] : (id)[HyperloopPointer pointer:(__bridge void *)' + name +' encoding:@encode(id)];';
			}
			break;
		}
		case 'Class': {
			if (value.framework && value.filename) {
				fn = path.basename(value.filename).replace(/\.h$/,'');
				return returns + ' (' + name + ' == nil || [(id)' + name + ' isEqual:[NSNull null]]) ? (id)[NSNull null] : (id)[HyperloopPointer pointer:(__bridge void *)' + name +' encoding:@encode(Class) framework:@"' + value.framework + '" classname:@" ' + fn + '"];';
			} else {
				return returns + ' (' + name + ' == nil || [(id)' + name + ' isEqual:[NSNull null]]) ? (id)[NSNull null] : (id)[HyperloopPointer pointer:(__bridge void *)' + name +' encoding:@encode(Class)];';
			}
			break;
		}
		case 'SEL': {
			return returns + ' (' + name + ' == nil) ? (id)[NSNull null] : (id)[HyperloopPointer pointer:(__bridge void *)' + asPointer + name +' encoding:@encode(SEL)];';
		}
		case 'void': {
			return returns + ' nil;';
		}
		case 'block': {
			return returns + ' (' + name + ' == nil) ? (id)[NSNull null] : (id)[HyperloopPointer pointer:(__bridge void *)' + asPointer + name +' encoding:"' + value.encoding + '"];';
		}
	}
	if (isPrimitive(value.type)) {
		switch (value.encoding) {
			case 'd':
				return returns + ' [NSNumber numberWithDouble:' + name + '];';
			case 'i':
				return returns + ' [NSNumber numberWithInt:' + name + '];';
			case 'l':
				return returns + ' [NSNumber numberWithLong:' + name + '];';
			case 'f':
				return returns + ' [NSNumber numberWithFloat:' + name + '];';
			case 'q':
				return returns + ' [NSNumber numberWithLongLong:' + name + '];';
			case 'c':
				return returns + ' [NSNumber numberWithChar:'+ name + '];';
			case 's':
				return returns + ' [NSNumber numberWithShort:' + name + '];';
			case 'B':
				return returns + ' [NSNumber numberWithBool:'+ name + '];';
			case 'L':
				return returns + ' [NSNumber numberWithUnsignedLong:' + name + '];';
			case 'Q':
				return returns + ' [NSNumber numberWithUnsignedLongLong:' + name + '];';
			case 'I':
				return returns + ' [NSNumber numberWithUnsignedInt:' + name + '];';
			case 'C':
				return returns + ' [NSNumber numberWithUnsignedChar:' + name + '];';
			case 'S':
				return returns + ' [NSNumber numberWithUnsignedShort:' + name + '];';
			case '*':
				return returns + ' [NSString stringWithUTF8String:' + name + '];';
		}
	}
	console.log(value);
	logger.error("cannot figure out objc return result", value);
	process.exit(1);
}

function generateImport (name, fp) {
	return '\t$imports.' + name + ' = require(\'hyperloop/' + fp + '\');';
}

function makeImports (json, imports) {
	var results = [];
	Object.keys(imports).forEach(function (k) {
		var e = imports[k];
		if (k === 'NSObject' && e && !e.framework) {
			e.framework = 'Foundation';
		}
		if (!e) {
			// console.error("Can't find", k, " with entry:", e);
			return;
		}
		if (e.framework) {
			var fp = (e.framework + '/' + k).toLowerCase();
			results.push(generateImport(k, fp));
		} else if (e.filename) {
			//TODO:
			results.push(generateImport(k, e.filename));
		} else {
			logger.warn("Can't figure out how to import", k, e);
		}
	});
	return results.join('\n');
}

function generatePropGetter (state, json, prop, name) {
	var wrapper = getResultWrapper(state, json, prop, true);
	var endsep = wrapper ? ')' : '';
	name = name || 'this.$native';
	return  '\tget: function () {\n' +
			repeat('\t', 5) + 'if (!$init) { $initialize(); }\n' +
			repeat('\t', 5) + 'return ' + wrapper + '$dispatch(' + name + ', \'' + (prop.selector || prop.name) + '\')' + endsep + ';\n' +
			repeat('\t', 4) + '}';
}

function generateSetterSelector (name) {
	return 'set' + name.charAt(0).toUpperCase() + name.substring(1) + ':';
}

function generatePropSetter (state, json, prop, name) {
	name = name || 'this.$native';
	return  'set: function (_' + prop.name + ') {\n' +
			repeat('\t', 5) + 'if (!$init) { $initialize(); }\n' +
			repeat('\t', 5) + 'this.$private.'+prop.name+' = _'+prop.name+';\n' +
			repeat('\t', 5) + '$dispatch(' + name + ', \'' + generateSetterSelector(prop.name) + '\', _' + prop.name + ');\n' +
			repeat('\t', 4) + '}';
}

function generateProp (state, json, prop, readonly, name) {
	var result = {name:prop.name};
	result.getter = generatePropGetter(state, json, prop, name);
	var sep = repeat('\t', 4);
	if (!readonly && (!prop.attributes || prop.attributes.indexOf('readonly') < 0)) {
		result.setter = '\n' + sep + generatePropSetter(state, json, prop, name);
	}
	return result;
}

function createFakeFieldStruct (prop) {
	var otherStruct = {
		name: prop.name,
		fields: []
	};
	// create a fake field struct
	var structenc = flattenStruct(prop.encoding);
	for (var c = 0; c < structenc.length; c++) {
		otherStruct.fields[c] = {
			encoding: structenc[c],
			name: 'f' + c
		};
	}
	return otherStruct;
}

function generateFieldGetter (state, json, prop, index) {
	if (prop.type === 'struct') {
		var code = [];
		var indent = repeat('\t', 5);
		code.push('get: function () {');
		code.push(indent + 'return this.$' + prop.name +';');
		code.push(repeat('\t', 4) + '}');
		return code.join('\n');
	} else {
		var wrapper = getResultWrapper(state, json, prop, true);
		var endsep = wrapper ? ')' : '';
		return  'get: function () {\n' +
				repeat('\t', 5) + 'return ' + wrapper + '$dispatch(this.$native, \'valueAtIndex:\', ' + index + ')' + endsep + ';\n' +
				repeat('\t', 4) + '}';
	}
}

function generateFieldSetter (state, json, prop, index) {
	if (prop.type === 'struct') {
		var name = getStructNameFromEncoding(prop.encoding);
		var otherStruct = json.structs[name];
		var subWrapper;
		if (!otherStruct) {
			subWrapper = '(';
			// create a fake field struct
			otherStruct = createFakeFieldStruct(prop);
		} else {
			subWrapper = getResultWrapper(state, json, {name:otherStruct.name, type:'struct'}, true);
		}
		var code = [];
		var indent = repeat('\t', 5);
		prop.otherStruct = otherStruct;
		code.push('set: function (_' + prop.name + ') {');
		otherStruct.fields.forEach(function (field, i) {
			code.push(indent + 'this.$' + prop.name + '.' + field.name + ' = _' + prop.name + '.' + field.name + ';');
		});
		code.push(repeat('\t', 4) + '}');
		return code.join('\n');
	} else {
		return  'set: function (_' + prop.name + ') {\n' +
				repeat('\t', 5) + '$dispatch(this.$native, \'setValue:atIndex:\', [_' + prop.name + ', ' + index + ']);\n' +
				repeat('\t', 4) + '}';
	}
}

function generateFunction (state, json, fn) {
	fn.selector = fn.name + ':';
	var code = [], preamble = [];

	code.push('Object.defineProperty(' + state.class.name + ', \'' + fn.name + '\', {');
	code.push('\tvalue: function ' + generateArgList (state,json,fn.arguments,'(',')', '()') + ' {');
	code.push('\t\tif (!$init) { $initialize(); }');

	var body = generateMethodBody(state, json, fn, preamble, false, '$class', function (arg){ return '[' + arg + ']'; });
	preamble.length && (code.push('\t\t' + preamble.join('\n\t\t')));

	code.push(body);
	code.push('\t\t\treturn result;');
	code.push('\t},');
	code.push('\tenumerable: false,');  //don't show in enumeration
	code.push('\twritable: true');  //allow to be changed
	code.push('});');

	return code.join('\n');
}

function generateInstanceMethod (state, json, method) {
	var code = [], preamble = [];

	code.push('\tObject.defineProperty(' + state.class.name + '.prototype, \'' + method.name + '\', {');
	code.push('\t\tvalue: function ' + generateArgList (state,json,method.arguments,'(',')', '()') + ' {');

	var body = generateMethodBody(state, json, method, preamble, true, 'this.$native');
	var returnsObject = (body.indexOf('new') !== -1) && (body.indexOf('.constructor(') !== -1);
	code.push(body);
	var prefix;
	if (returnsObject) {
		code.push('\t\t\tvar instance = result;');
		prefix = 'instance';
	} else {
		prefix = 'this';
	}
	if (method.arguments.length) {
		code.push('\t\t\t'+prefix+'.$private.' + method.name + ' = '+prefix+'.$private.' + method.name + ' || [];');
		method.arguments.forEach(function (arg, i) {
			code.push('\t\t\t'+prefix+'.$private.' + method.name + '.push(_' + arg.name + ');');
		});
	}
	preamble.length && (code.push('\t\t' + preamble.join('\n\t\t')));

	if (!returnsObject) {
		code.push('\t\t\treturn result;');
	} else {
		code.push('\t\t\treturn instance;');
	}
	code.push('\t\t},');
	code.push('\t\tenumerable: false,');  //don't show in enumeration
	code.push('\t\twritable: true');  //allow to be changed
	code.push('\t});');

	return code.join('\n');
}

function generateClassMethod (state, json, method) {
	var code = [], preamble = [];

	code.push('Object.defineProperty(' + state.class.name + ', \'' + method.name + '\', {');
	code.push('\tvalue: function ' + generateArgList (state,json,method.arguments,'(',')', '()') + ' {');
	code.push('\t\tif (!$init) { $initialize(); }');
	var body = generateMethodBody(state, json, method, preamble, false, 'this.$class');
	preamble.length && (code.push('\t\t' + preamble.join('\n\t\t')));

	if (method.impl) {
		code.push('\t\treturn ' + body);
	} else {
		code.push(body);
		code.push('\t\treturn result;');
	}
	code.push('\t},');
	code.push('\tenumerable: false,');  //don't show in enumeration
	code.push('\twritable: true');  //allow to be changed
	code.push('});');

	return code.join('\n');
}

function generateFile (dir, name, obj, out, ext) {
	if (!obj.framework) {
		// logger.debug(chalk.gray('skipping'), chalk.yellow(name));
		return;
	}
	if (!obj.name) {
		console.log(obj);
		process.exit(1);
	}
	if (obj.framework.indexOf('/') >= 0) {
		obj.framework = path.basename(obj.framework);
	}
	logger.info(chalk.gray('generating ' + name), chalk.green(obj.framework + '/' + obj.name));
	var fdir = path.join(dir, obj.framework.toLowerCase());
	var fn = path.join(fdir, obj.name.toLowerCase() + (ext || '.js'));
	if (!fs.existsSync(fdir)) {
		fs.mkdirSync(fdir);
	}
	// don't overwrite if the same content
	if (fs.existsSync(fn)) {
		var buf = fs.readFileSync(fn);
		if (buf.length === out.length) {
			if (String(buf) === out) {
				logger.trace(chalk.gray('Skipping, already generated ... ' + path.basename(fn)));
				return;
			}
		}
	}
	fs.writeFileSync(fn, out);
}

function getPrimitiveValue (type) {
	switch (type) {
		case 'ulong':
			return 'unsigned long';
		case 'uint':
			return 'unsigned int';
		case 'ushort':
			return 'unsigned short';
		case 'uchar':
			return 'unsigned char';
		case 'long_long':
			return 'long long';
		case 'ulonglong':
			return 'unsigned long long';
		case 'enum':
			return 'int';
	}
	return type;
}

function isCharStarPointer (obj) {
	return obj.type === 'pointer' && obj.value === 'char *' ||
		obj.type === 'char *';
}

function isCharStarStarPointer (obj) {
	return obj.type === 'pointer' && obj.value === 'char **';
}

function isObject (obj) {
	return obj.type === 'objc_pointer' || obj.type === 'obj_interface' || obj.type === 'id';
}

function findBlock (json, signature, fn) {
	var c, block, blocks = json.blocks[fn.framework];
	if (blocks && blocks.length) {
		for (c = 0; c < blocks.length; c++) {
			block = blocks[c];
			if (block && block.signature === signature) {
				return block;
			}
		}
	}
	// the block signature could actually be a typedef
	if (signature in json.typedefs) {
		return findBlock(json, json.typedefs[signature].value, fn);
	}
	// search through other packages in case it's not defined in the same framework
	var packages = Object.keys(json.blocks);
	for (c = 0; c < packages.length; c++) {
		blocks = json.blocks[packages[c]];
		if (blocks && blocks.length) {
			for (var f = 0; f < blocks.length; f++) {
				block = blocks[f];
				if (block && block.signature === signature) {
					return block;
				}
			}
		}
	}
	console.log(JSON.stringify(fn,null,2));
	console.error("Couldn't find block with signature:", signature, "for framework:", fn.framework, ", function:", fn);
	process.exit(1);
}

function generateObjCValue (state, json, fn, arg, name, define, tab, arglist) {
	var code = [];
	tab = tab || '';
	arglist = arglist || [];
	var n;
	define = define === undefined ? true : define;
	if (isPrimitive(arg.encoding)) {
		var type = getPrimitiveValue(arg.type);
		arglist.push('(' + type +') ' + name);
		code.push('\t' + (define ? type + ' ' : '') + name + ' = [' + name + '_ isEqual:[NSNull null]] ? ' + toValueDefault(arg.encoding, arg.type) + ' : [' + name + '_ ' + toValue(arg.encoding, arg.type)+'];');
	} else if (arg.type === 'struct' || arg.type === 'pointer' || arg.type === 'char *') {
		if (isCharStarPointer(arg)) {
			code.push('\t' + (define ? arg.value + ' ' : '') + name + ' = (' + arg.value + ')[[' + name + '_ stringValue] UTF8String];');
		} else if (isCharStarStarPointer(arg)) {
			code.push('\t' + (define ? arg.value + ' ' : '') + name + ' = (' + arg.value + ')[(HyperloopPointer *)' + name + '_ pointerValue];');
		} else {
			code.push('\t' + (define ? arg.value + ' ' : '') + name + ' = *(' + arg.value + '*)[(HyperloopPointer *)' + name + '_ pointerValue];');
		}
		arglist.push('(' + arg.value +') ' + name);
	} else if (arg.type === 'constant_array') {
		var ii = arg.value.indexOf('[');
		if (ii < 0) {
			n = arg.value;
			arglist.push('(' + n + ') '+ name);
		} else {
			n = arg.value.substring(0, ii).trim();
			arglist.push('(' + n +' *) ' + name);
		}
		code.push('\t' + (define ? n + ' *' : '') + name + ' = (' + n + '*)[(HyperloopPointer *)' + name + '_ pointerValue];');
	} else if (arg.type === 'incomplete_array') {
		n = 'void **';
		arglist.push('(' + n +') ' + name);
		code.push('\t' + (define ? n + ' *' : '') + name + ' = (' + n + '*)[(HyperloopPointer *)' + name + '_ pointerValue];');
	} else if (arg.type === 'objc_pointer' || arg.type === 'id' || arg.type === 'objc_interface') {
		n = arg.value;
		code.push('\t' + (define ? n + ' ' : '') + name + ' = (' + n + ')[(HyperloopPointer *)' + name + '_ objectValue];');
		arglist.push('(' + n +') ' + name);
	} else if (arg.type === 'Class' || arg.encoding === '#') {
		n = arg.value;
		code.push('\t' + (define ? n + ' ' : '') + name + ' = (' + n + ')[(HyperloopPointer *)' + name + '_ classValue];');
		arglist.push('(' + n +') ' + name);
	} else if (arg.type === 'SEL' || arg.encoding === ':') {
		n = arg.value;
		code.push('\t' + (define ? n + ' ' : '') + name + ' = (' + n + ')[(HyperloopPointer *)' + name + '_ selectorValue];');
		arglist.push('(' + n +') ' + name);
	} else if (arg.type === 'block') {
		var block = findBlock(json, arg.value, fn);
		var js = blockgen.generateBlockCallback(state, json, block, arg, '\t', define);
		code.push(js);
		arglist.push('(' + arg.value +') ' + name);
	} else if (arg.encoding.charAt(0) === '^') {
		n = arg.value;
		arglist.push('(' + n +') ' + name);
		code.push('\t' + name + ' = (' + n + ')[(HyperloopPointer *)' + name + '_ pointerValue];');
	} else {
		var found;
		if (arg.type === 'record') {
			var struct = json.structs[arg.value];
			if (struct) {
				code.push('\t' + (define ? arg.value + ' ' : '') + name + ' = *(' + arg.value + '*)[(HyperloopPointer *)' + name + '_ pointerValue];');
				arglist.push('(' + arg.value +') ' + name);
				found = true;
			}
		} else if (/(union|vector|unexposed)/.test(arg.type)) {
			n = arg.value;
			arglist.push('(' + n +') ' + name);
			code.push('\t' + name + ' = (' + n + ')[(HyperloopPointer *)' + name + '_ pointerValue];');
			found = true;
		}
		if (!found) {
			logger.error("don't know how to encode:", arg);
			process.exit(1);
		}
	}
	return code.join('\n');
}

function generateObjCArgument (state, json, fn, arg, i, arglist, tab, define) {
	var code = [];
	var name = arg.name || 'arg' + i;
	tab = tab || '';
	define = define === undefined ? true : define;
	code.push('\tid ' + name + '_ = [args objectAtIndex:' + i + '];');
	code.push(generateObjCValue(state, json, fn, arg, name, define, tab, arglist));
	//state, json, arg, name, define, tab, arglist
	return tab + code.join('\n' + tab);
}

function generateObjCResult (state, json, fn, arglist, asProperty, tab) {
	var returnCode = '';
	var code = [];
	tab = tab || '';
	if (fn.returns && fn.returns.type !== 'void') {
		var returnType = getObjCReturnType(fn.returns);
		returnCode =  returnType + ' result$ = (' + returnType + ')';
	}
	if (asProperty) {
		code.push('\t' + returnCode + fn.name +';');
	} else {
		code.push('\t' + returnCode + fn.name +'(' + arglist.join(', ') +');');
	}
	if (fn.returns && fn.returns.type !== 'void') {
		code.push('\t' + getObjCReturnResult(fn.returns, 'result$'));
	} else {
		code.push('\treturn nil;');
	}
	return tab + code.join('\n' + tab);
}

function generateObjCFunction(state, json, fn, asProperty) {
	// console.log(state.class.name + ' ' + fn.name);
	var code = [];
	if (asProperty) {
		code.push('+(id)' + fn.name + ' {');
	} else {
		code.push('+(id)' + fn.name + ':(NSArray *)args {');
	}
	var MAX_TIMES = 10;
	var arglist = [];
	var c;
	if (!asProperty) {
		if (!fn.variadic) {
			code.push('#ifdef TARGET_IPHONE_SIMULATOR');
			code.push('\tif ([args count] != ' + fn.arguments.length + ') {');
			code.push('\t\t@throw [NSException exceptionWithName:@"InvalidArgument" reason:[NSString stringWithFormat:@"' + fn.name + ' requires ' + fn.arguments.length + ' arguments but only %lu passed", (unsigned long)[args count]] userInfo:nil];');
			code.push('\t}');
			code.push('#endif');
		} else {
			code.push('#ifdef TARGET_IPHONE_SIMULATOR');
			code.push('\tif ([args count] < ' + (fn.arguments.length + 1) + ') {');
			code.push('\t\t@throw [NSException exceptionWithName:@"InvalidArgument" reason:[NSString stringWithFormat:@"' + fn.name + ' requires at least ' + (fn.arguments.length + 1) + ' arguments but only %lu passed", (unsigned long)[args count]] userInfo:nil];');
			code.push('\t}');
			code.push('#endif');
		}
		fn.arguments.forEach(function (arg, i) {
			code.push(generateObjCArgument(state, json, fn, arg, i, arglist));
		});
		if (fn.variadic) {
			for (c = fn.arguments.length; c < MAX_TIMES; c++) {
				//TODO: need to deal with the format specifiers like NSLog
				//TODO: handle functions that require sentinel
				var arg = {
					type: 'id',
					value: 'id',
					encoding: '@',
					name: 'arg' + c
				};
				code.push('\tid arg' + c + ' = nil;');
				code.push('\tif ([args count] > ' + c + ') {');
				code.push(generateObjCArgument(state, json, fn, arg, c, arglist,'\t', false));
				code.push('\t}');
			}
		}
	}
	if (fn.variadic) {
		var isVoid = fn.returns.type === 'void';
		code.push('\tswitch ([args count]) {');
		for (c = fn.arguments.length + 1; c <= MAX_TIMES; c++) {
			code.push('\t\tcase ' + c + ': {');
			code.push(generateObjCResult(state, json, fn, arglist.slice(0, c), asProperty, '\t\t'));
			!isVoid && code.push('\t\t\tbreak;');
			code.push('\t\t}');
		}
		code.push('\t\tdefault: ' + (isVoid ? 'break;' : 'return nil;'));
		code.push('\t}');
	} else {
		code.push(generateObjCResult(state, json, fn, arglist, asProperty));
	}
	code.push('}');
	return code.join('\n');
}

function flattenStruct (str) {
	var x = str.indexOf('{');
	var y = str.indexOf('=');
	if (x < 0 || y < 0) {
		// could be just {dd}
		return str.replace(/}/g,'').replace(/{/g,'').trim();
	}
	var r = str.substring(0, x) + str.substring(y+1);
	var z = r.indexOf('}');
	if (z > 0) {
		r[z] = '';
	}
	return flattenStruct(r.trim());
}

function isObjectType (type, encoding) {
	switch (type) {
		case 'obj_interface':
		case 'objc_pointer':
		case 'Class':
		case 'class':
		case 'id':
			return true;
		default: break;
	}
	if (encoding && (encoding.charAt(0) === '@' || encoding.charAt(0) === '#')) {
		return true;
	}
	return false;
}

function createLogger(log, level) {
	log[level] && (logger[level] = function () {
		var args = Array.prototype.slice.call(arguments);
		log[level].call(log, chalk.magenta.inverse('[Hyperloop]') + ' ' + args.join(' '));
	});
}

function setLog (logFn) {
	['info','debug','warn','error','trace'].forEach(function (level) {
		createLogger(logFn, level);
	});
}

function generateSafeSymbol(signature) {
	return signature.replace(/[\s\^\(\)\\<\\>\*\:\+,]/g, '_');
}

function camelCase (string) {
	return string.replace(/^([A-Z])|[\s-_:](\w)/g, function (match, p1, p2, offset) {
		if (p2) { return p2.toUpperCase(); }
		return p1.toLowerCase();
	}).replace(/\:/g,'');
}

/**
 * attempt to resolve an argument into it's framework if possible
 */
function resolveArg (metabase, imports, arg) {
	switch (arg.type) {
		case 'struct': {
			if (arg.value in metabase.structs) {
				var struct = metabase.structs[arg.value];
				if (struct) {
					arg.framework = struct.framework;
					arg.filename = arg.value;
				} else {
					logger.warn("can't find arg struct ->", arg.value);
				}
			} else {
				logger.warn("can't resolve arg struct ->", arg.value);
			}
			break;
		}
		case 'class':
		case 'Class':
		case 'id':
		case 'objc_pointer':
		case 'obj_interface':
		case 'objc_interface': {
			var name = cleanupClassName(arg.value);
			if (name in metabase.classes) {
				var cls = metabase.classes[name];
				if (cls) {
					arg.framework = cls.framework;
					arg.filename = cls.filename || name;
				}
			}
		}
	}
}

exports.repeat = repeat;
exports.generateTemplate = generateTemplate;
exports.makeImports = makeImports;
exports.generateFile = generateFile;
exports.generateFunction = generateFunction;
exports.generateObjCFunction = generateObjCFunction;
exports.generateObjCResult = generateObjCResult;
exports.generateFieldGetter = generateFieldGetter;
exports.generateFieldSetter = generateFieldSetter;
exports.generateProp = generateProp;
exports.generateInstanceMethod = generateInstanceMethod;
exports.generateClassMethod = generateClassMethod;
exports.setLog = setLog;
exports.getObjCReturnResult = getObjCReturnResult;
exports.getProtocolClass = getProtocolClass;
exports.isProtocol = isProtocol;
exports.isObjectType = isObjectType;
exports.findBlock = findBlock;
exports.generateSafeSymbol = generateSafeSymbol;
exports.generateObjCValue = generateObjCValue;
exports.camelCase = camelCase;
exports.resolveArg = resolveArg;
exports.toValueDefault = toValueDefault;
exports.isPrimitive = isPrimitive;

Object.defineProperty(exports, 'logger', {
	get: function () {
		return logger;
	}
});
