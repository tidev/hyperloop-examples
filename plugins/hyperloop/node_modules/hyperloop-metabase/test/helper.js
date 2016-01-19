var spawn = require('child_process').spawn,
	plist = require('plist'),
	path = require('path'),
	wrench = require('wrench'),
	fs = require('fs'),
	tmpdirs = [],
	settings;

function getSimulatorSDK (callback) {
	if (settings) { return callback(null, settings); }
	var child = spawn('xcode-select', ['-print-path']);
	child.stdout.on('data', function (buf) {
		var dir = buf.toString().replace(/\n$/, ''),
			sdkdir = path.join(dir, 'Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator.sdk'),
			sdkSettings = path.join(sdkdir, 'SDKSettings.plist');
		if (!fs.existsSync(sdkSettings)) {
			return callback(new Error("iOS SDK not found"));
		}
		buf = fs.readFileSync(sdkSettings);
		var val = plist.parse(buf.toString());
		settings = {
			basedir: dir,
			sdkdir: sdkdir,
			version: val.DefaultDeploymentTarget || val.version
		};
		return callback(null, settings);
	});
	child.on('error', callback);
}

function getBinary (callback) {
	var bin = path.join(__dirname, '..', 'bin', 'metabase');
	if (fs.existsSync(bin)) {
		return callback(null, bin);
	}
	console.log('attempting to compile metabase for the first time ...');
	var child = spawn(path.join(__dirname, '..' , 'build.sh'), [], {stdio:'pipe'});
	child.stderr.on('data', function (buf) {
		// console.error(buf.toString().replace(/\n$/, ''));
	});
	child.stdout.on('data', function (buf) {
		// console.log(buf.toString().replace(/\n$/, ''));
	});
	child.on('error', callback);
	child.on('exit', function (err) {
		if (err !== 0) {
			return callback(new Error("metabase compile failed"));
		}
		if (fs.existsSync(bin)) {
			return callback(null, bin);
		}
		return callback(new Error("metabase compile did not produce binary at " + bin));
	});
}

function generate (input, output, callback, excludeSystemAPIs) {
	getSimulatorSDK (function (err, sdk) {
		if (err) { return callback(err); }
		getBinary(function (err, bin) {
			if (err) { return callback(err); }
			var args = [
					'-i', input,
					'-o', output,
					'-sim-sdk-path', sdk.sdkdir,
					'-min-ios-ver', sdk.version,
					'-pretty'
				];
			if (excludeSystemAPIs) {
				args.push('-x');
			}
			var child = spawn(bin, args);
			child.stderr.on('data', function (buf) {
				// process.stderr.write(buf);
			});
			child.stdout.on('data', function (buf) {
				// process.stdout.write(buf);
			});
			child.on('close', function (e) {
				if (e !== 0) {
					return callback(new Error("metabase generation failed"));
				}
				if (!fs.existsSync(output)) {
					return callback(new Error("metabase generation failed to generate output file"));
				}
				var json, buf;
				try {
					buf = fs.readFileSync(output);
					// console.log(buf.toString());
					json = JSON.parse(buf);
				}
				catch (E) {
					return callback(new Error("Error parsing generated output file. " + E.message));
				}
				callback(null, json, sdk);
			});
			child.on('error', callback);
		});
	});
}

function getTempDir () {
	var tmpdir = path.join(process.env.TEMP || process.env.TMPDIR || 'tmp', '' + Math.floor(Date.now()));
	if (!fs.existsSync(tmpdir)) {
		fs.mkdirSync(tmpdir);
		tmpdirs.indexOf(tmpdir) < 0 && tmpdirs.push(tmpdir);
	}
	return tmpdir;
}

function getTempFile (fn) {
	return path.join(getTempDir(), fn);
}

function getFixture (name) {
	return path.join(__dirname, 'fixtures', name);
}

process.on('exit', function () {
	if (tmpdirs) {
		tmpdirs.forEach(function (tmp) {
			wrench.rmdirSyncRecursive(tmp);
		});
		tmpdirs = null;
	}
});

exports.generate = generate;
exports.getSimulatorSDK = getSimulatorSDK;
exports.getTempDir = getTempDir;
exports.getFixture = getFixture;
exports.getTempFile = getTempFile;
