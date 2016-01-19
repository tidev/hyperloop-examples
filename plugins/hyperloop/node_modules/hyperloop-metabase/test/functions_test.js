var should = require('should'),
	helper = require('./helper');

describe('function', function () {

	it('should generate functions', function (done) {
		helper.generate(helper.getFixture('functions.h'), helper.getTempFile('functions.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).not.have.property('classes');
			should(json).not.have.property('typedefs');
			should(json).not.have.property('protocols');
			should(json).not.have.property('enums');
			should(json).not.have.property('vars');
			should(json).have.property('functions', {
				Foo: {
					arguments: [],
					name: 'Foo',
					filename: helper.getFixture('functions.h'),
					framework: 'fixtures',
					thirdparty: true,
					line: '1',
					returns: {
						type: 'void',
						value: 'void',
						encoding: 'v'
					}
				},
				Bar: {
					arguments: [
						{
							encoding: 'f',
							name: '',
							type: 'float',
							value: 'float'
						}
					],
					filename: helper.getFixture('functions.h'),
					framework: 'fixtures',
					thirdparty: true,
					line: '2',
					name: 'Bar',
					returns: {
						type: 'int',
						value: 'int',
						encoding: 'i'
					}
				},
				A: {
					arguments: [
						{
							encoding: '*',
							name: 'name',
							type: 'pointer',
							value: 'char *'
						},
						{
							encoding: 'i',
							name: 'size',
							type: 'int',
							value: 'int'
						}
					],
					filename: helper.getFixture('functions.h'),
					framework: 'fixtures',
					thirdparty: true,
					line: '3',
					name: 'A',
					returns: {
						type: 'pointer',
						value: 'char *',
						encoding: '^c'
					}
				},
				Block: {
					arguments: [
						{
							encoding: '@?',
							name: '',
							type: 'block',
							value: 'void (^)(int)'
						}
					],
					filename: helper.getFixture('functions.h'),
					framework: 'fixtures',
					thirdparty: true,
					line: '4',
					name: 'Block',
					returns: {
						type: 'void',
						value: 'void',
						encoding: 'v'
					}
				},
				NamedBlock: {
					arguments: [
						{
							encoding: '@?',
							name: 'Name',
							type: 'block',
							value: 'void (^)(int)'
						}
					],
					filename: helper.getFixture('functions.h'),
					framework: 'fixtures',
					thirdparty: true,
					line: '5',
					name: 'NamedBlock',
					returns: {
						type: 'void',
						value: 'void',
						encoding: 'v'
					}
				},
				Function: {
					arguments: [
						{
							encoding: '^?',
							name: 'foo',
							type: 'pointer',
							value: 'void (*)(int)'
						}
					],
					filename: helper.getFixture('functions.h'),
					framework: 'fixtures',
					thirdparty: true,
					line: '6',
					name: 'Function',
					returns: {
						type: 'void',
						value: 'void',
						encoding: 'v'
					}
				},
				Variadic: {
					arguments: [{
						encoding: '*',
						name: '',
						type: 'pointer',
						value: 'char *'
					}],
					filename: helper.getFixture('functions.h'),
					framework: 'fixtures',
					thirdparty: true,
					line: '7',
					name: 'Variadic',
					returns: {
						type: 'void',
						value: 'void',
						encoding: 'v'
					},
					variadic: true
				}
			});
			should(json).have.property('blocks');
			should(json.blocks).have.property('fixtures', [
				{
					arguments: [
						{
							encoding: 'i',
							type: 'int',
							value: 'int'
						}
					],
					encoding: '@?',
					returns: {
						encoding: 'v',
						type: 'void',
						value: 'void'
					},
					signature: 'void (^)(int)',
					type: 'block'
				}
			]);
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
