import { UILabel, UIColor, UIView, NSLayoutConstraint, UIKit } from 'UIKit';

(function (container) {
	const label = new UILabel();
	label.translatesAutoresizingMaskIntoConstraints = false;
	label.setText('Hello World');
	label.setTextAlignment(UIKit.NSTextAlignmentCenter);
	label.setTextColor(UIColor.redColor);
	label.setBackgroundColor(UIColor.blueColor);

	const view = new UIView();
	view.setBackgroundColor(UIColor.yellowColor);
	view.addSubview(label);

	const heightConstraint = {
		item: label,
		attribute: UIKit.NSLayoutAttributeHeight,
		relatedBy: UIKit.NSLayoutRelationEqual,
		toItem: null,
		toAttribute: UIKit.NSLayoutAttributeNotAnAttribute,
		multiplier: 1.0,
		constant: 100.0
	};

	const widthConstraint = {
		item: label,
		attribute: UIKit.NSLayoutAttributeWidth,
		relatedBy: UIKit.NSLayoutRelationEqual,
		toItem: null,
		toAttribute: UIKit.NSLayoutAttributeNotAnAttribute,
		multiplier: 1.0,
		constant: 200.0
	};

	const horizontalConstraint = {
		item: label,
		attribute: UIKit.NSLayoutAttributeCenterX,
		relatedBy: UIKit.NSLayoutRelationEqual,
		toItem: view,
		toAttribute: UIKit.NSLayoutAttributeCenterX,
		multiplier: 1.0,
		constant: 0.0
	};

	const verticalConstraint = {
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
	const constraint = NSLayoutConstraint.constraintWithItemAttributeRelatedByToItemAttributeMultiplierConstant(
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
