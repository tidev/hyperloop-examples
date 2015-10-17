/**
 * Hyperloop ®
 * Copyright (c) 2015 by Appcelerator, Inc.
 * All Rights Reserved. This library contains intellectual
 * property protected by patents and/or patents pending.
 */
(function () {
	/**
	 * main entry point for our plugin which looks for the platform specific
	 * plugin to invoke
	 */
	exports.init = function (_logger, _config, _cli, appc) {
		var fs = require('fs'),
			path = require('path'),
			platform = _cli.argv.platform;
		// see if we have a platform specific hyperloop and we're running for that target
		if (platform && _cli.tiapp && _cli.tiapp['deployment-targets'] && _cli.tiapp['deployment-targets'][platform]) {
			var modules = _cli.tiapp.modules.map(function (m) {
				return m.id === 'hyperloop' && m.platform && m.platform.indexOf(platform) !== -1;
			}).filter(function (m) { return !!m; });
			// make sure we have the module configured for hyperloop
			if (modules.length) {
				var name = /(ipad|iphone|ios)/i.test(platform) ? 'ios' : platform,
					plugin = path.join(__dirname, name, 'hyperloop.js');
				// see if we have the plugin installed
				if (fs.existsSync(plugin)) {
					_logger.warn('Hyperloop is currently available in Beta and should not be used for production applications.');
					plugin = require(plugin);
					return plugin.init.apply(this, arguments);
				} else {
					_logger.error('Hyperloop is currently configured by the module has not be installed.');
					_logger.error('Add the following to your tiapp.xml:');
					_logger.error('');
					_logger.error('	<modules>');
					_logger.error('		<module platform="' + platform + '">hyperloop</module>');
					_logger.error('	</modules>');
					_logger.error('');
					process.exit(1);
				}
			}
		}
	};
})();
