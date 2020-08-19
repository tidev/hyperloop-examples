import Bitmap from 'android.graphics.Bitmap';
import BitmapFactory from 'android.graphics.BitmapFactory';
import Config from 'android.graphics.Bitmap.Config';
import RenderScript from 'android.renderscript.RenderScript';
import Allocation from 'android.renderscript.Allocation';
import Element from 'android.renderscript.Element';
import ScriptIntrinsicBlur from 'android.renderscript.ScriptIntrinsicBlur';
import Activity from 'android.app.Activity';
import ImageView from 'android.widget.ImageView';

function onOpen() {
	// Fetch the window's activity reference.
	const activity = new Activity($.win.activity);

	// Load the source image from the APK's "assets" folder.
	const stream = activity.getAssets().open('Resources/images/appc-logo.png')
	$.sourceBitmap = BitmapFactory.decodeStream(stream);
	stream.close();

	// Display a native ImageView with the above image.
	$.imageView = new ImageView(activity);
	$.imageView.setImageBitmap($.sourceBitmap);
	$.win.insertAt({
		position: 0,
		view: $.imageView
	});
}

function onBlurImage() {
	// Fetch the window's activity reference.
	const activity = new Activity($.win.activity);

	// Create a blurred bitmap from the source bitmap.
	const blurredBitmap = Bitmap.createBitmap($.sourceBitmap.getWidth(), $.sourceBitmap.getHeight(), Config.ARGB_8888);
	const rs = RenderScript.create(activity);
	const blurScript = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
	const allIn = Allocation.createFromBitmap(rs, $.sourceBitmap);
	const allOut = Allocation.createFromBitmap(rs, blurredBitmap);
	blurScript.setRadius(10.0);
	blurScript.setInput(allIn);
	blurScript.forEach(allOut);
	allOut.copyTo(blurredBitmap);
	rs.destroy();

	// Display the blurred image.
	$.imageView.setImageBitmap(blurredBitmap);

	// Update buttons.
	$.blurButton.visible = false;
	$.unblurButton.visible = true;
}

function onUnblurImage() {
	// Display the original unblurred image.
	$.imageView.setImageBitmap($.sourceBitmap);

	// Update buttons.
	$.blurButton.visible = true;
	$.unblurButton.visible = false;
}
