var should = require('should'),
	helper = require('./helper'),
	utillib = require('util'),
	fs = require('fs'),
	metabase = require('../lib/metabase'),
	generator = require('../lib/generate/index'),
	util = require('../lib/generate/util'),
	nodePath = require('path'),
	buildDir = nodePath.join(__dirname, '..', 'build', 'hyperloop');

function Hyperloop () {
}

Hyperloop.prototype.toJSON = function() {
	return '[Hyperloop ' + this.name + ']';
};

Hyperloop.prototype.inspect = function() {
	return '[Hyperloop ' + this.name + ']';
};

Hyperloop.getWrapper = function () {
};

Hyperloop.registerWrapper = function () {
};

function HyperloopObject (pointer) {
	this.pointer = pointer;
	this.name = pointer.name || pointer.className;
}

HyperloopObject.prototype.toJSON = function() {
	return '[HyperloopObject ' + this.pointer + ']';
};

HyperloopObject.prototype.inspect = function() {
	return '[HyperloopObject ' + this.pointer + ']';
};

function HyperloopProxy (n, c) {
	this.$native = n;
	this.$classname = c;
	this.name = c;
}

HyperloopProxy.prototype.toJSON = function() {
	return '[HyperloopProxy ' + this.$native + ']';
};

HyperloopProxy.prototype.inspect = function() {
	return '[HyperloopProxy ' + this.$native + ']';
};

describe('generate', function () {

	this.timeout(10000);

	function generateMetabase (includes, cb) {
		metabase.getSystemFrameworks(buildDir, 'iphonesimulator', '9.0', function (err, json) {
			metabase.generateMetabase(buildDir, json.$metadata.sdkType, json.$metadata.sdkPath, json.$metadata.minVersion, includes, false, cb, true);
		});
	}

	afterEach(function () {
		Hyperloop.$invocations = null;
		delete global.Hyperloop;
		delete global.HyperloopObject;
	});

	beforeEach(function () {
		global.Hyperloop = Hyperloop;
		global.HyperloopObject = HyperloopObject;
	});

	before(function () {

		!fs.existsSync(nodePath.dirname(buildDir)) && fs.mkdir(nodePath.dirname(buildDir));
		!fs.existsSync(buildDir) && fs.mkdir(buildDir);

		var proxyCount = 0;
		var Module = require('module').Module;
		var old_nodeModulePaths = Module._nodeModulePaths;
		var appModulePaths = [];

		util.setLog({
			trace: function () {},
			debug: function () {},
			info: function () {},
			warn: function () {}
		});

		// borrowed from https://github.com/patrick-steele-idem/app-module-path-node/blob/master/lib/index.js
		Module._nodeModulePaths = function(from) {
			var paths = old_nodeModulePaths.call(this, from);

			// Only include the app module path for top-level modules
			// that were not installed:
			if (from.indexOf('node_modules') === -1) {
				paths = appModulePaths.concat(paths);
			}

			return paths;
		};

		function addPath (path) {
			function addPathHelper(targetArray) {
				path = nodePath.normalize(path);
				if (targetArray && targetArray.indexOf(path) === -1) {
					targetArray.unshift(path);
				}
			}

			var parent;
			path = nodePath.normalize(path);

			if (appModulePaths.indexOf(path) === -1) {
				appModulePaths.push(path);
				// Enable the search path for the current top-level module
				addPathHelper(require.main.paths);
				parent = module.parent;

				// Also modify the paths of the module that was used to load the app-module-paths module
				// and all of it's parents
				while(parent && parent !== require.main) {
					addPathHelper(parent.paths);
					parent = parent.parent;
				}
			}
		}

		Hyperloop.dispatch = function (native, selector, args, instance) {
			if (!native) {
				throw new Error('dispatch called without a native object');
			}
			instance = instance === undefined ? true : instance;
			// console.log('dispatch', (instance ? '-' : '+') + '[' + (native.name || native.className) + ' ' + selector + ']');
			Hyperloop.$invocations = Hyperloop.$invocations || [];
			// console.log('dispatch native', typeof(native), native, native.name);
			Hyperloop.$invocations.push({
				method: 'dispatch',
				args: [native, selector, args, instance]
			});
			Hyperloop.$last = Hyperloop.$invocations[Hyperloop.$invocations.length - 1];
			return Hyperloop.$dispatchResult;
		};

		Hyperloop.createProxy = function (opts) {
			// console.log('createProxy', opts);
			Hyperloop.$invocations = Hyperloop.$invocations || [];
			Hyperloop.$invocations.push({
				method: 'createProxy',
				args: Array.prototype.slice.call(arguments)
			});
			Hyperloop.$last = Hyperloop.$invocations[Hyperloop.$invocations.length - 1];
			return new HyperloopProxy (proxyCount++, opts.class);
		};

		// setup the node path to resolve files that we generated
		addPath(nodePath.dirname(buildDir));
	});

	it('should generate UIView', function (done) {
		var includes = [
			'UIKit/UIView.h'
		];
		generateMetabase(includes, function (err, json, outfile) {
			should(err).not.be.ok;
			should(json).be.ok;
			var state = generator.generateState();
			generator.generate('UIView', buildDir, outfile, state, function (err) {
				should(err).not.be.ok;
				var UIView = require(nodePath.join(buildDir, 'uikit/uiview.js'));
				should(UIView).be.a.function;
				var view = new UIView();
				should(view).be.an.object;
				should(UIView.name).be.equal('UIView');
				should(UIView.new).be.a.function;
				should(view.className).be.equal('UIView');
				should(view.$native).be.an.object;
				// console.log(utillib.inspect(Hyperloop.$invocations, {colors:true, depth:10}));
				done();
			});
		});
	});

	it('should generate NSString', function (done) {
		var includes = [
			'Foundation/NSString.h'
		];
		generateMetabase(includes, function (err, json, outfile) {
			should(err).not.be.ok;
			should(json).be.ok;
			var state = generator.generateState();
			generator.generate('NSString', buildDir, outfile, state, function (err) {
				should(err).not.be.ok;
				var NSString = require(nodePath.join(buildDir, 'foundation/nsstring.js'));
				should(NSString).be.a.function;
				var view = new NSString();
				should(view).be.an.object;
				should(NSString.name).be.equal('NSString');
				should(NSString.new).be.a.function;
				should(view.className).be.equal('NSString');
				should(view.$native).be.an.object;
				// console.log(utillib.inspect(Hyperloop.$invocations, {colors:true, depth:10}));
				// console.log(utillib.inspect(view, {colors:true}));
				done();
			});
		});
	});

	it('should generate UILabel', function (done) {
		var includes = [
			'UIKit/UILabel.h'
		];
		generateMetabase(includes, function (err, json, outfile) {
			should(err).not.be.ok;
			should(json).be.ok;
			var state = generator.generateState();
			generator.generate('UILabel', buildDir, outfile, state, function (err) {
				should(err).not.be.ok;
				var UILabel = require(nodePath.join(buildDir, 'uikit/uilabel.js'));
				should(UILabel).be.a.function;
				var label = new UILabel();
				should(label).be.an.object;
				should(UILabel.name).be.equal('UILabel');
				should(UILabel.new).be.a.function;
				should(label.className).be.equal('UILabel');
				should(label.$native).be.an.object;
				label.setText('hello');
				// console.log(utillib.inspect(Hyperloop.$invocations, {colors:true, depth:10}));
				// console.log(utillib.inspect(label, {colors:true}));
				should(Hyperloop.$last).be.eql({
					method: 'dispatch',
					args: [
						label.$native,
						'setText:',
						['hello'],
						true
					]
				});
				done();
			});
		});
	});
});
