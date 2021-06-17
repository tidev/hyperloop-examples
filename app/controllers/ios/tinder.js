import { UIView, UIKit } from 'UIKit';
import { CoreGraphics } from 'CoreGraphics';
import { PanGestureRecognizer } from '/subclasses/gesturerecognizer';

const CGPointMake = CoreGraphics.CGPointMake;
const CGAffineTransformMakeRotation = CoreGraphics.CGAffineTransformMakeRotation;
const CGAffineTransformScale = CoreGraphics.CGAffineTransformScale;
const CGAffineTransformIdentity = CoreGraphics.CGAffineTransformIdentity;

// number of cards
const CARD_COUNT = 7;

// view counter
let viewIndex;

// view array for cards
let viewArray = new Array();

// original location of view
let origPt;

(function (container) {
	addCards(container);
})($.tinder_container);

function hideViews() {
	const container = $.tinder_container;

	container.animate({ opacity: 0.0 }, () => {
		container.removeAllChildren();
	});
}

// implement a callback which will do the changes as the user moves the view
function onPanGesture (recognizer) {
	// get view and current x/y distance
	const view = recognizer.view;
	const xDist = recognizer.translationInView(view).x;
	const yDist = recognizer.translationInView(view).y;

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
			const rotationStrength = Math.min(xDist / 320, 1);
			const rotationAngle = (2 * Math.PI * rotationStrength / 16);
			const scaleStrength = 1 - Math.abs(rotationStrength) / 4;
			const scale = Math.max(scaleStrength, 0.93);
			view.center = CGPointMake(origPt.x + xDist, origPt.y + yDist);
			const transform = CGAffineTransformMakeRotation(rotationAngle);
			const scaleTransform = CGAffineTransformScale(transform, scale, scale);
			view.transform = scaleTransform;
			view.alpha = 0.85;

			break;
		}

		// either go back to position or fly right or left
		case UIKit.UIGestureRecognizerStateEnded: {
			// go right
			if (xDist > 100) {
				UIView.animateWithDurationAnimationsCompletion(0.2, () => {
					view.center = CGPointMake(600, 300);
					view.transform = CGAffineTransformMakeRotation(-30);
				});
				viewIndex--;
			// go left
			} else if (xDist < -100) {
				UIView.animateWithDurationAnimationsCompletion(0.2, () => {
					view.center = CGPointMake(-600, 300);
					view.transform = CGAffineTransformMakeRotation(30);
				});
				viewIndex--;
			// back to center
			} else {
				viewArray[viewIndex].checkView.animate({opacity: 0, duration: 200});
				viewArray[viewIndex].xView.animate({opacity: 0, duration: 200});
				UIView.animateWithDurationAnimationsCompletion(0.2, () => {
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
 *	Toggle 'x' and 'check' views based on position
 */
function toggleOverlayViews (dist) {
	viewArray[viewIndex].checkView.opacity = (dist > 10) ? 1 : 0;
	viewArray[viewIndex].xView.opacity = (dist < -10) ? 1 : 0;
}

function addCards (container) {
	for (let i = CARD_COUNT - 1; i >= 0; i--) {
		// create instance of gesture recognizer
		const panGesture = new PanGestureRecognizer();
		panGesture.addTargetAction(panGesture, 'onAction:');
		panGesture.onAction = onPanGesture;

		// create card view
		let view = Ti.UI.createView({
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
		const matrix = Ti.UI.create2DMatrix().rotate((i % 2) ? 5 : -5);
		const animation = Titanium.UI.createAnimation();
		animation.transform = matrix;
		view.animate(animation);

		// add view to window
		container.add(view);

		// add 'check' icon overlay to view
		const checkView = Ti.UI.createImageView({
			height: 120,
			width: 120,
			image: 'images/yes.png',
			opacity: 0
		});
		view.add(checkView);

		// add 'x' icon overlay to view
		const xView = Ti.UI.createImageView({
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

	viewIndex = CARD_COUNT - 1;
}
