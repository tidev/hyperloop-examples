import { UIButton, UIScreen, UIColor, UILabel, UIKit } from 'UIKit';
import CoreGraphics from 'CoreGraphics';

const UIControlStateNormal = UIKit.UIControlStateNormal;
const UIControlStateSelected = UIKit.UIControlStateSelected;
const UIControlEventTouchUpInside = UIKit.UIControlEventTouchUpInside;
const CGRectMake = CoreGraphics.CGRectMake;

(function (container) {
    const button = new UIButton();
    const ButtonDelegate = Hyperloop.defineClass('ButtonDelegate', 'NSObject');

    button.backgroundColor = UIColor.redColor;
    button.layer.cornerRadius = 6;
    button.frame = CGRectMake(50, 50, 300, 45);
    button.setTitleForState('CLICK ME', UIControlStateNormal);

    ButtonDelegate.addMethod({
        selector: 'buttonPressed:',
        instance: true,
        arguments: ['UIButton'],
        callback: (sender) => {
            if (this.buttonPressed) {
                this.buttonPressed(sender);
            }
        }
    });

    const delegate = new ButtonDelegate();

    delegate.buttonPressed = function(sender) {
        alert('Button pressed!');
    };

    button.addTargetActionForControlEvents(delegate, 'buttonPressed:', UIControlEventTouchUpInside);

    container.add(button);
})($.window);
