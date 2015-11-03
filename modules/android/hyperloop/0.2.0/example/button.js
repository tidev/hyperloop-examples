/**
 * Hyperloop Module
 * Copyright (c) 2015 by Appcelerator, Inc. and subject to the
 * Appcelerator Platform Subscription agreement.
 */
var Button = require('android.widget.Button'),
	Activity = require('android.app.Activity'),
	Color = require('android.graphics.Color'),
	RelativeLayout = require('android.widget.RelativeLayout'),
	Gravity = require('android.view.Gravity'),
	TypedValue = require('android.util.TypedValue'),
	OnClickListener = require('android.view.View.OnClickListener'),
	activity = new Activity(Ti.Android.currentActivity),
	layout = new RelativeLayout(activity),
	button = new Button(activity);

layout.setGravity(Gravity.CENTER); // center children vertical and horizontal
layout.setBackgroundColor(Color.BLACK); // set view to black BG or else splash screen shows through

button.setText("Hello Button");
button.setTextColor(Color.RED);
button.setBackgroundColor(Color.WHITE);
//button.setTextSize(TypedValue.COMPLEX_UNIT_PX, 60); // set font size to 60px
button.setOnClickListener(new OnClickListener({
	onClick: function(view) {
		alert('button clicked! boo yeah');
	}
}));

layout.addView(button);
activity.setContentView(layout);
