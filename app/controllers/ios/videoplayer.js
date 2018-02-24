import { UIScreen, UIView } from 'UIKit';
import { NSBundle, NSURL } from 'Foundation';
import CoreGraphics from 'CoreGraphics';
import { AVPlayer, AVPlayerLayer, AVFoundation } from 'AVFoundation';

let player = null;

(function(container) {
    const videoSize = {
        width: 300,
        height: 200
    };

    // Will search for /app/assets/videos/movie.mp4
    const videoPath = NSBundle.mainBundle.pathForResourceOfType('/videos/movie', 'mp4');
    const videoURL = NSURL.fileURLWithPath(videoPath);

    player = AVPlayer.playerWithURL(videoURL);
    player.muted = true;

    const layer = AVPlayerLayer.playerLayerWithPlayer(player);
    layer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    layer.frame = CGRectMake(0, 0, videoSize.width, videoSize.height);

    const view = new UIView();
    view.frame = CGRectMake(0, 0, videoSize.width, videoSize.height);
    view.layer.addSublayer(layer);
    view.center = CGPointMake(UIScreen.mainScreen.bounds.size.width / 2, (UIScreen.mainScreen.bounds.size.height / 2) - 43); // Center screen specs - nav height

    container.add(view);
})($.window);

function startPlayer() {
    player.play();
}

function pausePlayer() {
    player.pause();
}
