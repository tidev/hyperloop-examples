import View from 'android.view.View';
import Gravity from 'android.view.Gravity';
import Color from 'android.graphics.Color';
import Paint from 'android.graphics.Paint';
import Style from 'android.graphics.Paint.Style';
import Path from 'android.graphics.Path';
import PathDirection from 'android.graphics.Path.Direction';
import LayoutParams from 'android.widget.FrameLayout.LayoutParams';
import Activity from 'android.app.Activity';

/**
 * DonutChart example
 * @author: Bert Grantges
 * @author: Chris Williams (ported to Android)
 *
 * For this example we'll make a very nice looking Donut Chart out of a combination
 * of Titanium Cross Platform code and IOS specific Native UI for drawing the more
 * complex objects on the screen.
 */
(function (container) {

		const activity = new Activity(Ti.Android.currentActivity);
		const Styles = {
			midnight:  Color.argb(255, 35, 46, 63),
			deepRed:  Color.argb(255, 181, 25, 0),
			lightRed:  Color.argb(255, 223, 47, 0),
			blackPearl:  Color.argb(255, 28, 36, 50),
			lightGray:  Color.argb(255, 237, 238, 238)
		};
		
		const DonutChartView = View.extend({
			onMeasure: function (widthMeasureSpec, heightMeasureSpec) {
				// Do required super-class call
				this.super.onMeasure(widthMeasureSpec, heightMeasureSpec);
				
				const width = this.getMeasuredWidth();
				const height = this.getMeasuredHeight();
				
				Ti.API.warn('Measure update: ' + width + 'x' + height);
			},
			onDraw: function (canvas) {
				this.super.onDraw(canvas);				
				
				const paint = new Paint();
				paint.setAntiAlias(true);

				//// Oval Drawing
				const ovalPath = new Path();
				ovalPath.addOval(8, 8, 240, 240, PathDirection.CW);

				paint.setColor(Styles.blackPearl);
				paint.setStyle(Style.FILL);
				canvas.drawPath(ovalPath, paint);

				//// lineMarker Drawing
				const lineMarkerPath = new Path();
				lineMarkerPath.moveTo(9, 129);
				lineMarkerPath.cubicTo(9, 62.73, 62.73, 9, 129, 9);

				paint.setColor(Styles.deepRed);
				paint.setStyle(Style.STROKE);
				paint.setStrokeWidth(2);
				canvas.drawPath(lineMarkerPath, paint);


				//// segment0 Drawing
				const segment0Path = new Path();
				segment0Path.moveTo(129, 19);
				segment0Path.cubicTo(129, 25.9, 129, 34.38, 129, 44.01);
				segment0Path.cubicTo(128.67, 44, 128.33, 44, 128, 44);
				segment0Path.cubicTo(113.03, 44, 98.98, 47.92, 86.81, 54.78);
				segment0Path.cubicTo(80.62, 58.27, 74.92, 62.51, 69.83, 67.4);
				segment0Path.cubicTo(62.97, 60.54, 56.96, 54.53, 52.15, 49.72);
				segment0Path.cubicTo(56.34, 45.65, 60.86, 41.93, 65.66, 38.57);
				segment0Path.cubicTo(71.04, 34.82, 76.77, 31.53, 82.8, 28.78);
				segment0Path.cubicTo(95.7, 22.9, 109.96, 19.45, 124.97, 19.04);
				segment0Path.cubicTo(125.98, 19.01, 126.99, 19, 128, 19);
				segment0Path.cubicTo(128.33, 19, 128.67, 19, 129, 19);
				segment0Path.close();

				paint.setColor(Styles.lightGray);
				paint.setStyle(Style.FILL);
				canvas.drawPath(segment0Path, paint);


				//// segment1 Drawing
				const segment1Path = new Path();
				segment1Path.moveTo(205.72, 51.57);
				segment1Path.cubicTo(200.8, 56.5, 194.8, 62.49, 188.04, 69.25);
				segment1Path.cubicTo(173.22, 54.11, 152.73, 44.55, 130, 44.02);
				segment1Path.cubicTo(130, 34.4, 130, 25.91, 130, 19.02);
				segment1Path.cubicTo(159.63, 19.55, 186.38, 31.91, 205.72, 51.57);
				segment1Path.close();

				paint.setColor(Styles.lightGray);
				paint.setStyle(Style.FILL);
				canvas.drawPath(segment1Path, paint);


				//// segment2 Drawing
				const segment2Path = new Path();
				segment2Path.moveTo(51.44, 50.42);
				segment2Path.cubicTo(56.25, 55.23, 62.25, 61.24, 69.12, 68.1);
				segment2Path.cubicTo(53.83, 83.12, 44.27, 103.94, 44.01, 127);
				segment2Path.lineTo(19, 127);
				segment2Path.cubicTo(19.27, 97.04, 31.63, 69.96, 51.44, 50.42);
				segment2Path.close();

				paint.setColor(Styles.lightGray);
				paint.setStyle(Style.FILL);
				canvas.drawPath(segment2Path, paint);


				//// segment3 Drawing
				const segment3Path = new Path();
				segment3Path.moveTo(237, 128);
				segment3Path.cubicTo(237, 157.48, 225.3, 184.23, 206.28, 203.85);
				segment3Path.cubicTo(201.35, 198.92, 195.35, 192.92, 188.6, 186.17);
				segment3Path.cubicTo(203.09, 171.07, 212, 150.58, 212, 128);
				segment3Path.lineTo(237, 128);
				segment3Path.lineTo(237, 128);
				segment3Path.close();

				paint.setColor(Styles.lightGray);
				paint.setStyle(Style.FILL);
				canvas.drawPath(segment3Path, paint);


				//// segment4 Drawing
				const segment4Path = new Path();
				segment4Path.moveTo(69.25, 188.04);
				segment4Path.cubicTo(62.4, 194.89, 56.39, 200.9, 51.57, 205.72);
				segment4Path.cubicTo(31.47, 185.94, 19, 158.43, 19, 128);
				segment4Path.lineTo(44, 128);
				segment4Path.cubicTo(44, 151.52, 53.67, 172.79, 69.25, 188.04);
				segment4Path.close();

				paint.setColor(Styles.lightGray);
				paint.setStyle(Style.FILL);
				canvas.drawPath(segment4Path, paint);


				//// segment5 Drawing
				const segment5Path = new Path();
				segment5Path.moveTo(205.58, 204.56);
				segment5Path.cubicTo(186.25, 224.15, 159.56, 236.45, 130, 236.98);
				segment5Path.cubicTo(130, 230.09, 130, 221.6, 130, 211.98);
				segment5Path.cubicTo(152.66, 211.45, 173.1, 201.94, 187.9, 186.89);
				segment5Path.cubicTo(194.66, 193.64, 200.65, 199.63, 205.58, 204.56);
				segment5Path.close();

				paint.setColor(Styles.lightGray);
				paint.setStyle(Style.FILL);
				canvas.drawPath(segment5Path, paint);


				//// segment9 Drawing
				const segment9Path = new Path();
				segment9Path.moveTo(69.97, 188.74);
				segment9Path.cubicTo(85.05, 203.15, 105.49, 212, 128, 212);
				segment9Path.cubicTo(128.33, 212, 128.67, 212, 129, 211.99);
				segment9Path.cubicTo(129, 221.62, 129, 230.1, 129, 236.99);
				segment9Path.cubicTo(128.67, 237, 128.33, 237, 128, 237);
				segment9Path.cubicTo(98.59, 237, 71.9, 225.35, 52.29, 206.42);
				segment9Path.cubicTo(57.11, 201.6, 63.12, 195.59, 69.97, 188.74);
				segment9Path.close();

				paint.setColor(Styles.lightGray);
				paint.setStyle(Style.FILL);
				canvas.drawPath(segment9Path, paint);


				//// segmentWithPointer Drawing
				const segmentWithPointerPath = new Path();
				segmentWithPointerPath.moveTo(225.26, 78.74);
				segmentWithPointerPath.cubicTo(225.34, 78.54, 225.39, 78.43, 225.39, 78.43);
				segmentWithPointerPath.lineTo(234.57, 82.39);
				segmentWithPointerPath.cubicTo(234.57, 82.39, 231.27, 90.05, 230.69, 91.38);
				segmentWithPointerPath.cubicTo(234.67, 102.52, 236.88, 114.51, 237, 127);
				segmentWithPointerPath.lineTo(211.99, 127);
				segmentWithPointerPath.cubicTo(211.74, 104.89, 202.93, 84.83, 188.74, 69.97);
				segmentWithPointerPath.cubicTo(195.5, 63.21, 201.49, 57.21, 206.42, 52.29);
				segmentWithPointerPath.cubicTo(213.94, 60.08, 220.31, 68.99, 225.26, 78.74);
				segmentWithPointerPath.close();

				paint.setColor(Styles.deepRed);
				paint.setStyle(Style.FILL);
				canvas.drawPath(segmentWithPointerPath, paint);
			}
		});

	/** Create a Titanium Wrapper View **/
	const wrapper = Ti.UI.createView({
		backgroundColor: '#232E3F'
	});

	/** Create an Instance of the DonutChartView **/
	const view = new DonutChartView(activity);
	const layoutParams = new LayoutParams(256, 256, Gravity.CENTER);

	view.setBackgroundColor(Color.TRANSPARENT);
	view.setLayoutParams(layoutParams);
	//view.layer.cornerRadius = 10; // TODO What's the Android equivalent?

	/** Add the native UIView based object to the Titanium View **/
	wrapper.add(view);

	/**
		We can mix and match Titanium and Native super easy - here
	  lets add a Titanium Label
	**/
	const label = Ti.UI.createLabel({
		font: { fontSize: 36, fontWeight: 'bold'},
		color: '#EDEEEE',
		text: '35'
	});

	/** Add the label to the Wrapper View **/
	wrapper.add(label);

	/** Now lets add the wrapper to the containing object **/
	container.add(wrapper);

})($.donut_container);
