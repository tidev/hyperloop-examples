import { UIButton, UIColor, UIControlState, UIControlEvents } from 'UIKit';
import { CoreGraphics } from 'CoreGraphics';

(function (container) {
    const button = new UIButton();
    const ButtonDelegate = Hyperloop.defineClass('ButtonDelegate', 'NSObject');

    button.backgroundColor = UIColor.redColor;
    button.layer.cornerRadius = 6;
    button.frame = CoreGraphics.CGRectMake(50, 50, 300, 45);
    button.setTitleForState('CLICK ME', UIControlState.Normal);

    ButtonDelegate.addMethod({
        selector: 'buttonPressed:',
        instance: true,
        arguments: ['UIButton'],
        callback: function (sender) {
            if (this.buttonPressed) {
                this.buttonPressed(sender);
            }
        }
    });

    const delegate = new ButtonDelegate();

    delegate.buttonPressed = function() {
        alert('Button pressed!');
    };

    button.addTargetActionForControlEvents(delegate, 'buttonPressed:', UIControlEvents.TouchUpInside);

    container.add(button);
})($.window);
