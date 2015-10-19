/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
var util = require('./util');

function getBlockAsReturnVariable (name, block) {
	var i = block.indexOf('(^)');
	return block.substring(0, i + 2) + name + block.substring(i + 2);
}

//FIXME this needs to be refactored along with the method above
function generateBlockCallback (state, json, block, arg, tab, define) {
	// TODO: do we need to wrap the callback in a managed object and then
	// JS protect/unprotect?
	// see http://thirdcog.eu/pwcblocks/#objcblocks
	var code = [],
		argnames = [],
		returnVar = define ? getBlockAsReturnVariable(arg.name, arg.value) : arg.name,
		arglist = block.arguments.map(function (arg, i) {
			argnames.push('_arg' + i);
			return arg.value + ' arg' + i;
		});
	code.push(tab + 'if (![' + arg.name + '_ isKindOfClass:[KrollCallback class]]) {');
	code.push(tab + '\t@throw [NSException exceptionWithName:@"InvalidArgument" reason:@"callback must be a function type" userInfo:nil];');
	code.push(tab + '}');
	code.push(tab + 'KrollCallback *callback = (KrollCallback *)' + arg.name + '_;');
	code.push(tab + returnVar + ' = ^' + '(' + arglist.join(', ') + ') {');
	block.arguments.forEach(function (arg, i) {
		code.push(tab + '\t' + util.getObjCReturnResult(arg, 'arg' + i, 'id _arg' + i +' ='));
	});
	code.push(tab + '\tNSArray *args = @[' + argnames.join(', ') + '];');
	//FIXME: move to HyperloopUtils
	code.push(tab + '\t[callback call:args thisObject:nil];');
	code.push(tab + '};');
	return code.join('\n');
}

/**
 * return a suitable (and unique )method name for a block signature
 */
function generateBlockMethodName (signature) {
	return 'Block_' + util.generateSafeSymbol(signature);
}

function getType (state, json, arg, argname, obj) {
	switch (arg.value) {
		case 'ObjectType':
		case 'KeyType':
			return 'id ' + argname;
		default:
			if (arg.type === 'block') {
				var block = util.findBlock(json, arg.value, obj);
				return block.returns.value + '(^' + argname+')(' + block.arguments.map(function (arg) {
					return arg.value;
				}).join(', ') + ')';
			}
			return arg.value + ' ' + argname;
	}
}

function addImport (state, json, type, value, encoding) {
	switch (type) {
		case 'id':
		case 'objc_pointer':
		case 'obj_interface':
		case 'obj_interface': {
			if (util.isProtocol(value)) {
				var name = util.getProtocolClass(value);
				//TODO: need to lookup protocols
				break;
			}
			value = value.replace(/\*/g,'').trim();
			if (value in json.classes) {
				var cls = json.classes[value];
				state.frameworks[cls.framework] = 1;
				break;
			}
			break;
		}
		case 'struct': {
			//TODO
			break;
		}
	}
}

function generateBlockWrapper (state, json, block) {
	var code = [], argnames = [];
	var name = generateBlockMethodName(block.signature);
	code.push('+ (id) ' + name + ':(KrollCallback *) callback {');
	var args = block.arguments.map(function (arg, i) {
		if (arg.type !== 'void') {
			argnames.push('_arg' + i);
			addImport(state, json, arg.type, arg.value, arg.encoding);
			return getType(state, json, arg, 'arg' + i, state);
		}
	}).filter(function(n) { return !!n; });
	if (args.length) {
		code.push('\treturn [[^(' + args.join(', ') + ') {');
	} else {
		code.push('\treturn [[^{');
	}
	code.push('\t\t[callback retain];');
	code.push('\t\tvoid(^Callback)(void) = ^{');
	var release;
	if (argnames.length) {
		block.arguments.forEach(function (arg, i) {
			if (util.isObjectType(arg.type, arg.encoding)) {
				code.push('\t\t\t' + util.getObjCReturnResult(arg, 'arg' + i, 'id _arg' + i +' =', ''));
			} else {
				code.push('\t\t\t' + util.getObjCReturnResult(arg, 'arg' + i, 'id _arg' + i +' ='));
			}
		});
		code.push('\t\t\tNSArray *args = [@[' + argnames.join(', ') + '] retain];');
		release = true;
	}
	if (release) {
		code.push('\t\t\t[HyperloopUtils invokeCallback:callback args:args thisObject:callback];');
		code.push('\t\t\t[args autorelease];');
	} else {
		code.push('\t\t\t[HyperloopUtils invokeCallback:callback args:nil thisObject:callback];');
	}
	code.push('\t\t\t[callback autorelease];');
	code.push('\t\t};');
	code.push('\t\tif ([NSThread isMainThread]) {');
	code.push('\t\t\tCallback();');
	code.push('\t\t} else {');
	code.push('\t\t\tdispatch_async(dispatch_get_main_queue(), Callback);');
	code.push('\t\t}');
	code.push('\t} copy] autorelease];');
	// code.push('\treturn [[Callback copy] autorelease];');
	code.push('}');
	return code.join('\n');
}

exports.generateBlockCallback = generateBlockCallback;
exports.generateBlockMethodName = generateBlockMethodName;
exports.generateBlockWrapper = generateBlockWrapper;
