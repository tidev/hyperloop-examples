import View from 'android.view.View';
import LayoutParams from 'android.widget.FrameLayout.LayoutParams';
import Gravity from 'android.view.Gravity';
import Color from 'android.graphics.Color';
import Paint from 'android.graphics.Paint';
import Cap from 'android.graphics.Paint.Cap';
import Activity from 'android.app.Activity';
import RectF from 'android.graphics.RectF';
import ValueAnimator from 'android.animation.ValueAnimator';
import LinearInterpolator from 'android.view.animation.LinearInterpolator';
import AnimatorUpdateListener from 'android.animation.ValueAnimator.AnimatorUpdateListener';

$.win.activity.onCreate = () => {
	const activity = new Activity($.win.activity);
	const borderWidth = 20;
	const circleRadius = $.container.radius;
	const colorDefault = Color.parseColor($.container.colorDefault);
	const colorSet = Color.parseColor($.container.colorSet);

	let startValue = $.container.start;
	let endValue = $.container.end;
	let isHalf = false;
	let mSweepAngle = 0;
	let mStartAngle = startValue + ((mSweepAngle + $.container.startPosition) % 360);

	// animator
	const animation = ValueAnimator.ofInt(0, 100);
	animation.setDuration(3000);
	animation.setInterpolator(new LinearInterpolator());
	const listener = new AnimatorUpdateListener({
		onAnimationUpdate: (animation) => {
			$.lbl_progress.text = animation.getAnimatedValue() + ' %';
			mSweepAngle = endValue / 100 * animation.getAnimatedValue();
			view.invalidate();
		}
	});
	animation.addUpdateListener(listener);

	// view
	const CustomView = View.extend({
		onDraw: function (canvas) {
			this.super.onDraw(canvas);
			const paint = new Paint();
			paint.setAntiAlias(true);
			paint.setStyle(Paint.Style.STROKE);
			paint.setStrokeWidth(borderWidth);
			paint.setStrokeCap(Cap.ROUND);
			paint.setColor(colorDefault);

			const mPaintProgress = new Paint();
			mPaintProgress.setAntiAlias(true);
			mPaintProgress.setStyle(Paint.Style.STROKE);
			mPaintProgress.setStrokeWidth(borderWidth);
			mPaintProgress.setStrokeCap(Cap.ROUND);
			mPaintProgress.setColor(colorSet);

			const rect = new RectF();
			rect.set(borderWidth * 0.5, borderWidth * 0.5, circleRadius - borderWidth * 0.5, circleRadius - borderWidth * 0.5);

			canvas.drawArc(rect, startValue, endValue, false, paint);
			canvas.drawArc(rect, mStartAngle, mSweepAngle, false, mPaintProgress);
		}
	});

	const view = new CustomView(activity);
	const layoutParams = new LayoutParams(circleRadius, circleRadius, Gravity.CENTER);
	layoutParams.setMargins(0, 0, 0, 0);
	view.setLayoutParams(layoutParams);
	$.container.add(view);

	$.btn_start.addEventListener('click', (e) => {
		animation.start();
	});
	$.btn_switch.addEventListener('click', (e) => {
		if (!isHalf) {
			startValue = 135;
			endValue = 270;
		} else {
			startValue = 0;
			endValue = 360
		}
		mSweepAngle = 0;
		mStartAngle = startValue + ((mSweepAngle + $.container.startPosition) % 360);
		$.lbl_progress.text = '0 %';
		isHalf = !isHalf;
		view.invalidate();
	});
};
