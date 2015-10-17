exports.createLabel = function(params) {
	params.text = 'Hello from: app/themes/foo/lib/themes.js';

	return Ti.UI.createLabel(params);
};