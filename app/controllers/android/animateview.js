(function (container) {
    var FrameLayout = require('android.widget.FrameLayout'),
    	ViewGroupLayoutParams = require('android.view.ViewGroup.LayoutParams'),
    	Color = require('android.graphics.Color'),
        Gravity = require('android.view.Gravity'),
        View = require('android.view.View'),
        Activity = require('android.app.Activity'),
        LayoutParams = require('android.widget.FrameLayout.LayoutParams'),
        Runnable = require('java.lang.Runnable'),
		activity = new Activity(Ti.Android.currentActivity),
        view,
        main,
        layoutParams;

	// Create a native layout to add our boxes to
	main = new FrameLayout(activity);
	main.setLayoutParams(new LayoutParams(600, 600, Gravity.TOP)); // Make containing view large enough to hold box when animated

	// create a view box we're going to animate when you click the button
	view = new View(activity);
    layoutParams = new LayoutParams(50, 50, Gravity.TOP);
    layoutParams.setMargins(10, 10, 0, 0);
    view.setLayoutParams(layoutParams);
	view.setBackgroundColor(Color.RED);
	
	// Add our box to a native containing view. containing view is intetionally made large enough to hold the box during the animation.
	// otherwise it'd get clipped since when we add to the Ti view, it sizes it just large enough to hold it's original contents.
	main.addView(view);
	// add containing view to Ti view
	container.add(main);
	
	// Do the animation
	var flag;
	$.button.addEventListener('click', function () {
		$.notice.setText('');
		flag = !flag;
		
		// this function is called after the animation completes
		var runnable = new Runnable({
			run: function () {
				$.notice.setText('Animation completed!');
				setTimeout(function () {
					$.notice.setText('');
				}, 2000);
			}
		});
		
		// animate the UIView
		if (flag) {
			 view.animate().alpha(0.8).scaleX(6).scaleY(6).xBy(250).yBy(250).rotation(180).setDuration(1000).withEndAction(runnable).start();
		} else {
			 view.animate().alpha(1.0).scaleX(1).scaleY(1).xBy(-250).yBy(-250).rotation(-180).setDuration(1000).withEndAction(runnable).start();
		}
	});

})($.animateview_container);
