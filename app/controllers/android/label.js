import TextView from 'android.widget.TextView';
import Activity from 'android.app.Activity';
import Color from 'android.graphics.Color';
import View from 'android.view.View';
import TypedValue from 'android.util.TypedValue';
import Typeface from 'android.graphics.Typeface';
	
$.win.activity.onCreate = () => {
	const activity = new Activity($.win.activity);

	const infoString = 'We ♡ Android';
	const label = new TextView(activity);

	label.setTypeface(Typeface.create('Helvetica', Typeface.BOLD));
	label.setTextSize(TypedValue.COMPLEX_UNIT_PX, 72);
	label.setText(infoString);
	label.setTextColor(Color.RED);
	label.setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
	label.setShadowLayer(10.0, 0, 4, Color.GRAY);

	$.label_container.add(label);
};
