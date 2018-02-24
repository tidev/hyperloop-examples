
var Activity = require('android.app.Activity');
var AudioManager = require('android.media.AudioManager');
var MediaPlayer = require('android.media.MediaPlayer');
var Uri = require('android.net.Uri');
var activity = new Activity(Ti.Android.currentActivity);
var context = activity.getApplicationContext();
var mMediaPlayer;

(function(container) {
	var contentUri = Uri.parse('android.resource://' + activity.getPackageName() + '/raw/audio');
	
	mMediaPlayer = new MediaPlayer();
	mMediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener({
		onCompletion: (mediaPlayer) => {
			Ti.API.info('MediaPlayer playback completed');
		}
	}));
	mMediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
	mMediaPlayer.setDataSource(context, contentUri);
	mMediaPlayer.prepare();
})($.window);

function startMedia() {
	mMediaPlayer.start();
}

function stopMedia() {
	mMediaPlayer.pause();
	
	// NOTE: You can also stop it, but then you have to prepare() it again as well
	// mMediaPlayer.stop();
	// mMediaPlayer.prepare();
}
