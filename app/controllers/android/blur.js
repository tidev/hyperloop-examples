(function(container) {
    var Bitmap = require('android.graphics.Bitmap'),
        Config = require('android.graphics.Bitmap.Config'),
        RenderScript = require('android.renderscript.RenderScript'),
        Allocation = require('android.renderscript.Allocation'),
        Element = require('android.renderscript.Element'),
        ScriptIntrinsicBlur = require('android.renderscript.ScriptIntrinsicBlur'),
        Activity = require('android.app.Activity'),
        Paint = require('android.graphics.Paint'),
        Color = require('android.graphics.Color'),
        Canvas = require('android.graphics.Canvas'),
        ImageView = require('android.widget.ImageView'),
        activity = new Activity(Ti.Android.currentActivity);

    var WIDTH = 200;
    var HEIGHT = 200;

    // create input image
    // TODO pass ImageView/TiBlob
    var bmp = Bitmap.createBitmap(WIDTH, HEIGHT, Config.ARGB_8888);
    var canvas = new Canvas(bmp);
    var paint = new Paint();
    paint.setColor(Color.rgb(255, 0, 0));
    paint.setStrokeWidth(10);
    canvas.drawLine(WIDTH * 0.5, 0, WIDTH * 0.5, HEIGHT, paint);
    paint.setColor(Color.rgb(0, 255, 0));
    canvas.drawLine(0, HEIGHT * 0.5, WIDTH, HEIGHT * 0.5, paint);

    // create blur output image
    var bmpOut = Bitmap.createBitmap(WIDTH, HEIGHT, Config.ARGB_8888);

    // blur
    var rs = RenderScript.create(activity);
    var blurScript = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
    var allIn = Allocation.createFromBitmap(rs, bmp);
    var allOut = Allocation.createFromBitmap(rs, bmpOut);

    blurScript.setRadius(10.0); // set blur value
    blurScript.setInput(allIn);
    blurScript.forEach(allOut);
    allOut.copyTo(bmpOut);
    bmp.recycle();
    rs.destroy();

    // create imageview and attach it
    var image = new ImageView(activity);
    container.add(image);
    image.setImageBitmap(bmpOut);
})($.blur_container);
