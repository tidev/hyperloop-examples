// hyperloop code ... Go!
(function (container) {

	var UILabel = require('UIKit/UILabel'),
		UIColor = require('UIKit/UIColor'),
		UIScreen = require('UIKit/UIScreen'),
		UIView = require('UIKit/UIView'),
		CGRectMake = require('CoreGraphics/CoreGraphics').CGRectMake,
		UIKit = require('UIKit/UIKit'),
		NSLayoutConstraint = require('UIKit/NSLayoutConstraint');

	var label = new UILabel();
	label.translatesAutoresizingMaskIntoConstraints = false;
	label.setText('Hello World');
	label.setTextAlignment(UIKit.NSTextAlignmentCenter);
	label.setTextColor(UIColor.redColor());
	label.setBackgroundColor(UIColor.blueColor());

	var view = new UIView();
	view.setBackgroundColor(UIColor.yellowColor());
	view.addSubview(label);

	var heightConstraint = NSLayoutConstraint.constraintWithItemAttributeRelatedByToItemAttributeMultiplierConstant(
		label,
		UIKit.NSLayoutAttributeHeight,
		UIKit.NSLayoutRelationEqual,
		null,
		UIKit.NSLayoutAttributeNotAnAttribute,
		1,
		100
	);

	var widthConstraint = NSLayoutConstraint.constraintWithItemAttributeRelatedByToItemAttributeMultiplierConstant(
		label,
		UIKit.NSLayoutAttributeWidth,
		UIKit.NSLayoutRelationEqual,
		null,
		UIKit.NSLayoutAttributeNotAnAttribute,
		1,
		200
	);

	var horizontalConstraint = NSLayoutConstraint.constraintWithItemAttributeRelatedByToItemAttributeMultiplierConstant(
		label,
		UIKit.NSLayoutAttributeCenterX,
		UIKit.NSLayoutRelationEqual,
		view,
		UIKit.NSLayoutAttributeCenterX,
		1,
		0
	);

	var verticalConstraint = NSLayoutConstraint.constraintWithItemAttributeRelatedByToItemAttributeMultiplierConstant(
		label,
		UIKit.NSLayoutAttributeCenterY,
		UIKit.NSLayoutRelationEqual,
		view,
		UIKit.NSLayoutAttributeCenterY,
		1,
		0
	);

	label.addConstraint(heightConstraint);
	label.addConstraint(widthConstraint);
	view.addConstraint(horizontalConstraint);
	view.addConstraint(verticalConstraint);

	container.add(view);

})($.autolayout_container);
