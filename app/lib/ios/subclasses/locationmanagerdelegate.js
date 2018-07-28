
const LocationManagerDelegate = Hyperloop.defineClass('LocationManagerDelegate', 'NSObject', ['CLLocationManagerDelegate']);

LocationManagerDelegate.addMethod({
	selector: 'locationManager:didEnterRegion:',
	arguments: ['CLLocationManager', 'CLRegion'],
	callback: function (manager, region) {
		if (this.didEnterRegion) {
			this.didEnterRegion(manager, region);
		}
	}
});

LocationManagerDelegate.addMethod({
	selector: 'locationManager:didExitRegion:',
	arguments: ['CLLocationManager', 'CLRegion'],
	callback: function (manager, region) {
		if (this.didExitRegion) {
			this.didExitRegion(manager, region);
		}
	}
});

LocationManagerDelegate.addMethod({
	selector: 'locationManager:didRangeBeacons:inRegion:',
	arguments: ['CLLocationManager', 'NSArray', 'CLBeaconRegion'],
	callback: function (manager, beacons, region) {
		if (this.didRangeBeacons) {
			this.didRangeBeacons(manager, beacons, region);
		}
	}
});

export { LocationManagerDelegate }
