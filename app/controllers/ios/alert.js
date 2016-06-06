(function (container) {

	var UIAlertController = require('UIKit/UIAlertController'),
		UIAlertAction = require('UIKit/UIAlertAction'),
		UIAlertControllerStyleAlert = require('UIKit').UIAlertControllerStyleAlert,
		UIAlertControllerStyleActionSheet = require('UIKit').UIAlertControllerStyleActionSheet,
		UIAlertActionStyleDefault = require('UIKit').UIAlertActionStyleDefault,
		UIAlertActionStyleDestructive = require('UIKit').UIAlertActionStyleDestructive,
		UIAlertActionStyleCancel = require('UIKit').UIAlertActionStyleCancel,
		TiApp = require('Titanium/TiApp');
		
	function showAlertWithStyle(style) {
		var alertController = UIAlertController.alertControllerWithTitleMessagePreferredStyle(
			'My Title',
			'My Message',
			style
		);

		var alertAction = UIAlertAction.actionWithTitleStyleHandler('OK', UIAlertActionStyleDefault, function () {
			$.notice.setText('Clicked OK!');
		});
			
		var cancelAction = UIAlertAction.actionWithTitleStyleHandler('Cancel', UIAlertActionStyleCancel, function () {
			$.notice.setText('Clicked Cancel!');
		});
		
		var destructiveAction = UIAlertAction.actionWithTitleStyleHandler('Delete', UIAlertActionStyleDestructive, function () {
			$.notice.setText('Clicked Delete!');
		});

		alertController.addAction(alertAction);
		alertController.addAction(destructiveAction);
		alertController.addAction(cancelAction);

		TiApp.app().showModalController(alertController, true);
	}

	$.buttonAlert.addEventListener('click', function () {
		showAlertWithStyle(UIAlertControllerStyleAlert);
	});
	
	$.buttonOptions.addEventListener('click', function () {
		showAlertWithStyle(UIAlertControllerStyleActionSheet);
	});

})($.alert_container);
