var MediaElement = require('Windows.UI.Xaml.Controls.MediaElement'),
    Stretch = require('Windows.UI.Xaml.Media.Stretch'),
    Uri = require('System.Uri'),
    player = null;

(function(container) {
    var videoSize = {
        width: 300,
        height: 200
    };

    // Will search for /app/assets/videos/movie.mp4
    var videoPath = new Uri('ms-appx:///videos/movie.mp4');

    player = new MediaElement();
    player.IsMuted = true;
    player.Stretch = Stretch.Fill;
    player.Source = videoPath;
    player.Width  = videoSize.width;
    player.Height = videoSize.height;

    container.add(player);

})($.window);

function startPlayer() {
    player.Play();
}

function pausePlayer() {
    player.Pause();
}
