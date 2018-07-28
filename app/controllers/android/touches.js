import FrameLayout from 'android.widget.FrameLayout';
import LayoutParams from 'android.widget.FrameLayout.LayoutParams';
import ViewGroupLayoutParams from 'android.view.ViewGroup.LayoutParams';
import Gravity from 'android.view.Gravity';
import Color from 'android.graphics.Color';
import View from 'android.view.View';
import OnTouchListener from 'android.view.View.OnTouchListener';
import MotionEvent from 'android.view.MotionEvent';
import Activity from 'android.app.Activity';

(function (container) {
	const activity = new Activity(Ti.Android.currentActivity);

	const drag = new OnTouchListener({
		onTouch: (v, event) => {
			const action = event.getAction();
			if (action == MotionEvent.ACTION_MOVE || action == MotionEvent.ACTION_UP) {
				const params = LayoutParams.cast(v.getLayoutParams());
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
	const main = new FrameLayout(activity);
	main.setLayoutParams(new LayoutParams(ViewGroupLayoutParams.MATCH_PARENT, ViewGroupLayoutParams.MATCH_PARENT, Gravity.TOP));

	// Let's create a box for each color constant
	const colors = [
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
	for (let i = 0; i < colors.length; i++) {
		const temp = new View(activity);
		temp.setBackgroundColor(colors[i]);
		const layoutParams = new LayoutParams(50, 50, Gravity.TOP);
		layoutParams.setMargins(0, i * 50, 0, 0);
		temp.setLayoutParams(layoutParams);
		temp.setOnTouchListener(drag);
		main.addView(temp);
	}

	// Add our layout to the Ti.UI.View
	container.add(main);
})($.touch_container);
