import { UIView, UIColor } from 'UIKit';
import { CoreGraphics } from 'CoreGraphics';

const CGRectMake = CoreGraphics.CGRectMake;
const CGAffineTransformRotate = CoreGraphics.CGAffineTransformRotate;
const CGAffineTransformScale = CoreGraphics.CGAffineTransformScale;
const CGAffineTransformIdentity = CoreGraphics.CGAffineTransformIdentity;

(function (container) {
	// create a view box we're going to animate when you click the button
	const view = UIView.alloc().initWithFrame(CGRectMake(10, 10, 50, 50));
	view.backgroundColor = UIColor.redColor;
	container.add(view);

	let flag = false;

	$.button.addEventListener('click', () => {
		flag = !flag;
		$.notice.text = '';
		// animate the UIView
		UIView.animateWithDurationAnimationsCompletion(1.0, () => {
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
		}, (_done) => {
			// this function is called after the animation completes
			$.notice.text = 'Animation completed!';
			setTimeout(() => {
				$.notice.text = '';
			}, 2000);
		});
	});

})($.animateview_container);
