/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor() {
	$.navWin.open();

	OS_IOS && registerApplicationDelegates();
})(arguments[0] || {});

function registerApplicationDelegates() {
	const TiApp = require('Titanium/TiApp');
	const TiApplicationDelegate = require('subclasses/applicationdelegate');
	
	// Instantiate the delegate subclass
	var applicationDelegate = new TiApplicationDelegate();

	// Called when the application finished launching. Initialize SDK's here for example
	applicationDelegate.didFinishLaunchingWithOptions = function (application, options) {
		Ti.API.warn('didFinishLaunchingWithOptions: called!');
		return true;
	};

	// -- Add more delegate in app/lib/ios/subclasses/applicationdelegate.js -- //

	// Register the delegate and you're done!
	TiApp.app().registerApplicationDelegate(applicationDelegate);
}

function onListViewItemclick(e) {
	// We've set the items special itemId-property to the controller name
	var controllerName = e.itemId;

	// Which we use to create the controller, get the window and open it in the navigation window
	// See lib/xp.ui.js to see how we emulate this component for Android
	$.navWin.openWindow(Alloy.createController(controllerName, {nav: $.navWin}).getView());
}

function onOpen() {
	if (OS_ANDROID) {
		// For Android, try out the settings- and content-resolver API to check if the app
		// is installed via Google Play 
		var GooglePlayUtils = require('google-play-utils');
		Ti.API.info('Installed via Google Play: ' + GooglePlayUtils.isInstalledViaGooglePlay());
	} else if (OS_IOS && isiOS10_3()) {
		// For iOS, request a review-dialog
		requestReviewDialog();
	}
}

function requestReviewDialog() {
	var Review = require('ti.reviewdialog');

	// This will request a rating dialog in iOS 10.3+
	// Check-out the repository: https://github.com/hansemannn/titanium-review-dialog
	if (Review.isSupported() && !Ti.App.Properties.getBool('reviewDialogRequested', false)) {
		Ti.App.Properties.setBool('reviewDialogRequested', true);
		Review.requestReview();
	}
}

function isiOS10_3() {
	var version = Ti.Platform.version.split(".");	
	return (parseInt(version[0]) >= 10 && parseInt(version[1]) >= 3);
}
