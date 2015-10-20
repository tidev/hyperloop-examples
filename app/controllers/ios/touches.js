(function (container) {

	var UIView = require('UIKit/UIView'),
		UIPanGestureRecognizer = require('UIKit/UIPanGestureRecognizer'),
		UITapGestureRecognizer = require('UIKit/UITapGestureRecognizer'),
		CGRectMake = require('CoreGraphics').CGRectMake,
		CGPointZero = require('CoreGraphics').CGPointZero,
		CGPointMake = require('CoreGraphics').CGPointMake,
		UIKit = require('UIKit'),
		UIColor = require('UIKit/UIColor');

	var NativePanGestureRecognizer = Hyperloop.defineClass('NativePanGestureRecognizer', 'UIPanGestureRecognizer');

	NativePanGestureRecognizer.addMethod({
		signature: 'onAction:',
		arguments: '@',
		callback: function(recognizer) {
			// since the doc describes this as an ID, we need to cast it to the appropriate type
			recognizer = NativePanGestureRecognizer.cast(recognizer);
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
	});

 	var panGesture1 = new NativePanGestureRecognizer();
	panGesture1.addTargetAction(panGesture1, 'onAction:');

	var panGesture2 = new NativePanGestureRecognizer();
	panGesture2.addTargetAction(panGesture2, 'onAction:');

	var view1 = UIView.alloc().initWithFrame(CGRectMake(40,40,100,100));
	view1.addGestureRecognizer(panGesture1);
	view1.backgroundColor = UIColor.greenColor();

	var view2 = UIView.alloc().initWithFrame(CGRectMake(40,180,100,100));
	view2.addGestureRecognizer(panGesture2);
	view2.backgroundColor = UIColor.redColor();

	container.add(view1);
	container.add(view2);

})($.touch_container);
