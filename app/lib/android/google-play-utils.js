var Settings = require('android.provider.Settings');
var Activity = require('android.app.Activity');
var activity = new Activity(Ti.Android.currentActivity);

/**
 * Checks whether the app is installed via Google Play or manually via download.
 * This works on Android 4.2 and later.
 * @return {Boolean} A flag indicating whether the app is installed via Google Play.
 */
exports.isInstalledViaGooglePlay = function() {
	return Settings.Secure.getInt(activity.getContentResolver(), Settings.Secure.INSTALL_NON_MARKET_APPS, 0) === false;
};
