(function (container) {
	var View = require('android.view.View'),
		Color = require('android.graphics.Color'),
		LayoutParams = require('android.widget.FrameLayout.LayoutParams'),
		Gravity = require('android.view.Gravity'),
		Paint = require('android.graphics.Paint'),
		Path = require('android.graphics.Path'),
		Style = require('android.graphics.Paint.Style'),
		Activity = require('android.app.Activity'),
		activity = new Activity(Ti.Android.currentActivity),
		view,
		layoutParams;

	// convenience function for converting an angle in degrees to radians
	function DEGREES_TO_RADIANS (angle) { return (Number(angle) / 180.0 * Math.PI); };

	// create a unique View subclass for doing our custom drawing
	var CustomView = View.extend({
		onDraw: function(canvas) {
			// this function is called when the onDraw is invoked to render the view
			//this.super.onDraw(canvas); // FIXME Set up super calls to work!
			var beams = 9,
				width = this.getWidth(),
				height = this.getHeight(),
				radius = width / 2,
				centerX = width / 2,
				centerY = height / 2,
				path,
				paint,
				thisAngle = 0,
				sliceDegrees = 360 / beams / 2;

			// fill with white
			canvas.drawColor(Color.WHITE);

			// Create our path
			var path = new Path();

			// move to center
			path.moveTo(centerX, centerY);

			// draw slices
			for (var i = 0; i < beams; i++) {

				var x = radius * Math.cos(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerX;
				var y = radius * Math.sin(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerY;

				path.lineTo(x, y);
				thisAngle += sliceDegrees;

				var x2 = radius * Math.cos(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerX;
				var y2 = radius * Math.sin(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerY;

				path.lineTo(x2, y2);
				path.lineTo(centerX, centerY);
				thisAngle += sliceDegrees;
			}
			path.close();

			// Now paint the path to the canvas

			// fill with red
			paint = new Paint();
			paint.setColor(Color.RED);
			paint.setStyle(Style.FILL);
			canvas.drawPath(path, paint);
			// stroke with green
			paint = new Paint();
			paint.setColor(Color.GREEN);
			paint.setStyle(Style.STROKE);
			paint.setStrokeWidth(2);
			canvas.drawPath(path, paint);
		}
	});

	view = new CustomView(activity);
	view.setBackgroundColor(Color.YELLOW);
	layoutParams = new LayoutParams(300, 300, Gravity.TOP);
	layoutParams.setMargins(0, 0, 0, 0);
	view.setLayoutParams(layoutParams);
	container.add(view);

})($.rect_container);
