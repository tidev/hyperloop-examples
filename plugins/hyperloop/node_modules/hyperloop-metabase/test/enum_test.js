var should = require('should'),
	helper = require('./helper');

describe('enum', function () {

	it('should generate enums', function (done) {
		helper.generate(helper.getFixture('enums.h'), helper.getTempFile('enums.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).not.have.property('classes');
			should(json).not.have.property('protocols');
			should(json).not.have.property('vars');
			should(json).have.property('enums');
			should(json.enums).have.property('Color');
			should(json.enums.Color).have.property('values', {
				RED: 0,
				GREEN: 1,
				BLUE: 2
			});
			should(json.enums).have.property('ABC');
			should(json.enums.ABC).have.property('values', {
				A: 0,
				B: 1,
				C: 10,
				D: 11,
				E: 1,
				F: 2,
				G: 12
			});
			should(json.enums._NSMatrixMode).have.property('values', {
				NSHighlightModeMatrix: 1,
				NSListModeMatrix: 2,
				NSRadioModeMatrix: 0,
				NSTrackModeMatrix: 3
			});
			should(json.typedefs).have.property('NSMatrixMode', {
				encoding: 'i',
				filename: helper.getFixture('enums.h'),
				framework: 'fixtures',
				thirdparty: true,
				line: '8',
				type: 'enum',
				value: 'enum _NSMatrixMode'
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
