import Activity from 'android.app.Activity';
import TypedValue from 'android.util.TypedValue';
import Gravity from 'android.view.Gravity';
import LayoutParams from 'android.widget.FrameLayout.LayoutParams';
import VideoView from 'android.widget.VideoView';
import Uri from 'android.net.Uri';
  
let player;

(function(container) {
    const activity = new Activity(Ti.Android.currentActivity);
    const videoSize = {
        width: 300,
        height: 200
    };
    
    const videoURL = 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4';

    // Convert units for Android
    const width = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, videoSize.width, activity.getResources().getDisplayMetrics());
    const height = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, videoSize.height, activity.getResources().getDisplayMetrics());
    const layoutParams = new LayoutParams(width, height, Gravity.CENTER);

    // Create video player
    player = new VideoView(activity);
    player.setVideoURI(Uri.parse(videoURL));
    player.setLayoutParams(layoutParams);

    container.add(player);
})($.window);

function startPlayer() {
    player.start();
}

function pausePlayer() {
    player.pause();
}
