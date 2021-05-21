import { LAContext, LocalAuthentication } from 'LocalAuthentication';

(function () {
	const authContext = new LAContext();

	// check to see if it's enabled
	if (authContext.canEvaluatePolicyError(LocalAuthentication.LAPolicyDeviceOwnerAuthenticationWithBiometrics)) {
		$.message.text = 'Touch ID supported';
		authContext.evaluatePolicyLocalizedReasonReply(LocalAuthentication.LAPolicyDeviceOwnerAuthenticationWithBiometrics, 'Please give us your Fingerprint to demonstrate the API', (success) => {
			if (success) {
				alert('Success!');
			}
		});
	} else {
		if (ENV_DEV) {
			$.message.text = 'Touch ID not supported on this device.\n\nYou can enable it in the \'Hardware\' menu option (see below). Once enabled, return to this screen again.';
			$.image.opacity = 1;
		} else {
			$.message.text = 'Touch ID not supported on this device';
		}
	}

})();
