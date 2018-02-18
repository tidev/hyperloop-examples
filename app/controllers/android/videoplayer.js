var Activity = require('android.app.Activity'),
    TypedValue = require('android.util.TypedValue'),
    Gravity = require('android.view.Gravity'),
    LayoutParams = require('android.widget.FrameLayout.LayoutParams'),
    VideoView = require('android.widget.VideoView'),
    Uri = require('android.net.Uri'),
    activity = new Activity(Ti.Android.currentActivity),
    player;

(function(container) {
    var videoSize = {
        width: 300,
        height: 200
    };
    
    var videoURL = 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4';

    // Convert units for Android
    var width = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, videoSize.width, activity.getResources().getDisplayMetrics());
    var height = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, videoSize.height, activity.getResources().getDisplayMetrics());
    var layoutParams = new LayoutParams(width, height, Gravity.CENTER);

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
