import Activity from 'android.app.Activity';
import Context from 'android.content.Context';
import Inflater from 'android.view.LayoutInflater';

$.win.activity.onCreate = () => {
	const activity = new Activity($.win.activity);
	const inflater = Inflater.cast(activity.getApplicationContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE));
	const view = inflater.inflate(Ti.App.Android.R.layout.main_content, null);
	$.win.add(view);
};
