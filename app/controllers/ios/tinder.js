(function (container) {

	var UIView = require('UIKit/UIView'),
		CGRectMake = require('CoreGraphics').CGRectMake,
		CGSizeMake = require('CoreGraphics').CGSizeMake,
		CGPointMake = require('CoreGraphics').CGPointMake,
		CGColor = require('CoreGraphics').CGColor,
		CGAffineTransformMakeRotation = require('CoreGraphics').CGAffineTransformMakeRotation,
		CGAffineTransformScale = require('CoreGraphics').CGAffineTransformScale,
		CGAffineTransformIdentity = require('CoreGraphics').CGAffineTransformIdentity,
		UIColor = require('UIKit/UIColor'),
		UIKit = require('UIKit')

	// create a custom implementation of UIPanGestureRecognizer
	var PanGestureRecognizer = require('subclasses/gesturerecognizer');

	// original location of view
	var orgPt;

	// number of cards
	var cardCount = 7;

	// view counter
	var viewIndex;

	// view array for cards
	var viewArray = [];

	// implement a callback which will do the changes as the user moves the view
	function onPanGesture(recognizer) {
		// get view and current x/y distance
		var view = recognizer.view;
		var xDist = recognizer.translationInView(view).x;
		var yDist = recognizer.translationInView(view).y;

		switch (recognizer.state) {

			// record original position
			case UIKit.UIGestureRecognizerStateBegan: {
				origPt = view.center;
				break;
			}

			case UIKit.UIGestureRecognizerStateChanged: {

				// toggle x/check views
				toggleOverlayViews(xDist);

				// perform transform
				var rotationStrength = Math.min(xDist / 320, 1);
				var rotationAngle = (2 * Math.PI * rotationStrength / 16);
				var scaleStrength = 1 - Math.abs(rotationStrength) / 4;
				var scale = Math.max(scaleStrength, 0.93);
				view.center = CGPointMake(origPt.x + xDist, origPt.y + yDist);
				var transform = CGAffineTransformMakeRotation(rotationAngle);
				var scaleTransform = CGAffineTransformScale(transform, scale, scale);
				view.transform = scaleTransform;
				view.alpha = 0.85;

				break;
			}

			// either go back to position or fly right or left
			case UIKit.UIGestureRecognizerStateEnded: {
				// go right
				if (xDist > 100) {
					UIView.animateWithDurationAnimationsCompletion(0.2, function () {
						view.center = CGPointMake(600, 300);
						view.transform = CGAffineTransformMakeRotation(-30);
					});
					viewIndex--;
				// go left
				} else if (xDist < -100) {
					UIView.animateWithDurationAnimationsCompletion(0.2, function () {
						view.center = CGPointMake(-600, 300);
						view.transform = CGAffineTransformMakeRotation(30);
					});
					viewIndex--;
				// back to center
				} else {
					viewArray[viewIndex].checkView.animate({opacity: 0, duration: 200});
					viewArray[viewIndex].xView.animate({opacity: 0, duration: 200});
					UIView.animateWithDurationAnimationsCompletion(0.2, function () {
						view.center = origPt;
						view.transform = CGAffineTransformIdentity;
						view.alpha = 1;
					});
				}
				break;
			}

			default: {
				break;
			}
		}
	}
	/**
	 *	Toggle "x" and "check" views based on position
	 */
	function toggleOverlayViews (dist) {
		viewArray[viewIndex].checkView.opacity = (dist > 10) ? 1 : 0;
		viewArray[viewIndex].xView.opacity = (dist < -10) ? 1 : 0;
	}

	/**
	 *	Add a bunch of views that can be dragged left or right
	 *  These are all Titanium views
	 */
	(function addCards () {

		for (var i = cardCount - 1; i >= 0; i--) {

			// create instance of gesture recognizer
			var panGesture = new PanGestureRecognizer();
			panGesture.addTargetAction(panGesture, 'onAction:');
			panGesture.onAction = onPanGesture;

			// create card view
			var view = Ti.UI.createView({
				height: 250,
				width: 250,
				backgroundColor: '#fff',
				borderRadius: 8,
				borderWidth: 1,
				borderColor: '#ccc',
				backgroundImage: 'images/' + i + '.jpg',
				viewShadowRadius: 8,
				viewShadowOffset: {x: 2, y: 2},
				viewShadowColor: '#ccc'
			});

			// slightly rotate card (alternate right and left)
			var matrix = Ti.UI.create2DMatrix();
			var animation = Titanium.UI.createAnimation();
			matrix = matrix.rotate((i % 2) ? 5 : -5);
			animation.transform = matrix;
			view.animate(animation);

			// add view to window
			// $.card_animation.add(view);
			container.add(view);

			// add "check" icon overlay to view
			var checkView = Ti.UI.createImageView({
				height: 120,
				width: 120,
				image: 'images/yes.png',
				opacity: 0
			});
			view.add(checkView);

			// add "x" icon overlay to view
			var xView = Ti.UI.createImageView({
				height: 120,
				width: 120,
				image: 'images/no.png',
				opacity: 0
			});
			view.add(xView);

			// add to view array so we can toggle their visibility
			viewArray.push({xView:xView, checkView:checkView});

			// cast to UIView so we can add gesture recognizer
			view = UIView.cast(view);

			view.addGestureRecognizer(panGesture);
		}

		viewIndex = cardCount - 1;
	})();

})($.tinder_container);
