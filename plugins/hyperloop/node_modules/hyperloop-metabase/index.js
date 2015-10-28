/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
module.exports = require('./lib');

// map these so that the plugin can use them
['chalk', 'wrench', 'async'].forEach(function (k) {
	Object.defineProperty(module.exports, k, {
		get: function () {
			return require(k);
		}
	});
});
