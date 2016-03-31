var should = require('should'),
	spawn = require('child_process').spawn;

describe('xcodebuild', function () {

	it('should run unit tests', function (done) {
		var child = spawn('xcodebuild', ['test', '-scheme', 'unittest']);
		child.on('error', done);
		child.stdout.on('data', function (buf) {
			// process.stdout.write(buf);
		});
		child.stderr.on('data', function (buf) {
			process.stderr.write(buf);
		});
		child.on('close', function (ec) {
			if (ec !== 0) {
				return done(new Error("xcodebuild unit tests failed"));
			}
			done();
		});
	});

});
