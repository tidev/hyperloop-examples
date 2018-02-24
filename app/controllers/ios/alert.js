import { UIAlertController, UIAlertAction } from 'UIKit';
import { UIKit } from 'UIKit';
import { TiApp } from 'Titanium/TiApp';

const UIAlertControllerStyleAlert = UIKit.UIAlertControllerStyleAlert;
const UIAlertControllerStyleActionSheet = UIKit.UIAlertControllerStyleActionSheet;
const UIAlertActionStyleDefault = UIKit.UIAlertActionStyleDefault;
const UIAlertActionStyleDestructive = UIKit.UIAlertActionStyleDestructive;
const UIAlertActionStyleCancel = UIKit.UIAlertActionStyleCancel;

function showAlertWithStyle(style) {
	const alertController = UIAlertController.alertControllerWithTitleMessagePreferredStyle(
		'My Title',
		'My Message',
		style
	);

	const alertAction = UIAlertAction.actionWithTitleStyleHandler('OK', UIAlertActionStyleDefault, () => {
		$.notice.setText('Clicked OK!');
	});
		
	const cancelAction = UIAlertAction.actionWithTitleStyleHandler('Cancel', UIAlertActionStyleCancel, () => {
		$.notice.setText('Clicked Cancel!');
	});
	
	const destructiveAction = UIAlertAction.actionWithTitleStyleHandler('Delete', UIAlertActionStyleDestructive, () => {
		$.notice.setText('Clicked Delete!');
	});

	alertController.addAction(alertAction);
	alertController.addAction(destructiveAction);
	alertController.addAction(cancelAction);

	TiApp.app().showModalController(alertController, true);
}

function showAlert() {
	showAlertWithStyle(UIAlertControllerStyleAlert);
}

function showOptions() {
	showAlertWithStyle(UIAlertControllerStyleActionSheet);
}
