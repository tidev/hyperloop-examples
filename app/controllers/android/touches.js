(function (container) {

	var FrameLayout = require('android.widget.FrameLayout'),
		LayoutParams = require('android.widget.FrameLayout.LayoutParams'),
		ViewGroupLayoutParams = require('android.view.ViewGroup.LayoutParams'),
		Gravity = require('android.view.Gravity'),
		Color = require('android.graphics.Color'),
		View = require('android.view.View'),
		OnTouchListener = require('android.view.View.OnTouchListener'),
		MotionEvent = require('android.view.MotionEvent'),
		Activity = require('android.app.Activity'),
		activity = new Activity(Ti.Android.currentActivity),
		drag,
		main,
		colors = [];
	
	drag = new OnTouchListener({
		onTouch: function(v, event) {
	        // start timer for iteration
	        var params,
	        	action = event.getAction();
	        if (action == MotionEvent.ACTION_MOVE || action == MotionEvent.ACTION_UP) {
	        	params = v.getLayoutParams();
	        	// FIXME We're cheating by adjusting for the position of the parent view on screen here
	        	// Ideally we'd use View.getLocationOnScreen(int[])
	        	// http://stackoverflow.com/questions/2224844/how-to-get-the-absolute-coordinates-of-a-view
	            params.topMargin = event.getRawY() - 150 - v.getHeight();
	            params.leftMargin = event.getRawX() - 30 - (v.getWidth() / 2);
	            v.setLayoutParams(params);
	        }
	        return true;
		}
	});

	// Create a native layout to add our boxes to
	main = new FrameLayout(activity);
	main.setLayoutParams(new LayoutParams(ViewGroupLayoutParams.MATCH_PARENT, ViewGroupLayoutParams.MATCH_PARENT, Gravity.TOP));

	// Let's create a box for each color constant
	colors = [
		Color.BLUE,
		Color.CYAN,
		Color.DKGRAY,
		Color.GRAY,
		Color.GREEN,
		Color.LTGRAY,
		Color.MAGENTA,
		Color.RED,
		Color.WHITE,
		Color.YELLOW
	];
	for (var i = 0; i < colors.length; i++) {
		var temp = new View(activity);
		temp.setBackgroundColor(colors[i]);
		var layoutParams = new LayoutParams(50, 50, Gravity.TOP);
		layoutParams.setMargins(0, i * 50, 0, 0);
		temp.setLayoutParams(layoutParams);
		temp.setOnTouchListener(drag);
		main.addView(temp);
	}

	// Add our layout to the Ti.UI.View
	container.add(main);
})($.touch_container);
