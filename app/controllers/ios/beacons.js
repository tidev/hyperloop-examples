import { CLBeaconRegion, CLLocationManager, CoreLocation } from 'CoreLocation';
import { UIApplication, UILocalNotification } from 'UIKit';
import { NSUUID } from 'Foundation';

const CLProximityFar = CoreLocation.CLProximityFar;
const CLProximityNear = CoreLocation.CLProximityNear;
const CLProximityImmediate = CoreLocation.CLProximityImmediate;
const CLProximityUnknown = CoreLocation.CLProximityUnknown;

let locationManager;
let UUID;
let IDENTIFIER;

(function constructor(args) {
	
	UUID = "B9407F30-F5F8-466E-AFF9-25556B57FE6D"; // Change to the UUID of your beacon
	IDENTIFIER = "com.appcelerator.beacons";
	
	const LocationManagerDelegate = require("subclasses/locationmanagerdelegate");
	const delegate = new LocationManagerDelegate();
	
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
		let message = "";

	    if(beacons.count > 0) {
	        let nearestBeacon = beacons.firstObject;
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
	const uuid = NSUUID.alloc().initWithUUIDString(UUID);
	const region = CLBeaconRegion.alloc().initWithProximityUUIDMajorMinorIdentifier(uuid, 1, 1, IDENTIFIER);
	
	locationManager.startMonitoringForRegion(region);
}

function presentNotification(title) {
	const notification = new UILocalNotification();
	notification.alertBody = title;
	notification.soundName = "Default";
	
	UIApplication.sharedApplication.presentLocalNotificationNow(notification);	
}
