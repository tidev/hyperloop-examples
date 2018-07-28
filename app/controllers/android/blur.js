import Bitmap from 'android.graphics.Bitmap';
import Config from 'android.graphics.Bitmap.Config';
import RenderScript from 'android.renderscript.RenderScript';
import Allocation from 'android.renderscript.Allocation';
import Element from 'android.renderscript.Element';
import ScriptIntrinsicBlur from 'android.renderscript.ScriptIntrinsicBlur';
import Activity from 'android.app.Activity';
import Paint from 'android.graphics.Paint';
import Color from 'android.graphics.Color';
import Canvas from 'android.graphics.Canvas';
import ImageView from 'android.widget.ImageView';
    
(function(container) {
    const activity = new Activity(Ti.Android.currentActivity);

    const WIDTH = 200;
    const HEIGHT = 200;

    // create input image
    // TODO pass ImageView/TiBlob
    const bmp = Bitmap.createBitmap(WIDTH, HEIGHT, Config.ARGB_8888);
    const canvas = new Canvas(bmp);
    const paint = new Paint();
    paint.setColor(Color.rgb(255, 0, 0));
    paint.setStrokeWidth(10);
    canvas.drawLine(WIDTH * 0.5, 0, WIDTH * 0.5, HEIGHT, paint);
    paint.setColor(Color.rgb(0, 255, 0));
    canvas.drawLine(0, HEIGHT * 0.5, WIDTH, HEIGHT * 0.5, paint);

    // create blur output image
    const bmpOut = Bitmap.createBitmap(WIDTH, HEIGHT, Config.ARGB_8888);

    // blur
    const rs = RenderScript.create(activity);
    const blurScript = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
    const allIn = Allocation.createFromBitmap(rs, bmp);
    const allOut = Allocation.createFromBitmap(rs, bmpOut);

    blurScript.setRadius(10.0); // set blur value
    blurScript.setInput(allIn);
    blurScript.forEach(allOut);
    allOut.copyTo(bmpOut);
    bmp.recycle();
    rs.destroy();

    // create imageview and attach it
    const image = new ImageView(activity);
    container.add(image);
    image.setImageBitmap(bmpOut);
})($.blur_container);
