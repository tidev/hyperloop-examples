var should = require('should'),
	helper = require('./helper');

describe('protocol', function () {

	it('should generate empty protocol', function (done) {
		helper.generate(helper.getFixture('empty_protocol.h'), helper.getTempFile('protocol.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).not.have.property('classes');
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

	it('should generate simple protocol', function (done) {
		helper.generate(helper.getFixture('simple_protocol.h'), helper.getTempFile('protocol.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).have.property('protocols', {
				A: {
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_protocol.h'),
					line: '2',
					methods: {
						a: {
							arguments: [],
							encoding: 'v16@0:8',
							instance: true,
							returns: {
								type: 'void',
								value: 'void',
								encoding: 'v'
							},
							selector: 'a',
							name: 'a'
						}
					},
					name: 'A'
				}
			});
			should(json).not.have.property('typedefs');
			should(json).not.have.property('classes');
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

	it('should generate simple protocol with optional property', function (done) {
		helper.generate(helper.getFixture('simple_protocol_with_optional_property.h'), helper.getTempFile('protocol.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).have.property('protocols', {
				A: {
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_protocol_with_optional_property.h'),
					line: '2',
					methods: {
						a: {
							arguments: [],
							encoding: 'v16@0:8',
							instance: true,
							optional: true,
							returns: {
								type: 'void',
								value: 'void',
								encoding: 'v'
							},
							selector: 'a',
							name: 'a'
						}
					},
					name: 'A'
				}
			});
			should(json).not.have.property('typedefs');
			should(json).not.have.property('classes');
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

	it('should generate simple protocol with required property', function (done) {
		helper.generate(helper.getFixture('simple_protocol_with_required_property.h'), helper.getTempFile('protocol.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).have.property('protocols', {
				A: {
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_protocol_with_required_property.h'),
					line: '2',
					methods: {
						a: {
							arguments: [],
							encoding: 'v16@0:8',
							instance: true,
							returns: {
								type: 'void',
								value: 'void',
								encoding: 'v'
							},
							selector: 'a',
							name: 'a'
						}
					},
					name: 'A'
				}
			});
			should(json).not.have.property('typedefs');
			should(json).not.have.property('classes');
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

	it('should generate simple protocol with required property and class method', function (done) {
		helper.generate(helper.getFixture('simple_protocol_with_required_method.h'), helper.getTempFile('protocol.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).have.property('protocols', {
				A: {
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_protocol_with_required_method.h'),
					line: '2',
					methods: {
						a: {
							arguments: [],
							encoding: 'v16@0:8',
							instance: false,
							returns: {
								type: 'void',
								value: 'void',
								encoding: 'v'
							},
							selector: 'a',
							name: 'a'
						}
					},
					name: 'A'
				}
			});
			should(json).not.have.property('typedefs');
			should(json).not.have.property('classes');
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
