(function (container) {
	var UIView = require('UIKit/UIView'),
		UIColor = require('UIKit/UIColor'),
		CGRectMake = require('CoreGraphics').CGRectMake,
		CGAffineTransformRotate = require('CoreGraphics').CGAffineTransformRotate,
		CGAffineTransformScale = require('CoreGraphics').CGAffineTransformScale,
		CGAffineTransformIdentity = require('CoreGraphics').CGAffineTransformIdentity;

	// create a view box we're going to animate when you click the button
	var view = UIView.alloc().initWithFrame(CGRectMake(10, 10, 50, 50));
	view.backgroundColor = UIColor.redColor;
	container.add(view);

	var flag;

	$.button.addEventListener('click', function () {
		flag = !flag;
		$.notice.setText('');
		// animate the UIView
		UIView.animateWithDurationAnimationsCompletion(1.0, function () {
			// this function will be called to handle the animation
			// any changes done in this function will be animated
			if (flag) {
				view.frame = CGRectMake(100, 100, 200, 200);
				view.layer.opacity = 0.8;
				view.layer.cornerRadius = view.frame.size.width / 2;
				view.transform = CGAffineTransformScale(CGAffineTransformRotate(view.transform, Math.PI), 1.5, 1.5);
				view.backgroundColor = UIColor.blueColor;
			} else {
				view.frame = CGRectMake(10, 10, 50, 50);
				view.layer.opacity = 1;
				view.layer.cornerRadius = 0;
				view.transform = CGAffineTransformIdentity;
				view.backgroundColor = UIColor.redColor;
			}
		}, function (_done) {
			// this function is called after the animation completes
			$.notice.setText('Animation completed!');
			setTimeout(function () {
				$.notice.setText('');
			}, 2000);
		});
	});

})($.animateview_container);
