var should = require('should'),
	helper = require('./helper');

describe('typedef', function () {

	it('should generate typedef', function (done) {
		helper.generate(helper.getFixture('simple_typedef.h'), helper.getTempFile('typedef.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).have.property('typedefs', {
				i: {
					encoding: 'i',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '2',
					type: 'int',
					value: 'int'
				},
				s: {
					encoding: 's',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '3',
					type: 'short',
					value: 'short'
				},
				l: {
					encoding: 'l',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '4',
					type: 'long',
					value: 'long'
				},
				d: {
					encoding: 'd',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '5',
					type: 'double',
					value: 'double'
				},
				f: {
					encoding: 'f',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '6',
					type: 'float',
					value: 'float'
				},
				c: {
					encoding: 'c',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '7',
					type: 'char_s',
					value: 'char'
				},
				q: {
					encoding: 'q',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '8',
					type: 'long_long',
					value: 'long long'
				},
				C: {
					encoding: 'C',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '9',
					type: 'uchar',
					value: 'unsigned char'
				},
				I: {
					encoding: 'I',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '10',
					type: 'uint',
					value: 'unsigned int'
				},
				S: {
					encoding: 'S',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '11',
					type: 'ushort',
					value: 'unsigned short'
				},
				L: {
					encoding: 'L',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '12',
					type: 'ulong',
					value: 'unsigned long'
				},
				Q: {
					encoding: 'Q',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '13',
					type: 'ulonglong',
					value: 'unsigned long long'
				},
				B: {
					encoding: 'i',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '14',
					type: 'int',
					value: 'int'
				},
				BB: {
					encoding: 'B',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '15',
					type: 'bool',
					value: '_Bool'
				},
				v: {
					encoding: 'v',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '16',
					type: 'void',
					value: 'void'
				},
				vv: {
					encoding: '^v',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '17',
					type: 'pointer',
					value: 'void *'
				},
				vvv: {
					encoding: '^^v',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '18',
					type: 'pointer',
					value: 'void **'
				},
				CS: {
					encoding: '*',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '19',
					type: 'pointer',
					value: 'char *'
				},
				CSS: {
					encoding: '^*',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '20',
					type: 'pointer',
					value: 'char **'
				},
				ID: {
					encoding: '@',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '21',
					type: 'objc_pointer',
					value: 'id'
				},
				SE: {
					encoding: '^:',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('simple_typedef.h'),
					line: '22',
					type: 'pointer',
					value: 'SEL *'
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

	it('should generate nameless typedef', function (done) {
		helper.generate(helper.getFixture('nameless_typedef.h'), helper.getTempFile('typedef.json'), function (err, json, sdk) {
			if (err) { return done(err); }
			should(json).be.an.object;
			should(sdk).be.an.object;
			should(json).have.property('metadata');
			should(json).have.property('typedefs', {
				UIFloatRange: {
					encoding: '{UIFloatRange=ff}',
					framework: 'fixtures',
					thirdparty: true,
					filename: helper.getFixture('nameless_typedef.h'),
					line: '4',
					type: 'struct',
					value: 'UIFloatRange'
				},
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
