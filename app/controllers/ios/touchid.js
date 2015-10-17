
(function (container) {
	var LAContext = require('LocalAuthentication/LAContext');
	var LocalAuthentication = require('LocalAuthentication/LocalAuthentication');
	var context = new LAContext();

	// check to see if it's enabled
	if (context.canEvaluatePolicyError(LocalAuthentication.LAPolicyDeviceOwnerAuthenticationWithBiometrics)) {
		$.message.setText('Touch ID supported');
		context.evaluatePolicyLocalizedReasonReply(LocalAuthentication.LAPolicyDeviceOwnerAuthenticationWithBiometrics, 'Please give us your Fingerprint to demonstrate the API', function (success) {
			if (success) {
				alert('Cool!');
			}
		});
	} else {
		if (ENV_DEV) {
			$.message.setText("Touch ID not supported on this device.\n\nYou can enable it in the \"Hardware\" menu option (see below). Once enabled, return to this screen again.");
			$.image.opacity = 1;
		} else {
			$.message.setText('Touch ID not supported on this device');
		}
	}

})();
