/**
 * Hyperloop Module
 * Copyright (c) 2015 by Appcelerator, Inc. and subject to the
 * Appcelerator Platform Subscription agreement.
 */
 var TextView = require('android.widget.TextView'),
	Activity = require('android.app.Activity'),
	Color = require('android.graphics.Color'),
	RelativeLayout = require('android.widget.RelativeLayout'),
	Gravity = require('android.view.Gravity'),
	TypedValue = require('android.util.TypedValue'),
	activity = new Activity(Ti.Android.currentActivity),
	layout = new RelativeLayout(activity),
	text = new TextView(activity);

layout.setGravity(Gravity.CENTER); // center children vertical and horizontal
layout.setBackgroundColor(Color.BLACK); // set view to black BG or else splash screen shows through

text.setText("Hello World!");
text.setTextColor(Color.RED);
text.setTextSize(TypedValue.COMPLEX_UNIT_PX, 60); // set font size to 60px

layout.addView(text);
activity.setContentView(layout);
