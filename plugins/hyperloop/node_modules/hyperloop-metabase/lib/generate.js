/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
var gen = require('./generate/index');

// for testing
if (module.id === ".") {
	// var fs = require('fs');
	// !fs.existsSync('build') && fs.mkdirSync('build');
	// !fs.existsSync('build/hyperloop') && fs.mkdirSync('build/hyperloop');
	//
	// fs.writeFileSync('build/hyperloop/example.js', '\n'+
	// '(function() {var MyClass=Hyperloop.defineClass("MyClass","UIView");\n' +
	// 'MyClass.addMethod({\n'+
	// 'selector:"drawRect:", encoding:"v@:{CGRect={CGPoint=dd}{CGSize=dd}}", callback:function() { },\n' +
	// '})\n' +
	// 'MyClass.addMethod({\n'+
	// 'selector:"foo", encoding:"@@:", callback:function() { }\n' +
	// '})\n' +
	// 'MyClass.addMethod({\n'+
	// 'selector:"charstar", encoding:"*@:", callback:function() { }\n' +
	// '})\n' +
	// 'MyClass.addMethod({\n'+
	// 'selector:"intpointer", encoding:"^i@:", callback:function() { }\n' +
	// '})\n' +
	// 'MyClass.addMethod({\n'+
	// 'signature:"foo:bar:", arguments:["float","int"], callback:function() { }\n' +
	// '})\n' +
	// 'MyClass.addMethod({\n'+
	// 'selector:"float", encoding:"f@:", callback:function() { }\n' +
	// '})' +
	// '})();');
	//
	// fs.writeFileSync('build/hyperloop/example2.js', '\n'+
	// '(function() {var MyClass2=Hyperloop.defineClass("MyClass2","UILabel");\n' +
	// 'MyClass2.addMethod({\n'+
	// 'selector:"drawRect:", encoding:"v@:{CGRect={CGPoint=dd}{CGSize=dd}}", callback:function() { },\n' +
	// '})\n' +
	// '})();');
	//
	// var state = gen.parse('build/hyperloop/example.js');
	// state = gen.parse('build/hyperloop/example2.js', state);
	var state = gen.generateState();
	gen.generate('hyperloop', 'build/hyperloop', 'build/metabase-9.0-iphonesimulator-f0220749b5e279c3aee5b7a9a0c9437b.json', state, function (err) {
		if (err) {
			console.error(err);
			process.exit(1);
		}
	});
}
