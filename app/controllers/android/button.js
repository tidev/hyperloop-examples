import Button from 'android.widget.Button';
import LayoutParams from 'android.widget.FrameLayout.LayoutParams';
import Activity from 'android.app.Activity';
import Color from 'android.graphics.Color';
import TypedValue from 'android.util.TypedValue';
import Gravity from 'android.view.Gravity';
import OnClickListener from 'android.view.View.OnClickListener';

$.win.activity.onCreate = () => {
	// Create a new Button object with your current activity
	const activity = new Activity($.win.activity);
	const button = new Button(activity);

	// Set the width and height of the button layout
	// In this case, we created it density-specific to
	// look the same on different android-devices
	const width = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 200, activity.getResources().getDisplayMetrics());
	const height = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 50, activity.getResources().getDisplayMetrics());
	const layoutParams = new LayoutParams(width, height, Gravity.CENTER);
	button.setLayoutParams(layoutParams);

	// Set a blue background-color (also try Color.RED or Color.GREEN!)
	button.setBackgroundColor(Color.BLUE);
	button.setTextColor(Color.WHITE);

	// Set a button title
	button.setText('CLICK ME');

	// Register a click-listener to the button
	button.setOnClickListener(new OnClickListener({
		onClick: (v) => {
			alert('Button pressed!');
		}
	}));

	// Add it to your titanium-view
	$.win.add(button);
};
