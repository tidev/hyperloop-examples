// wait for the window to finish before starting the ball drop
setTimeout(function () {
	(function (container) {

		var UIDynamicAnimator = require('UIKit/UIDynamicAnimator'),
			UIDynamicItemBehavior = require('UIKit/UIDynamicItemBehavior'),
			UIGravityBehavior = require('UIKit/UIGravityBehavior'),
			UICollisionBehavior = require('UIKit/UICollisionBehavior'),
			UIColor = require('UIKit/UIColor'),
			CGRectMake = require('CoreGraphics').CGRectMake,
			CGPointMake = require('CoreGraphics').CGPointMake,
			NSBundle = require('Foundation/NSBundle'),
			NSURL = require('Foundation/NSURL'),
			AVAudioPlayer = require('AVFoundation/AVAudioPlayer');

		// create class to detect collisions
		var CollisionBehaviorDelegate = require('subclasses/collisionbehaviordelegate');

		var soundPath = NSBundle.mainBundle().pathForResourceOfType('sounds/hit', 'mp3');
		var soundURL = NSURL.fileURLWithPath(soundPath);
		var sound = AVAudioPlayer.alloc().initWithContentsOfURLError(soundURL);
		sound.prepareToPlay();

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
		var dynamicAnimator = UIDynamicAnimator.alloc().initWithReferenceView(container);
		// protect from GC, remember to unprotect in the window's close event
		dynamicAnimator.protect();

		// add gravity behavior to ball
		var gravityBehavior = UIGravityBehavior.alloc().initWithItems([view]);

		// add elasticity (bounce) behavior to ball
		var dynamicItemBehavior = UIDynamicItemBehavior.alloc().initWithItems([view]);
		dynamicItemBehavior.elasticity = 0.7;

		// add frame as collision boundary
		var collisionBehavior = UICollisionBehavior.alloc().initWithItems([view]);
		collisionBehavior.translatesReferenceBoundsIntoBoundary = true;


		var delegate = new CollisionBehaviorDelegate();
		delegate.beganContact = function (behavior, dest, identifier, point) {
			Ti.API.debug('+collision begin ' + point.x + ' ' + point.y + ' ' + String(identifier));
			if (sound.isPlaying()) {
				sound.stop();
				sound.currentTime = 0;
			}
			sound.play();
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
		};
		delegate.endedContact = function (behavior, item, identifier) {
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
		};
		collisionBehavior.collisionDelegate = delegate;

		// add collision boundaries in locations where we have views (views don't move, but ball reacts)
		collisionBehavior.addBoundaryWithIdentifierFromPointToPoint('barrier1', CGPointMake(0, 200), CGPointMake(200, 200));
		collisionBehavior.addBoundaryWithIdentifierFromPointToPoint('barrier2', CGPointMake((Ti.Platform.displayCaps.platformWidth - 100), 300), CGPointMake(Ti.Platform.displayCaps.platformWidth, 300));
		collisionBehavior.addBoundaryWithIdentifierFromPointToPoint('barrier3', CGPointMake(0, 400), CGPointMake(250, 400));

		dynamicAnimator.addBehavior(collisionBehavior);
		dynamicAnimator.addBehavior(gravityBehavior);
		dynamicAnimator.addBehavior(dynamicItemBehavior);

		$.win.addEventListener('close', function(){
			dynamicAnimator.unprotect();
			dynamicAnimator = null;
		});
	})($.gravity_container);
}, 100);