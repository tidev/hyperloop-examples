/**
 * Hyperloop Module
 * Copyright (c) 2015 by Appcelerator, Inc. and subject to the
 * Appcelerator Platform Subscription agreement.
 */
var FrameLayout = require('android.widget.FrameLayout'),
	LayoutParams = require('android.widget.FrameLayout$LayoutParams'),
	ViewGroupLayoutParams = require('android.view.ViewGroup$LayoutParams'),
	Gravity = require('android.view.Gravity'),
	Log = require('android.util.Log'),
	Color = require('android.graphics.Color'),
	View = require('android.view.View'),
	OnTouchListener = require('android.view.View$OnTouchListener'),
	MotionEvent = require('android.view.MotionEvent'),
	Activity = require('android.app.Activity'),
	activity = new Activity(Ti.Android.currentActivity);

var drag = new OnTouchListener({
	onTouch: function(v, event) {
        // start timer for iteration
        var params,
        	action = event.getAction();
        if (action == MotionEvent.ACTION_MOVE || action == MotionEvent.ACTION_UP) {
        	params = LayoutParams.cast(v.getLayoutParams());
            params.topMargin = event.getRawY() - v.getHeight();
            params.leftMargin = event.getRawX() - (v.getWidth() / 2);
            v.setLayoutParams(params);
        }
        return true;
	}
});

var main = new FrameLayout(activity);
main.setBackgroundColor(Color.BLACK);
// FIXME Tried to access LayoutParams.MATCH_PARENT and it was null, because the constant is actually defined on ViewGroupLayoutParams
// But that should work, because it does in Java!
var mainParams = new LayoutParams(ViewGroupLayoutParams.MATCH_PARENT, ViewGroupLayoutParams.MATCH_PARENT, Gravity.TOP);
main.setLayoutParams(mainParams);

var colors = [
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

activity.setContentView(main);
