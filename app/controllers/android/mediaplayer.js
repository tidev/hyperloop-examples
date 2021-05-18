import Activity from 'android.app.Activity';
import AudioManager from 'android.media.AudioManager';
import MediaPlayer from 'android.media.MediaPlayer';
import Uri from 'android.net.Uri';

let mMediaPlayer;

$.win.activity.onCreate = () => {
	const activity = new Activity($.win.activity);
	const contentUri = Uri.parse('android.resource://' + activity.getPackageName() + '/raw/audio');

	mMediaPlayer = new MediaPlayer();
	mMediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener({
		onCompletion: (mediaPlayer) => {
			Ti.API.info('MediaPlayer playback completed');
		}
	}));
	mMediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
	mMediaPlayer.setDataSource(activity.getApplicationContext(), contentUri);
	mMediaPlayer.prepare();
};

function startMedia() {
	mMediaPlayer.start();
}

function stopMedia() {
	mMediaPlayer.pause();
	
	// NOTE: You can also stop it, but then you have to prepare() it again as well
	// mMediaPlayer.stop();
	// mMediaPlayer.prepare();
}
