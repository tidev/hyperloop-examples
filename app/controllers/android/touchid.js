(function (container) {
	var FingerprintManager = require('android.hardware.fingerprint.FingerprintManager'),
		AuthenticationCallback = require('android.hardware.fingerprint.FingerprintManager.AuthenticationCallback'),
		CancellationSignal = require('android.os.CancellationSignal'),
		CryptoObject = require('android.hardware.fingerprint.FingerprintManager.CryptoObject'),
		KeyStore = require('java.security.KeyStore'),
		KeyGenerator = require('javax.crypto.KeyGenerator'),
		Builder = require('android.security.keystore.KeyGenParameterSpec.Builder'),
		KeyProperties = require('android.security.keystore.KeyProperties'),
		Cipher = require('javax.crypto.Cipher'),
		Activity = require('android.app.Activity'),
		KEY_NAME = "my_key",
		fingerprintManager,
		activity;

	// This is exposing an emulator bug for me: https://github.com/googlesamples/android-FingerprintDialog/issues/18
	activity = new Activity(Titanium.App.Android.getTopActivity());
	fingerprintManager = activity.getSystemService(FingerprintManager.class);

	// https://github.com/googlesamples/android-FingerprintDialog/blob/master/Application/src/main/java/com/example/android/fingerprintdialog/MainActivity.java

	// check to see if it's enabled
	if (fingerprintManager.isHardwareDetected()) {
		$.message.setText('Fingerprints supported');

		if (!fingerprintManager.hasEnrolledFingerprints()) {
            $.message.setText("Go to 'Settings -> Security -> Fingerprint' and register at least one fingerprint");
		} else {
			$.button.addEventListener('click', function () {
				var cryptoObject,
					cipher,
					keyStore,
					keyGenerator,
					authCallback;
		
				// Grab the FingerprintManager, keystore, keyGenerator from system
				keyStore = KeyStore.getInstance("AndroidKeyStore");
				keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
	
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
				cipher = Cipher.getInstance(KeyProperties.KEY_ALGORITHM_AES + "/"
                    + KeyProperties.BLOCK_MODE_CBC + "/"
                    + KeyProperties.ENCRYPTION_PADDING_PKCS7);
	            cipher.init(Cipher.ENCRYPT_MODE, keyStore.getKey(KEY_NAME, null));
	
	            // try to do the auth
				cryptoObject = new CryptoObject(cipher);
				authCallback = AuthenticationCallback.extend({
					onAuthenticationError: function(code, msg) {
						console.log('onAuthenticationError');
					},
					onAuthenticationHelp: function (code, help) {
						console.log('onAuthenticationHelp');
					},
					onAuthenticationSucceeded: function (result) {
						console.log('onAuthenticationSucceeded');
					},
					onAuthenticationFailed: function () {
						console.log('onAuthenticationFailed');
					},
					onAuthenticationAcquired: function (code) {
						console.log('onAuthenticationAcquired');
					}
				});
	
	            fingerprintManager
	                .authenticate(cryptoObject, new CancellationSignal(), 0 /* flags */, authCallback, null);
			});
		}
	} else {
		if (ENV_DEV) {
			$.message.setText("Fingerprints not supported on this device.\n\nYou must enable the permission in your AndroidManifest.xml");
			$.image.opacity = 1;
		} else {
			$.message.setText('Fingerprints not supported on this device');
		}
	}

})();
