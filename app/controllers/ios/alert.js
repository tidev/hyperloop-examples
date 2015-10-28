(function (container) {

	var UIAlertController = require('UIKit/UIAlertController'),
		UIAlertAction = require('UIKit/UIAlertAction'),
		UIAlertControllerStyleAlert = require('UIKit').UIAlertControllerStyleAlert,
		UIAlertActionStyleDefault = require('UIKit').UIAlertActionStyleDefault,
		TiApp = require('Titanium/TiApp');

	var alertController = UIAlertController.alertControllerWithTitleMessagePreferredStyle(
		'My Title',
		'My Message',
		UIAlertControllerStyleAlert
	);

	var alertAction = UIAlertAction.actionWithTitleStyleHandler('OK', UIAlertActionStyleDefault, function () {
		$.notice.setText('Clicked!');
	});

	alertController.addAction(alertAction);

	$.button.addEventListener('click', function () {
		TiApp.app().showModalController(alertController, true);
	});

})($.alert_container);
