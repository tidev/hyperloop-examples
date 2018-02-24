var CollisionBehaviorDelegate = Hyperloop.defineClass('CollisionBehaviorDelegate', 'NSObject', 'UICollisionBehaviorDelegate');

CollisionBehaviorDelegate.addMethod({
	selector: 'collisionBehavior:beganContactForItem:withBoundaryIdentifier:atPoint:',
	instance: true,
	arguments: [
		'UICollisionBehavior',
		'UIView',
		'NSString',
		'CGPoint'
	],
	callback: (behavior, dest, identifier, point) => {
		if (this.beganContact) {
			this.beganContact(behavior, dest, identifier, point);
		}
	}
});

CollisionBehaviorDelegate.addMethod({
	selector: 'collisionBehavior:endedContactForItem:withBoundaryIdentifier:',
	instance: true,
	arguments: [
		'UICollisionBehavior',
		'UIView',
		'NSString'
	],
	callback: (behavior, item, identifier) => {
		if (this.endedContact) {
			this.endedContact(behavior, item, identifier);
		}
	}
});
module.exports = CollisionBehaviorDelegate;
