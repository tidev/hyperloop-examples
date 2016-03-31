var should = require('should'),
	helper = require('./helper');

describe('union', function () {

	it('should generate unions', function (done) {
		helper.generate(helper.getFixture('unions.h'), helper.getTempFile('unions.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).not.have.property('protocols');
			should(json).not.have.property('enums');
			should(json).not.have.property('vars');
			should(json).not.have.property('classes');
			should(json).not.have.property('typedefs');
			should(json).not.have.property('functions');
			should(json).not.have.property('blocks');
			should(json).have.property('unions', {
				U: {
					fields: [
						{
							encoding: 'i',
							name: 'i',
							type: 'int'
						},
						{
							encoding: 'f',
							name: 'f',
							type: 'float'
						},
						{
							encoding: 'c',
							name: 'c',
							type: 'char_s'
						}
					],
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('unions.h'),
					line: '1',
					name: 'U'
				}
			});
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
