(function (container) {
	var UIView = require('UIKit/UIView'),
		UIColor = require('UIKit/UIColor'),
		CGRectMake = require('CoreGraphics').CGRectMake;

	var view = UIView.alloc().initWithFrame(CGRectMake(10, 10, 50, 50));
	view.backgroundColor = UIColor.redColor();
	container.add(view);

	var flag;

	$.button.addEventListener('click', function () {
		flag = !flag;
		$.notice.setText('');
		UIView.animateWithDurationAnimationsCompletion(10.0, function () {
			if (flag) {
				view.frame = CGRectMake(100, 100, 200, 200);
				view.layer.opacity = 0.8;
				view.layer.cornerRadius = 80;
				view.backgroundColor = UIColor.blueColor();
			} else {
				view.frame = CGRectMake(10, 10, 50, 50);
				view.layer.opacity = 1;
				view.layer.cornerRadius = 0;
				view.backgroundColor = UIColor.redColor();
			}
		}, function (_done) {
			$.notice.setText('Animation completed!');
			setTimeout(function () {
				$.notice.setText('');
			}, 2000);
		});
	});

})($.animateview_container);
