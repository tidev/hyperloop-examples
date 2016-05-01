(function(container) {
    var View = require('android.view.View'),
        LayoutParams = require('android.widget.FrameLayout.LayoutParams'),
        ViewGroupLayoutParams = require('android.view.ViewGroup.LayoutParams'),
        Gravity = require('android.view.Gravity'),
        Color = require('android.graphics.Color'),
        Paint = require('android.graphics.Paint'),
        Style = require('android.graphics.Paint.Style'),
        Cap = require('android.graphics.Paint.Cap'),
        Activity = require('android.app.Activity'),
        RectF = require('android.graphics.RectF'),
        ValueAnimator = require('android.animation.ValueAnimator'),
        LinearInterpolator = require('android.view.animation.LinearInterpolator'),
        AnimatorUpdateListener = require('android.animation.ValueAnimator.AnimatorUpdateListener'),
        AnimatorListenerAdapter = require('android.animation.AnimatorListenerAdapter'),
        activity = new Activity(Ti.Android.currentActivity),
        view,
        layoutParams;

    var startValue = $.container.start;
    var endValue = $.container.end;
    var mSweepAngle = 0;
    var mStartAngle = startValue + ((mSweepAngle + $.container.startPosition) % 360);
    var borderWidth = 20;
    var circleRadius = $.container.radius;
    var colorDefault = Color.parseColor($.container.colorDefault);
    var colorSet = Color.parseColor($.container.colorSet);
    var isHalf = false;

    // animator
    var animation = ValueAnimator.ofInt(0, 100);
    animation.setDuration(3000);
    animation.setInterpolator(new LinearInterpolator());
    var listener = new AnimatorUpdateListener({
        onAnimationUpdate: function(animation) {
            mSweepAngle = endValue / 100 * animation.getAnimatedValue();
            view.invalidate();
        }
    });
    animation.addUpdateListener(listener);

    // view
    var CustomView = View.extend({
        onDraw: function(canvas) {
            var paint = new Paint();
            paint.setAntiAlias(true);
            paint.setStyle(Paint.Style.STROKE);
            paint.setStrokeWidth(borderWidth);
            paint.setStrokeCap(Cap.ROUND);
            paint.setColor(colorDefault);

            var mPaintProgress = new Paint();
            mPaintProgress.setAntiAlias(true);
            mPaintProgress.setStyle(Paint.Style.STROKE);
            mPaintProgress.setStrokeWidth(borderWidth);
            mPaintProgress.setStrokeCap(Cap.ROUND);
            mPaintProgress.setColor(colorSet);

            var rect = new RectF();
            rect.set(0 + borderWidth, 0 + borderWidth, circleRadius + borderWidth, circleRadius + borderWidth);

            canvas.drawArc(rect, startValue, endValue, false, paint);
            canvas.drawArc(rect, mStartAngle, mSweepAngle, false, mPaintProgress);
        }
    });

    view = new CustomView(activity);
    layoutParams = new LayoutParams(ViewGroupLayoutParams.WRAP_CONTENT, ViewGroupLayoutParams.WRAP_CONTENT, Gravity.NO_GRAVITY);
    layoutParams.setMargins(0, 0, 0, 0);
    view.setLayoutParams(layoutParams);
    container.add(view);

    $.btn_start.addEventListener("click", function(e) {
        animation.start();
    });
    $.btn_switch.addEventListener("click", function(e) {
        if (!isHalf) {
            startValue = 135;
            endValue = 270;
        } else {
            startValue = 0;
            endValue = 360
        }
        mSweepAngle = 0;
        mStartAngle = startValue + ((mSweepAngle + $.container.startPosition) % 360);
        
        isHalf = !isHalf;
        view.invalidate();
    });
})($.container);
