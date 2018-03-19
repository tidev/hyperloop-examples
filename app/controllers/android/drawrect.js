import View from 'android.view.View';
import Color from 'android.graphics.Color';
import LayoutParams from 'android.widget.FrameLayout.LayoutParams';
import Gravity from 'android.view.Gravity';
import Paint from 'android.graphics.Paint';
import Path from 'android.graphics.Path';
import Activity from 'android.app.Activity';
	
(function (container) {
	const activity = new Activity(Ti.Android.currentActivity);

	// create a unique View subclass for doing our custom drawing
	const CustomView = View.extend({
		onDraw: function (canvas) {
			this.super.onDraw(canvas);

			const beams = 9;
			const width = this.getWidth();
			const height = this.getHeight();
			const radius = width / 2;
			const centerX = width / 2;
			const centerY = height / 2;
			const sliceDegrees = 360 / beams / 2;
			const path = new Path();
			
			let thisAngle = 0;

			// fill with white
			canvas.drawColor(Color.WHITE);

			// move to center
			path.moveTo(centerX, centerY);

			// draw slices
			for (let i = 0; i < beams; i++) {
				const x = radius * Math.cos(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerX;
				const y = radius * Math.sin(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerY;

				path.lineTo(x, y);
				thisAngle += sliceDegrees;

				const x2 = radius * Math.cos(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerX;
				const y2 = radius * Math.sin(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerY;

				path.lineTo(x2, y2);
				path.lineTo(centerX, centerY);
				thisAngle += sliceDegrees;
			}
			path.close();

			// Now paint the path to the canvas

			// fill with red
			const redPaint = new Paint();
			redPaint.setColor(Color.RED);
			redPaint.setStyle(Paint.Style.FILL);
			canvas.drawPath(path, redPaint);
	
			// stroke with green
			const greenPaint = new Paint();
			greenPaint.setColor(Color.GREEN);
			greenPaint.setStyle(Paint.Style.STROKE);
			greenPaint.setStrokeWidth(2);
			canvas.drawPath(path, greenPaint);
		}
	});

	const view = new CustomView(activity);
	const layoutParams = new LayoutParams(300, 300, Gravity.TOP);

	view.setBackgroundColor(Color.YELLOW);
	layoutParams.setMargins(0, 0, 0, 0);
	view.setLayoutParams(layoutParams);
	container.add(view);

})($.rect_container);

// convenience function for converting an angle in degrees to radians
function DEGREES_TO_RADIANS (angle) {
	return (Number(angle) / 180.0 * Math.PI);
};
