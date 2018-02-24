(function (container) {
    var UIView = require('UIKit/UIView'),
        UIColor = require('UIKit/UIColor'),
        UIBlurEffect = require('UIKit/UIBlurEffect'),
        UIBlurEffectStyleLight = require('UIKit').UIBlurEffectStyleLight,
        UIVisualEffectView = require('UIKit/UIVisualEffectView'),
        CGRectMake = require('CoreGraphics').CGRectMake;

    var blurEffectLight = UIBlurEffect.effectWithStyle(UIBlurEffectStyleLight);
    var blurView = UIVisualEffectView.alloc().initWithEffect(blurEffectLight);
    var isBlurred = false;

    var WIDTH = 200;
    var HEIGHT = 200;
    var fileUrl = "images/appc-logo.png";

    var imageView = Ti.UI.createImageView({
        image: fileUrl,
        width: WIDTH,
        height: HEIGHT,
        borderColor: "#ccc",
        borderWidth: 2
    });

    var trigger = Ti.UI.createButton({
        backgroundColor: "#000",
        tintColor: "#fff",
        height: 50,
        width:200,
        bottom: 30,
        title: "Blur image"
    });

    trigger.addEventListener("click", () => {
        if (isBlurred === true) {
            imageView.removeAllChildren();
        } else {
            imageView.add(blurView);
        }
        isBlurred = !isBlurred;
        trigger.setTitle(isBlurred === true ? "Unblur image" : "Blur image");
    });

    container.add(imageView);
    container.add(trigger);

})($.blur_container);
