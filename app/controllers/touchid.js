
(function (container) {
	var LAContext = require('LocalAuthentication/LAContext');
	var LocalAuthentication = require('LocalAuthentication/LocalAuthentication');
	var context = new LAContext();

	// check to see if it's enabled
	if (context.canEvaluatePolicyError(LocalAuthentication.LAPolicyDeviceOwnerAuthenticationWithBiometrics)) {
		var label = Ti.UI.createLabel({
			text: "Touch ID supported"
		});
		container.add(label);
		context.evaluatePolicyLocalizedReasonReply(LocalAuthentication.LAPolicyDeviceOwnerAuthenticationWithBiometrics, 'Please give us your Fingerprint to demonstrate the API', function (success) {
			if (success) {
				alert('Cool!');
			}
		});
	} else {
		if (ENV_DEV) {
			var label = Ti.UI.createLabel({
				text: "Touch ID not supported on this device.\n\nYou can enable it in the \"Hardware\" menu option (see below). Once enabled, return to this screen again."
			});
			var img = Ti.UI.createImageView({
				image: 'touchid.png',
				top: '100dp'
			});
			container.add(label);
			container.add(img);
		} else {
			var label = Ti.UI.createLabel({
				text: "Touch ID not supported on this device."
			});
			container.add(label);
		}
	}

})($.touchid_container);
