/* global ENV_PROD */

var Log = module.exports = {};

Log.args = function () {
	var args = Array.prototype.slice.call(arguments);

	// Stringify non-strings
	args = args.map(function (arg) {
		return (typeof arg === 'string') ? arg : JSON.stringify(arg, OS_IOS ? null : (key, value) => {

			// Just show apiName with optional ID and class
			if (typeof value === 'object' && value.apiName) {
				return value.apiName + (value.id ? '#' + value.id : '') + (value.class ? '.' + value.class : '');
			}

			return value;

		}, 2);
	});

	var message = args.join(' ');

	// Use error-level for production or they will not show in console when deployed to device
	console[ENV_PROD ? 'error' : 'info'](message);
};
