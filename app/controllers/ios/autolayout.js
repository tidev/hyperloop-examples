var UILabel = require('UIKit/UILabel'),
	UIColor = require('UIKit/UIColor'),
	UIScreen = require('UIKit/UIScreen'),
	UIView = require('UIKit/UIView'),
	CGRectMake = require('CoreGraphics/CoreGraphics').CGRectMake,
	UIKit = require('UIKit/UIKit'),
	NSLayoutConstraint = require('UIKit/NSLayoutConstraint');

(function (container) {
	var label = new UILabel();
	label.translatesAutoresizingMaskIntoConstraints = false;
	label.setText('Hello World');
	label.setTextAlignment(UIKit.NSTextAlignmentCenter);
	label.setTextColor(UIColor.redColor);
	label.setBackgroundColor(UIColor.blueColor);

	var view = new UIView();
	view.setBackgroundColor(UIColor.yellowColor);
	view.addSubview(label);

	var heightConstraint = {
		item: label,
		attribute: UIKit.NSLayoutAttributeHeight,
		relatedBy: UIKit.NSLayoutRelationEqual,
		toItem: null,
		toAttribute: UIKit.NSLayoutAttributeNotAnAttribute,
		multiplier: 1.0,
		constant: 100.0
	};

	var widthConstraint = {
		item: label,
		attribute: UIKit.NSLayoutAttributeWidth,
		relatedBy: UIKit.NSLayoutRelationEqual,
		toItem: null,
		toAttribute: UIKit.NSLayoutAttributeNotAnAttribute,
		multiplier: 1.0,
		constant: 200.0
	};

	var horizontalConstraint = {
		item: label,
		attribute: UIKit.NSLayoutAttributeCenterX,
		relatedBy: UIKit.NSLayoutRelationEqual,
		toItem: view,
		toAttribute: UIKit.NSLayoutAttributeCenterX,
		multiplier: 1.0,
		constant: 0.0
	};

	var verticalConstraint = {
		item: label,
		attribute: UIKit.NSLayoutAttributeCenterY,
		relatedBy: UIKit.NSLayoutRelationEqual,
		toItem: view,
		toAttribute: UIKit.NSLayoutAttributeCenterY,
		multiplier: 1.0,
		constant: 0.0
	};

	addConstraint(label, heightConstraint);
	addConstraint(label, widthConstraint);
	addConstraint(view, horizontalConstraint);
	addConstraint(view, verticalConstraint);

	container.add(view);

})($.autolayout_container);

function addConstraint(element, options) {
	var constraint = NSLayoutConstraint.constraintWithItemAttributeRelatedByToItemAttributeMultiplierConstant(
		options.item,
		options.attribute,
		options.relatedBy,
		options.toItem,
		options.toAttribute,
		options.multiplier,
		options.constant
	);
	element.addConstraint(constraint);
}
