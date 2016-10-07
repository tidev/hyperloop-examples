(function (container) {
	var UILabel = require('UIKit/UILabel'),
		UIColor = require('UIKit/UIColor'),
		NSMutableAttributedString = require('Foundation/NSMutableAttributedString'),
		UIFont = require('UIKit/UIFont'),
		NSShadow = require('UIKit/NSShadow'),
		UIKit = require('UIKit'),
		CGRectMake = require('CoreGraphics').CGRectMake,
		CGSizeMake = require('CoreGraphics').CGSizeMake,
		NSMakeRange = require('Foundation').NSMakeRange;

	var infoString = 'We ♥ iOS';
	var attString = NSMutableAttributedString.alloc().initWithString(infoString);
	var range = NSMakeRange(0, infoString.length);
	var font = UIFont.fontWithNameSize('Helvetica-Bold', 72);

	var shadowDic = new NSShadow();
	shadowDic.shadowBlurRadius = 10.0;
	shadowDic.shadowColor = UIColor.grayColor;
	shadowDic.shadowOffset = CGSizeMake(0, 4);

	attString.addAttributeValueRange(UIKit.NSFontAttributeName, font, range);
	attString.addAttributeValueRange(UIKit.NSShadowAttributeName, shadowDic,range);
	attString.addAttributeValueRange(UIKit.NSStrokeColorAttributeName, UIColor.redColor, range);
	attString.addAttributeValueRange(UIKit.NSStrokeWidthAttributeName, 5.0, range);

	var label = new UILabel();
	label.numberOfLines = 0;
	label.setTextAlignment(UIKit.NSTextAlignmentCenter);
	label.setAttributedText(attString);

	container.add(label);

})($.label_container);
