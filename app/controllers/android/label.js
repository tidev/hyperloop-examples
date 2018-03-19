import TextView from 'android.widget.TextView';
import Activity from 'android.app.Activity';
import Color from 'android.graphics.Color';
import View from 'android.view.View';
import TypedValue from 'android.util.TypedValue';
import Typeface from 'android.graphics.Typeface';
	
(function (container) {
  const activity = new Activity(Ti.Android.currentActivity);

	// TODO Use Spannables to make more like iOS AttributedString
	// FIXME Find way to support the Unicode heart symbol (looks like the Google fonts may not have it?)
	// Here's one person's related project: https://github.com/JoanZapata/android-iconify
	const infoString = 'We <3 Android';
	const label = new TextView(activity);

	label.setTypeface(Typeface.create('Helvetica', Typeface.BOLD));
	label.setTextSize(TypedValue.COMPLEX_UNIT_PX, 72);
	label.setText(infoString);
	label.setTextColor(Color.RED);
	label.setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
	label.setShadowLayer(10.0, 0, 4, Color.GRAY);

	container.add(label);
})($.label_container);
