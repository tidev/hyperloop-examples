// wait for the window to finish before starting the ball drop
setTimeout(function () {
	(function (container) {

		var UIDynamicAnimator = require('UIKit/UIDynamicAnimator'),
			UIDynamicItemBehavior = require('UIKit/UIDynamicItemBehavior'),
			UIGravityBehavior = require('UIKit/UIGravityBehavior'),
			UICollisionBehavior = require('UIKit/UICollisionBehavior'),
			UIColor = require('UIKit/UIColor'),
			CGRectMake = require('CoreGraphics').CGRectMake,
			CGPointMake = require('CoreGraphics').CGPointMake;

		// create Titanium view (ball)
		var view = Ti.UI.createView({
			height: 50,
			width: 50,
			borderRadius: 25,
			top: 10,
			backgroundColor: 'orange'
		});
		container.add(view);

		// create Titanium, view (barrier 1)
		var barrier1 = Ti.UI.createView({
			height: 20,
			width: 200,
			left: 0,
			top: 200,
			backgroundColor: '#ccc'
		});
		container.add(barrier1);

		// create Titanium, view (barrier 2)
		var barrier2 = Ti.UI.createView({
			height: 20,
			width: 100,
			right: 0,
			top: 300,
			backgroundColor: '#ccc'
		});
		container.add(barrier2);

		// create Titanium, view (barrier 3)
		var barrier3 = Ti.UI.createView({
			height: 20,
			width: 250,
			left: 0,
			top: 400,
			backgroundColor: '#ccc'
		});
		container.add(barrier3);

		// create Dynamic Animator for our main window
		var a = UIDynamicAnimator.alloc().initWithReferenceView(container);

		// add gravity behavior to ball
		var g = UIGravityBehavior.alloc().initWithItems([view]);
		a.addBehavior(g);

		// add elasticity (bounce) behavior to ball
		var e = UIDynamicItemBehavior.alloc().initWithItems([view]);
		e.elasticity = 0.7;
		a.addBehavior(e);

		// add frame as collision boundary
		var c = UICollisionBehavior.alloc().initWithItems([view]);
		c.translatesReferenceBoundsIntoBoundary = true;

		// create class to detect collisions
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
			callback: function (behavior, dest, identifier, point) {
				Ti.API.debug('+collision begin ' + point.x + ' ' + point.y);
				// coerse the NSString into a JS String
				switch (String(identifier)) {
					case 'barrier1': {
						barrier1.backgroundColor = '#f00';
						break;
					}
					case 'barrier2': {
						barrier2.backgroundColor = '#0f0';
						break;
					}
					case 'barrier3': {
						barrier3.backgroundColor = '#00f';
						break;
					}
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
			callback: function (behavior, item, identifier) {
				switch (String(identifier)) {
					case 'barrier1': {
						barrier1.backgroundColor = '#ccc';
						break;
					}
					case 'barrier2': {
						barrier2.backgroundColor = '#ccc';
						break;
					}
					case 'barrier3': {
						barrier3.backgroundColor = '#ccc';
						break;
					}
				}
			}
		});

		var delegate = new CollisionBehaviorDelegate();
		c.collisionDelegate = delegate;

		// add collision boundaries in locations where we have views (views don't move, but ball reacts)
		c.addBoundaryWithIdentifierFromPointToPoint('barrier1', CGPointMake(0, 200), CGPointMake(200, 200));
		c.addBoundaryWithIdentifierFromPointToPoint('barrier2', CGPointMake((Ti.Platform.displayCaps.platformWidth - 100), 300), CGPointMake(Ti.Platform.displayCaps.platformWidth, 300));
		c.addBoundaryWithIdentifierFromPointToPoint('barrier3', CGPointMake(0, 400), CGPointMake(250, 400));

		a.addBehavior(c);

	})($.gravity_container);
}, 100);
