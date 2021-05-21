import { UIBlurEffect, UIVisualEffectView, UIKit } from 'UIKit';

(function (container) {
    const blurEffectLight = UIBlurEffect.effectWithStyle(UIKit.UIBlurEffectStyleLight);
    const blurView = UIVisualEffectView.alloc().initWithEffect(blurEffectLight);
    let isBlurred = false;

    const WIDTH = 200;
    const HEIGHT = 200;
    const fileUrl = 'images/appc-logo.png';

    const imageView = Ti.UI.createImageView({
        image: fileUrl,
        width: WIDTH,
        height: HEIGHT,
        borderColor: '#ccc',
        borderWidth: 2
    });

    const trigger = Ti.UI.createButton({
        backgroundColor: '#000',
        tintColor: '#fff',
        height: 50,
        width:200,
        bottom: 30,
        title: 'Blur image'
    });

    trigger.addEventListener('click', () => {
        if (isBlurred === true) {
            imageView.removeAllChildren();
        } else {
            imageView.add(blurView);
        }
        isBlurred = !isBlurred;
        trigger.title = isBlurred ? 'Unblur image' : 'Blur image';
    });

    container.add(imageView);
    container.add(trigger);

})($.blur_container);
