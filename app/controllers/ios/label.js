import { UILabel, UIColor, UIFont, UIKit, NSShadow } from 'UIKit';
import { NSMutableAttributedString, Foundation } from 'Foundation';
import { CoreGraphics } from 'CoreGraphics';

const CGSizeMake = CoreGraphics.CGSizeMake;
const NSMakeRange = Foundation.NSMakeRange;

(function (container) {
	const infoString = 'We ♥ iOS';
	const attString = NSMutableAttributedString.alloc().initWithString(infoString);
	const range = NSMakeRange(0, infoString.length);
	const font = UIFont.fontWithNameSize('Helvetica-Bold', 72);

	const shadowDic = new NSShadow();
	shadowDic.shadowBlurRadius = 10.0;
	shadowDic.shadowColor = UIColor.grayColor;
	shadowDic.shadowOffset = CGSizeMake(0, 4);

	attString.addAttributeValueRange(UIKit.NSFontAttributeName, font, range);
	attString.addAttributeValueRange(UIKit.NSShadowAttributeName, shadowDic,range);
	attString.addAttributeValueRange(UIKit.NSStrokeColorAttributeName, UIColor.redColor, range);
	attString.addAttributeValueRange(UIKit.NSStrokeWidthAttributeName, 5.0, range);

	const label = new UILabel();
	label.numberOfLines = 0;
	label.setTextAlignment(UIKit.NSTextAlignmentCenter);
	label.setAttributedText(attString);

	container.add(label);
})($.label_container);
