import FrameLayout from 'android.widget.FrameLayout';
import LayoutParams from 'android.widget.FrameLayout.LayoutParams';
import ViewGroupLayoutParams from 'android.view.ViewGroup.LayoutParams';
import Gravity from 'android.view.Gravity';
import Color from 'android.graphics.Color';
import View from 'android.view.View';
import OnTouchListener from 'android.view.View.OnTouchListener';
import MotionEvent from 'android.view.MotionEvent';
import Activity from 'android.app.Activity';

$.win.activity.onCreate = () => {
	const activity = new Activity($.win.activity);

	const drag = new OnTouchListener({
		onTouch: (v, event) => {
			const action = event.getActionMasked();
			switch (action) {
				case MotionEvent.ACTION_DOWN:
					const params = LayoutParams.cast(v.getLayoutParams());
					v.setTag({
						leftMargin: params.leftMargin,
						topMargin: params.topMargin,
						dragStartX: event.getRawX(),
						dragStartY: event.getRawY()
					});
					break;
				case MotionEvent.ACTION_MOVE:
					const tag = v.getTag();
					if (tag) {
						const params = LayoutParams.cast(v.getLayoutParams());
						params.leftMargin = tag.leftMargin + (event.getRawX() - tag.dragStartX);
						params.topMargin = tag.topMargin + (event.getRawY() - tag.dragStartY);
						v.setLayoutParams(params);
					}
					break;
			}
			return true;
		}
	});

	// Create a native layout to add our boxes to
	const main = new FrameLayout(activity);
	main.setLayoutParams(new LayoutParams(
		ViewGroupLayoutParams.MATCH_PARENT,
		ViewGroupLayoutParams.MATCH_PARENT,
		Gravity.TOP));

	// Let's create a box for each color constant
	const elevationInPixels = Ti.UI.convertUnits('5dp', Ti.UI.UNIT_PX);
	const colors = [
		Color.BLUE,
		Color.GRAY,
		Color.GREEN,
		Color.RED,
		Color.WHITE,
		Color.YELLOW
	];
	for (let i = 0; i < colors.length; i++) {
		const temp = new View(activity);
		temp.setBackgroundColor(colors[i]);
		temp.setElevation(elevationInPixels);
		const layoutParams = new LayoutParams(150, 150, Gravity.TOP);
		layoutParams.setMargins(0, i * 150, 0, 0);
		temp.setLayoutParams(layoutParams);
		temp.setOnTouchListener(drag);
		main.addView(temp);
	}

	// Add our layout to the Ti.UI.View
	$.touch_container.add(main);
};
