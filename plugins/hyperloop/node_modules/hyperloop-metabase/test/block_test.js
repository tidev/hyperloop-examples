var should = require('should'),
	helper = require('./helper');

describe('block', function () {

	it('should generate blocks', function (done) {
		helper.generate(helper.getFixture('blocks.h'), helper.getTempFile('blocks.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).not.have.property('protocols');
			should(json).not.have.property('enums');
			should(json).not.have.property('vars');
			should(json).have.property('classes', {
				A: {
					filename: helper.getFixture('blocks.h'),
					framework: 'fixtures',
					line: '2',
					methods: {
						'do:': {
							arguments: [
								{
									encoding: '@?',
									name: 'it',
									type: 'block',
									value: 'void (^)(int)'
								}
							],
							encoding: 'v24@0:8@?16',
							instance: true,
							name: 'do',
							returns: {
								encoding: 'v',
								type: 'void',
								value: 'void'
							},
							selector: 'do:'
						}
					},
					name: 'A',
					thirdparty: true
				},
				C: {
					filename: helper.getFixture('blocks.h'),
					framework: 'fixtures',
					line: '6',
					methods: {
						'foo': {
							arguments: [],
							encoding: '@?16@0:8',
							instance: true,
							name: 'foo',
							returns: {
								encoding: '@?',
								type: 'block',
								value: 'MyBlock'
							},
							selector: 'foo'
						}
					},
					name: 'C',
					thirdparty: true
				}
			});
			should(json).have.property('functions', {
				B: {
					arguments: [
						{
							encoding: '@?',
							name: 'Block',
							type: 'block',
							value: 'void (^)(int)'
						}
					],
					filename: helper.getFixture('blocks.h'),
					framework: 'fixtures',
					thirdparty: true,
					line: '1',
					name: 'B',
					returns: {
						encoding: 'v',
						type: 'void',
						value: 'void'
					}
				}
			});
			should(json).have.property('typedefs', {
				MyBlock: {
					encoding: '@?',
					filename: helper.getFixture('blocks.h'),
					framework: 'fixtures',
					thirdparty: true,
					line: '5',
					type: 'block',
					value: 'void (^)(void)'
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
				},
				{
					arguments: [],
					encoding: '@?',
					returns: {
						encoding: 'v',
						type: 'void',
						value: 'void'
					},
					signature: 'void (^)(void)',
					type: 'block'
				},
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
