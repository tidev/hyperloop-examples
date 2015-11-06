(function (container) {
	var FingerprintManager = require('android.hardware.fingerprint.FingerprintManager'),
		AuthenticationCallback = require('android.hardware.fingerprint.FingerprintManager.AuthenticationCallback'),
		CancellationSignal = require('android.hardware.fingerprint.FingerprintManager.CancellationSignal'),
		CryptoObject = require('android.hardware.fingerprint.FingerprintManager.CryptoObject'),
		KeyStore = require('java.security.KeyStore'),
		KeyGenerator = require('javax.crypto.KeyGenerator');
		Builder = require('android.security.keystore.KeyGenParameterSpec.Builder'),
		KeyProperties = require('android.security.keystore.KeyProperties'),
		Cipher = require('javax.crypto.Cipher'),
		Activity = require('android.app.Activity'),
		KEY_NAME = "my_key",
		cryptoObject,
		cipher,
		fingerprintManager,
		keyStore,
		keyGenerator,
		activity,
		authCallback;
		
	// https://github.com/googlesamples/android-FingerprintDialog/blob/master/Application/src/main/java/com/example/android/fingerprintdialog/MainActivity.java

	// check to see if it's enabled
	if (fingerprintManager.isHardwareDetected()) {
		$.message.setText('Touch ID supported');
		
		if (!fingerprintManager.hasEnrolledFingerprints()) {
            $.message.setText("Go to 'Settings -> Security -> Fingerprint' and register at least one fingerprint");
		} else {
			// Grab the FingerprintManager, keystore, keyGenerator from system
			activity = new Activity(Titanium.App.Android.getTopActivity());
			fingerprintManager = activity.getSystemService(FingerprintManager.class);
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
            cipher.init(Cipher.ENCRYPT_MODE, keyStore.getKey(KEY_NAME, null));
            
            // try to do the auth
			cryptoObject = new CryptoObject(cipher);
			// FIXME We need to support extending Java classes to generate a subclass/impl of AuthenticationCallback!
			authCallback = new AuthenticationCallback({
				
			});
            
            fingerprintManager
                .authenticate(cryptoObject, new CancellationSignal(), 0 /* flags */, authCallback, null);
		}
	} else {
		if (ENV_DEV) {
			$.message.setText("Touch ID not supported on this device.\n\nYou can enable it in the \"Hardware\" menu option (see below). Once enabled, return to this screen again.");
			$.image.opacity = 1;
		} else {
			$.message.setText('Touch ID not supported on this device');
		}
	}

})();
