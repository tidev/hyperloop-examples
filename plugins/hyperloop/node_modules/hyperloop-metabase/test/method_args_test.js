var should = require('should'),
	helper = require('./helper');

describe('method args', function () {

	it('should generate constructor', function (done) {
		helper.generate(helper.getFixture('method_arg_constructor.h'), helper.getTempFile('method_arg_constructor.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).have.property('classes', {
				A: {
					name: 'A',
					filename: helper.getFixture('method_arg_constructor.h'),
					framework: 'fixtures',
					thirdparty: true,
					line: '1',
					methods: {
						init: {
							arguments: [],
							constructor: true,
							encoding: '@16@0:8',
							name: 'init',
							selector: 'init',
							instance: true,
							returns: {
								encoding: '@',
								type: 'obj_interface',
								value: 'instancetype'
							}
						}
					}
				}
			});
			should(json).not.have.property('typedefs');
			should(json).not.have.property('protocols');
			should(json).not.have.property('enums');
			should(json).not.have.property('vars');
			should(json.metadata).have.property('api-version', '1');
			should(json.metadata).have.property('generated');
			should(json.metadata).have.property('min-version', sdk.version);
			should(json.metadata).have.property('sdk-path', sdk.sdkdir);
			should(json.metadata).have.property('platform', 'ios');
			should(json.metadata.generated).match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2,}Z/);
			done();
		});
	});

	it('should generate method with SEL arg', function (done) {
		helper.generate(helper.getFixture('method_arg_selector.h'), helper.getTempFile('method_arg_selector.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).have.property('classes', {
				A: {
					name: 'A',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('method_arg_selector.h'),
					line: '1',
					methods: {
						'initWithFoo:': {
							arguments: [
								{
									encoding: ':',
									name: 'sel',
									type: 'SEL',
									value: 'SEL'
								}
							],
							encoding: 'v24@0:8:16',
							instance: true,
							name: 'initWithFoo',
							selector: 'initWithFoo:',
							returns: {
								type: 'void',
								value: 'void',
								encoding: 'v'
							}
						}
					}
				},
				B: {
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('method_arg_selector.h'),
					line: '5',
					methods: {
						'foo:bar:c:': {
							arguments: [
								{
									encoding: '@',
									name: 'foo',
									type: 'obj_interface',
									value: 'A'
								},
								{
									encoding: ':',
									name: 'sel',
									type: 'SEL',
									value: 'SEL'
								},
								{
									encoding: 'i',
									name: 'd',
									type: 'int',
									value: 'int'
								}
							],
							encoding: '{A=}36@0:8{A=}16:16i24',
							instance: true,
							name: 'fooBarC',
							returns: {
								type: 'obj_interface',
								value: 'A',
								encoding: '@'
							},
							selector: 'foo:bar:c:'
						}
					},
					name: 'B'
				}
			});
			should(json).not.have.property('typedefs');
			should(json).not.have.property('protocols');
			should(json).not.have.property('enums');
			should(json).not.have.property('vars');
			should(json.metadata).have.property('api-version', '1');
			should(json.metadata).have.property('generated');
			should(json.metadata).have.property('min-version', sdk.version);
			should(json.metadata).have.property('sdk-path', sdk.sdkdir);
			should(json.metadata).have.property('platform', 'ios');
			should(json.metadata.generated).match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2,}Z/);
			done();
		});
	});

	it('should generate method with multiple arg', function (done) {
		helper.generate(helper.getFixture('method_arg_multi.h'), helper.getTempFile('method_arg_multi.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).have.property('classes', {
				A: {
					name: 'A',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('method_arg_multi.h'),
					line: '1',
					methods: {
						'initWithFoo:foo:': {
							arguments: [
								{
									encoding: ':',
									name: 'sel',
									type: 'SEL',
									value: 'SEL'
								},
								{
									encoding: 'i',
									name: 'bar',
									type: 'int',
									value: 'int'
								}
							],
							encoding: 'v28@0:8:16i24',
							instance: true,
							name: 'initWithFooFoo',
							selector: 'initWithFoo:foo:',
							returns: {
								type: 'void',
								value: 'void',
								encoding: 'v'
							}
						}
					}
				}
			});
			should(json).not.have.property('typedefs');
			should(json).not.have.property('protocols');
			should(json).not.have.property('enums');
			should(json).not.have.property('vars');
			should(json.metadata).have.property('api-version', '1');
			should(json.metadata).have.property('generated');
			should(json.metadata).have.property('min-version', sdk.version);
			should(json.metadata).have.property('sdk-path', sdk.sdkdir);
			should(json.metadata).have.property('platform', 'ios');
			should(json.metadata.generated).match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2,}Z/);
			done();
		});
	});
});
