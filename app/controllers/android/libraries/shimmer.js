/**
 * Shimmer example
 * @author: etruta
 *
 * A example using a combination of Native UI (from jar file) and Titanium UI.
 */
(function (container) {
  var Activity = require('android.app.Activity'),
      LayoutParams = require('android.widget.FrameLayout.LayoutParams'),
      ViewGroupLayoutParams = require('android.view.ViewGroup.LayoutParams'),
      Gravity = require('android.view.Gravity'),
      activity = new Activity(Ti.Android.currentActivity);

  var loadingLabel = Ti.UI.createLabel({
    textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
    text:"Shimmer",
    color:"#FFF",
    font: {
      fontSize:48
    }
  });

  var  FBShimmerFrameLayout = require('com.facebook.shimmer.ShimmerFrameLayout');
  var shimmer = new FBShimmerFrameLayout(activity);
  shimmer.setLayoutParams(new LayoutParams(ViewGroupLayoutParams.WRAP_CONTENT, ViewGroupLayoutParams.WRAP_CONTENT, Gravity.CENTER));
  shimmer.duration = 1000;
  shimmer.addView(loadingLabel);
  shimmer.startShimmerAnimation();

  container.add(shimmer);
})($.shimmer_container);
