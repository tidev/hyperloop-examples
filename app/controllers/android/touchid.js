import FingerprintManager from 'android.hardware.fingerprint.FingerprintManager';
import AuthenticationCallback from 'android.hardware.fingerprint.FingerprintManager.AuthenticationCallback';
import CancellationSignal from 'android.os.CancellationSignal';
import CryptoObject from 'android.hardware.fingerprint.FingerprintManager.CryptoObject';
import KeyStore from 'java.security.KeyStore';
import KeyGenerator from 'javax.crypto.KeyGenerator';
import Builder from 'android.security.keystore.KeyGenParameterSpec.Builder';
import KeyProperties from 'android.security.keystore.KeyProperties';
import Cipher from 'javax.crypto.Cipher';
import Activity from 'android.app.Activity';

(function (container) {
	// Specify your Keystore name (private)
	const KEY_NAME = 'my_key';

	// This is exposing an emulator bug for me: https://github.com/googlesamples/android-FingerprintDialog/issues/18
	const activity = new Activity(Titanium.App.Android.getTopActivity());
	const fingerprintManager = activity.getSystemService(FingerprintManager.class);

	// https://github.com/googlesamples/android-FingerprintDialog/blob/master/Application/src/main/java/com/example/android/fingerprintdialog/MainActivity.java

	// check to see if it's enabled
	if (fingerprintManager.isHardwareDetected()) {
		$.message.setText('Fingerprints supported');

		if (!fingerprintManager.hasEnrolledFingerprints()) {
			$.message.setText('Go to "Settings -> Security -> Fingerprint" and register at least one fingerprint');
		} else {
			$.button.addEventListener('click', () => {
				// Grab the FingerprintManager, keystore, keyGenerator from system
				const keyStore = KeyStore.getInstance('AndroidKeyStore');
				const keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, 'AndroidKeyStore');

				// Create a key
				keyStore.load(null);
				// Set the alias of the entry in Android KeyStore where the key will appear
				// and the constrains (purposes) in the constructor of the Builder
				keyGenerator.init(new Builder(KEY_NAME,
					KeyProperties.PURPOSE_ENCRYPT |
						KeyProperties.PURPOSE_DECRYPT)
						.setBlockModes(KeyProperties.BLOCK_MODE_CBC)
						// Require the user to authenticate with a fingerprint to authorize every use
						// of the key
						.setUserAuthenticationRequired(true)
						.setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_PKCS7)
						.build());
				keyGenerator.generateKey();

				// init cipher
				keyStore.load(null);
				const cipher = Cipher.getInstance(KeyProperties.KEY_ALGORITHM_AES + '/'
					+ KeyProperties.BLOCK_MODE_CBC + '/'
					+ KeyProperties.ENCRYPTION_PADDING_PKCS7);
				cipher.init(Cipher.ENCRYPT_MODE, keyStore.getKey(KEY_NAME, null));

				// try to do the auth
				const cryptoObject = new CryptoObject(cipher);
				const Subclass = AuthenticationCallback.extend({
					onAuthenticationError: (code, msg) => {
						console.log('onAuthenticationError');
					},
					onAuthenticationHelp: (code, help) => {
						console.log('onAuthenticationHelp');
					},
					onAuthenticationSucceeded: (result) => {
						console.log('onAuthenticationSucceeded');
					},
					onAuthenticationFailed: () => {
						console.log('onAuthenticationFailed');
					},
					onAuthenticationAcquired: (code) => {
						console.log('onAuthenticationAcquired');
					}
				});
				const authCallback = new Subclass();

				fingerprintManager.authenticate(cryptoObject, new CancellationSignal(), 0 /* flags */, authCallback, null);
			});
		}
	} else {
		if (ENV_DEV) {
			$.message.setText('Fingerprints not supported on this device.\n\nYou must enable the permission in your AndroidManifest.xml');
			$.image.opacity = 1;
		} else {
			$.message.setText('Fingerprints not supported on this device');
		}
	}

})();
