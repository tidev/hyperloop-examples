(function (container) {
    var UIButton = require("UIKit/UIButton"),
        UIControlStateNormal = require("UIKit").UIControlStateNormal,
        UIControlStateSelected = require("UIKit").UIControlStateSelected,
        UIControlEventTouchUpInside = require("UIKit").UIControlEventTouchUpInside,
        UIScreen = require("UIKit/UIScreen"),
        UIColor = require("UIKit/UIColor"),
        CGRectMake = require('CoreGraphics').CGRectMake,
        UILabel = require("UIKit/UILabel");

    var button = new UIButton();

    button.backgroundColor = UIColor.redColor();
    button.layer.cornerRadius = 6;
    button.frame = CGRectMake(50, 50, 300, 45);
    button.setTitleForState("CLICK ME", UIControlStateNormal);

    var ButtonDelegate = Hyperloop.defineClass('ButtonDelegate', 'NSObject');

    ButtonDelegate.addMethod({
        selector: 'buttonPressed:',
        instance: true,
        arguments: ['UIButton'],
        callback: function(sender) {
            if (this.buttonPressed) {
                this.buttonPressed(sender);
            }
        }
    });

    var delegate = new ButtonDelegate();

    delegate.buttonPressed = function(sender) {
        alert('Button pressed!');
    };

    button.addTargetActionForControlEvents(delegate, "buttonPressed:", UIControlEventTouchUpInside);

    container.add(button);
})($.window);
