var CLBeaconRegion = require("CoreLocation/CLBeaconRegion"),
	NSUUID = require("Foundation/NSUUID"),
	CLLocationManager = require("CoreLocation/CLLocationManager"),
	CLProximityFar = require("CoreLocation").CLProximityFar,
	CLProximityNear = require("CoreLocation").CLProximityNear,
	CLProximityImmediate = require("CoreLocation").CLProximityImmediate,
	CLProximityUnknown = require("CoreLocation").CLProximityUnknown,
	UILocalNotification = require("UIKit/UILocalNotification"),
	UIApplication = require("UIKit/UIApplication"),
	locationManager,
	UUID,
	IDENTIFIER;

(function constructor(args) {
	
	UUID = "B9407F30-F5F8-466E-AFF9-25556B57FE6D"; // Change to the UUID of your beacon
	IDENTIFIER = "com.appcelerator.beacons";
	
	var LocationManagerDelegate = require("subclasses/locationmanagerdelegate");
	var delegate = new LocationManagerDelegate();
	
	delegate.didEnterRegion = function(manager, region) {
		locationManager.startRangingBeaconsInRegion(region);
		locationManager.startUpdatingLocation();

		presentNotification("You just entered the current region!");
	};
	
	delegate.didExitRegion = function(manager, region) {
		locationManager.stopRangingBeaconsInRegion(region);
		locationManager.stopUpdatingLocation();

		presentNotification("You just exited the current region!");
	};
	
	delegate.didRangeBeacons = function(manager, beacons, region) {
		var message = "";

	    if(beacons.count > 0) {
	        var nearestBeacon = beacons.firstObject;
	        switch(nearestBeacon.proximity) {
	            case CLProximityFar:
	                message = "You are far away from the beacon";
	                break;
	            case CLProximityNear:
	                message = "You are near the beacon";
	                break;
	            case CLProximityImmediate:
	                message = "You are in the immediate proximity of the beacon";
	                break;
	            case CLProximityUnknown:
					message = "You are at an unknown location";
					break;
	        }
	    } else {
	        message = "No beacons are nearby";
	    }
		
	    presentNotification(message);
	};
	
	locationManager = new CLLocationManager();
	locationManager.setDelegate(delegate);
	locationManager.requestAlwaysAuthorization();
})(arguments[0] || {});

function startDiscovery() {
	var uuid = NSUUID.alloc().initWithUUIDString(UUID);
	var region = CLBeaconRegion.alloc().initWithProximityUUIDMajorMinorIdentifier(uuid, 1, 1, IDENTIFIER);
	
	locationManager.startMonitoringForRegion(region);
}

function presentNotification(title) {
	var notification = new UILocalNotification();
	notification.alertBody = title;
	notification.soundName = "Default";
	
	UIApplication.sharedApplication.presentLocalNotificationNow(notification);	
}
