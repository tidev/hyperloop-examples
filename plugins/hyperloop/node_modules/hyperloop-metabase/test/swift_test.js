var should = require('should'),
	helper = require('./helper'),
	fs = require('fs'),
	metabase = require('../lib/metabase'),
	json,
	sdkdir;

describe('swift', function () {

	before(function (done) {
		this.timeout(20000);
		// turn off trace logging
		require('../lib/generate/util').setLog({trace:function(){}});
		helper.getSimulatorSDK(function (err, sdk) {
			if (err) { return done(err); }
			sdkdir = sdk.sdkdir;
			var tmpdir = helper.getTempDir();
			metabase.generateMetabase (tmpdir, 'iphonesimulator', sdkdir, sdk.version, ['<Foundation/Foundation.h>','<UIKit/UIKit.h>'], false, function (err, json_) {
				if (err) { return done(err); }
				json = json_;
				done();
			});
		});
	});

	it('should generate swift class', function (done) {
		metabase.generateSwiftMetabase(helper.getTempDir(), 'iphonesimulator', sdkdir, '9.0', json, 'Swift', helper.getFixture('simple_class.swift'), function (err, result) {
			should(err).not.be.ok;
			should(result).be.an.object;
			should(result).have.property('imports');
			should(result).have.property('classes');
			should(result).have.property('filename', helper.getFixture('simple_class.swift'));
			should(result.imports).be.eql(['UIKit']);
			should(result.classes).have.property('MyUI');
			should(result.classes.MyUI).have.property('name', 'MyUI');
			should(result.classes.MyUI).have.property('superclass', 'UIView');
			should(result.classes.MyUI).have.property('language', 'swift');
			should(result.classes.MyUI).have.property('framework', 'Swift');
			should(result.classes.MyUI).have.property('filename', helper.getFixture('simple_class.swift'));
			should(result.classes.MyUI).have.property('thirdparty', true);
			should(result.classes.MyUI).have.property('methods', {});
			should(result.classes.MyUI).have.property('properties', {});
			done();
		});
	});

	it('should not generate private swift class', function (done) {
		metabase.generateSwiftMetabase(helper.getTempDir(), 'iphonesimulator', sdkdir, '9.0', json, 'Swift', helper.getFixture('private_class.swift'), function (err, result) {
			should(err).not.be.ok;
			should(result).be.an.object;
			should(result.imports).be.eql(['UIKit']);
			should(result).have.property('classes', {});
			should(result).have.property('filename', helper.getFixture('private_class.swift'));
			done();
		});
	});

	it('should handle syntax error', function (done) {
		metabase.generateSwiftMetabase(helper.getTempDir(), 'iphonesimulator', sdkdir, '9.0', json, 'Swift', helper.getFixture('syntaxerror.swift'), function (err, result) {
			should(err).be.ok;
			should(err.message).be.equal('Swift file at ' + helper.getFixture('syntaxerror.swift') + ' has compiler problems. Please check to make sure it compiles OK.');
			done();
		});
	});

	it('should generate swift class with functions', function (done) {
		metabase.generateSwiftMetabase(helper.getTempDir(), 'iphonesimulator', sdkdir, '9.0', json, 'Swift', helper.getFixture('class_functions.swift'), function (err, result) {
			should(err).not.be.ok;
			should(result).be.an.object;
			should(result).have.property('imports');
			should(result).have.property('classes');
			should(result).have.property('filename', helper.getFixture('class_functions.swift'));
			should(result.imports).be.eql(['UIKit','Foundation']);
			should(result.classes).have.property('MyUI');
			should(result.classes.MyUI).have.property('name', 'MyUI');
			should(result.classes.MyUI).have.property('superclass', 'UIView');
			should(result.classes.MyUI).have.property('language', 'swift');
			should(result.classes.MyUI).have.property('framework', 'Swift');
			should(result.classes.MyUI).have.property('filename', helper.getFixture('class_functions.swift'));
			should(result.classes.MyUI).have.property('thirdparty', true);
			should(result.classes.MyUI).have.property('methods', {
				add: {
					name: 'add',
					selector: 'add:',
					arguments: [
						{
							name: 'x',
							type: {
								value: 'CGFloat',
								type: 'double',
								encoding: 'd'
							}
						}
					],
					returns: {
						value: 'CGFloat',
						type: 'double',
						encoding: 'd'
					},
					instance: false
				},
				makeRect: {
					name: 'makeRect',
					selector: 'makeRect:height:',
					instance: true,
					returns: {
						value: 'CGRect',
						type: 'CGRect',
						encoding: '{CGRect={CGPoint=dd}{CGSize=dd}}'
					},
					arguments: [
						{
							name: 'width',
							type: {
								value: 'CGFloat',
								type: 'double',
								encoding: 'd'
							}
						},
						{
							name: 'height',
							type: {
								value: 'CGFloat',
								type: 'double',
								encoding: 'd'
							}
						}
					]
				}
			});
			should(result.classes.MyUI).have.property('properties', {});
			done();
		});
	});

	it('should generate swift class with properties', function (done) {
		metabase.generateSwiftMetabase(helper.getTempDir(), 'iphonesimulator', sdkdir, '9.0', json, 'Swift', helper.getFixture('class_properties.swift'), function (err, result) {
			should(err).not.be.ok;
			should(result).be.an.object;
			should(result).have.property('imports');
			should(result).have.property('classes');
			should(result).have.property('filename', helper.getFixture('class_properties.swift'));
			should(result.imports).be.eql(['UIKit']);
			should(result.classes).have.property('MyUI');
			should(result.classes.MyUI).have.property('name', 'MyUI');
			should(result.classes.MyUI).have.property('superclass', 'UIView');
			should(result.classes.MyUI).have.property('language', 'swift');
			should(result.classes.MyUI).have.property('framework', 'Swift');
			should(result.classes.MyUI).have.property('filename', helper.getFixture('class_properties.swift'));
			should(result.classes.MyUI).have.property('thirdparty', true);
			should(result.classes.MyUI).have.property('methods', {});
			should(result.classes.MyUI).have.property('properties', {
				someProperty: {
					name: 'someProperty',
					type: {
						value: 'double',
						type: 'double',
						encoding: 'd'
					}
				}
			});
			done();
		});
	});

	it('should generate managled class names', function () {
		var value = metabase.generateSwiftMangledClassName('a', 'b');
		should(value).be.equal('_TtC1a1b');
	});

});
