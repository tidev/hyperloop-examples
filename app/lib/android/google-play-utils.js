import Settings from 'android.provider.Settings';
import Activity from 'android.app.Activity';

/**
 * Checks whether the app is installed via Google Play or manually via download.
 * This works on Android 4.2 and later.
 * @return {Boolean} A flag indicating whether the app is installed via Google Play.
 */
const isInstalledViaGooglePlay = function() {
	const activity = new Activity(Ti.Android.currentActivity);
	return Settings.Secure.getInt(activity.getContentResolver(), Settings.Secure.INSTALL_NON_MARKET_APPS, 0) === false;
};

export { isInstalledViaGooglePlay }
