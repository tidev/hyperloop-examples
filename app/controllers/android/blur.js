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
import Base64 from 'android.util.Base64';
import BitmapFactory from 'android.graphics.BitmapFactory';
import LayoutParams from "android.widget.FrameLayout.LayoutParams";
import ViewGroupLayoutParams from 'android.view.ViewGroup.LayoutParams';
import Gravity from 'android.view.Gravity';

(function(container) {
	const activity = new Activity(Ti.Android.currentActivity);

	// create input image
	$.img.addEventListener("load", function() {
		$.img.toImage(function(blob) {
			const encodeByte = Base64.decode(blob.toBase64(), Base64.NO_WRAP)
			const bmp = BitmapFactory.decodeByteArray(encodeByte, 0, encodeByte.length);

			// create output image
			const bmpOut = bmp.copy(bmp.getConfig(), true);
			const WIDTH = bmpOut.getWidth();
			const HEIGHT = bmpOut.getHeight();

			// draw in the canvas
			const canvas = new Canvas(bmpOut);
			const paint = new Paint();
			paint.setColor(Color.rgb(0, 0, 255));
			paint.setStrokeWidth(10);
			canvas.drawLine(WIDTH * 0.5, 0, WIDTH * 0.5, HEIGHT, paint);
			paint.setColor(Color.rgb(0, 255, 0));
			canvas.drawLine(0, HEIGHT * 0.5, WIDTH, HEIGHT * 0.5, paint);

			// blur
			const rs = RenderScript.create(activity);
			const blurScript = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
			const allIn = Allocation.createFromBitmap(rs, bmpOut);
			const allOut = Allocation.createFromBitmap(rs, bmpOut);

			blurScript.setRadius(10.0); // set blur value
			blurScript.setInput(allIn);
			blurScript.forEach(allOut);
			allOut.copyTo(bmpOut);
			bmp.recycle();
			rs.destroy();

			// create imageview and attach it
			const image = new ImageView(activity);
			const layoutParams = new LayoutParams(ViewGroupLayoutParams.WRAP_CONTENT, ViewGroupLayoutParams.WRAP_CONTENT, Gravity.CENTER);
			image.setLayoutParams(layoutParams);
			container.add(image);
			image.setImageBitmap(bmpOut);
		});
	});
})($.blur_container);
