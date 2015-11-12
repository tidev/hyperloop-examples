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
		colors = [],
		dX,
		dY;

	drag = new OnTouchListener({
		onTouch: function(view, event) {
	        var action = event.getAction();
	        if (action == MotionEvent.ACTION_DOWN) {
	        	dX = view.getX() - event.getRawX();
	            dY = view.getY() - event.getRawY();
	            return true;
	        }
	        else if (action == MotionEvent.ACTION_MOVE) {
	        	 view.animate()
	                    .x(event.getRawX() + dX)
	                    .y(event.getRawY() + dY)
	                    .setDuration(0)
	                    .start();
	            return true;
	        }
	        return false;
		}
	});

	// Create a native layout to add our boxes to
	main = new FrameLayout(activity);
	// FIXME we want the layout to expand as we drag boxes, but it wasn't with MATCH_PARENT, likley because we're using animation rather than changing layout params on drag
	// ugh!
	main.setLayoutParams(new LayoutParams(900, 600, Gravity.TOP));

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
