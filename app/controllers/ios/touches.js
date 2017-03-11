(function (container) {

	var UIView = require('UIKit/UIView'),
		UIPanGestureRecognizer = require('UIKit/UIPanGestureRecognizer'),
		CGRectMake = require('CoreGraphics').CGRectMake,
		CGPointZero = require('CoreGraphics').CGPointZero,
		CGPointMake = require('CoreGraphics').CGPointMake,
		UIKit = require('UIKit'),
		UIColor = require('UIKit/UIColor');

	var PanGestureRecognizer = require('/subclasses/gesturerecognizer');
	// create an instance of the class - one for each instance of the view
 	var panGesture1 = new PanGestureRecognizer();
	panGesture1.addTargetAction(panGesture1, 'onAction:');
	panGesture1.onAction = onPanGesture;

	var panGesture2 = new PanGestureRecognizer();
	panGesture2.addTargetAction(panGesture2, 'onAction:');
	panGesture2.onAction = onPanGesture;

	var view1 = UIView.alloc().initWithFrame(CGRectMake(40,40,100,100));
	view1.addGestureRecognizer(panGesture1);
	view1.backgroundColor = UIColor.greenColor;

	var view2 = UIView.alloc().initWithFrame(CGRectMake(40,180,100,100));
	view2.addGestureRecognizer(panGesture2);
	view2.backgroundColor = UIColor.redColor;

	container.add(view1);
	container.add(view2);


	function onPanGesture(recognizer) {
		if (recognizer.state === UIKit.UIGestureRecognizerStateBegan ||
			recognizer.state === UIKit.UIGestureRecognizerStateChanged) {
			var view = recognizer.view,
				superview = view.superview,
				center = view.center;
			var translation = recognizer.translationInView(superview);
			view.center = CGPointMake(center.x + translation.x, center.y + translation.y);
			recognizer.setTranslationInView(CGPointZero, superview);
		}
	}

})($.touch_container);
