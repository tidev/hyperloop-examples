import { UIView, UIColor, UIKit, UIPanGestureRecognizer } from 'UIKit';
import { CoreGraphics } from 'CoreGraphics';
import { PanGestureRecognizer } from '/subclasses/gesturerecognizer';

const CGRectMake = CoreGraphics.CGRectMake;
const CGPointMake = CoreGraphics.CGPointMake;
const CGPointZero = CoreGraphics.CGPointZero;
	
(function (container) {
	// create an instance of the class - one for each instance of the view
 	const panGesture1 = new PanGestureRecognizer();
	panGesture1.addTargetAction(panGesture1, 'onAction:');
	panGesture1.onAction = onPanGesture;

	const panGesture2 = new PanGestureRecognizer();
	panGesture2.addTargetAction(panGesture2, 'onAction:');
	panGesture2.onAction = onPanGesture;

	const view1 = UIView.alloc().initWithFrame(CGRectMake(40,40,100,100));
	view1.addGestureRecognizer(panGesture1);
	view1.backgroundColor = UIColor.greenColor;

	const view2 = UIView.alloc().initWithFrame(CGRectMake(40,180,100,100));
	view2.addGestureRecognizer(panGesture2);
	view2.backgroundColor = UIColor.redColor;

	container.add(view1);
	container.add(view2);
})($.touch_container);

function onPanGesture(recognizer) {
	if (recognizer.state === UIKit.UIGestureRecognizerStateBegan || recognizer.state === UIKit.UIGestureRecognizerStateChanged) {
		const view = recognizer.view;
		const superview = view.superview;
		const center = view.center;
		const translation = recognizer.translationInView(superview);

		view.center = CGPointMake(center.x + translation.x, center.y + translation.y);
		recognizer.setTranslationInView(CGPointZero, superview);
	}
}
