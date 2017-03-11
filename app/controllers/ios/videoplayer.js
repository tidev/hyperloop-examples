var UIScreen = require('UIKit/UIScreen'),
    UIScreen = require('UIKit/UIScreen'),
    UIView = require('UIKit/UIView'),
    CGPointMake = require('CoreGraphics').CGPointMake,
    CGRectMake = require('CoreGraphics').CGRectMake,
    NSBundle = require('Foundation/NSBundle'),
    NSURL = require('Foundation/NSURL'),
    AVPlayer = require('AVFoundation/AVPlayer'),
    AVPlayerLayer = require('AVFoundation/AVPlayerLayer'),
    AVLayerVideoGravityResizeAspectFill = require('AVFoundation').AVLayerVideoGravityResizeAspectFill,
    player = null;

(function(container) {
    var videoSize = {
        width: 300,
        height: 200
    };

    // Will search for /app/assets/videos/movie.mp4
    var videoPath = NSBundle.mainBundle.pathForResourceOfType('/videos/movie', 'mp4');
    var videoURL = NSURL.fileURLWithPath(videoPath);

    player = AVPlayer.alloc().initWithURL(videoURL);
    player.muted = true;

    var layer = new AVPlayerLayer();
    layer.player = player;
    layer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    layer.frame = CGRectMake(0, 0, videoSize.width, videoSize.height);

    var view = new UIView();
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
