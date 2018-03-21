import Activity from 'android.app.Activity';
import LayoutParams from 'android.widget.FrameLayout.LayoutParams';
import ViewGroupLayoutParams from 'android.view.ViewGroup.LayoutParams';
import Gravity from 'android.view.Gravity';
import FBShimmerFrameLayout from 'com.facebook.shimmer.ShimmerFrameLayout';

/**
 * Shimmer example
 * @author: etruta
 *
 * A example using a combination of Native UI (from jar file) and Titanium UI.
 */
(function (container) {
  const activity = new Activity(Ti.Android.currentActivity);
  const loadingLabel = Ti.UI.createLabel({
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
    text: 'Shimmer',
    color: '#FFF',
    font: {
      fontSize:48
    }
  });

  const shimmer = new FBShimmerFrameLayout(activity);

  shimmer.setLayoutParams(new LayoutParams(ViewGroupLayoutParams.WRAP_CONTENT, ViewGroupLayoutParams.WRAP_CONTENT, Gravity.CENTER));
  shimmer.duration = 1000;
  shimmer.addView(loadingLabel);
  shimmer.startShimmerAnimation();

  container.add(shimmer);
})($.shimmer_container);
