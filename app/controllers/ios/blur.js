import { UIView, UIColor, UIBlurEffect, UIVisualEffectView, UIKit } from 'UIKit';
import { CoreGraphics } from 'CoreGraphics';

const UIBlurEffectStyleLight = UIKit.UIBlurEffectStyleLight;
const CGRectMake = CoreGraphics.CGRectMake;

(function (container) {
    const blurEffectLight = UIBlurEffect.effectWithStyle(UIBlurEffectStyleLight);
    const blurView = UIVisualEffectView.alloc().initWithEffect(blurEffectLight);
    const isBlurred = false;

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
        trigger.setTitle(isBlurred === true ? 'Unblur image' : 'Blur image');
    });

    container.add(imageView);
    container.add(trigger);

})($.blur_container);
