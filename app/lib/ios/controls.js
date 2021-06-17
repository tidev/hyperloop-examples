import { UIView, UIColor, UIBezierPath } from 'UIKit';
import { CAShapeLayer } from 'QuartzCore';
import { CoreGraphics } from 'CoreGraphics';

const CGPointMake = CoreGraphics.CGPointMake;

function createWrapper(options) {
	return Ti.UI.createView(options || {});
}

function DEGREES_TO_RADIANS(angle) {
	return (Number(angle) / 180.0 * Math.PI);
}

const createArrow = function (options) {
	const wrapper = createWrapper(options);
	wrapper.transform = Ti.UI.createMatrix2D().rotate(options.rotation || 0);

	const view = UIView.cast(wrapper);

	const path = UIBezierPath.bezierPath();
	path.moveToPoint(CGPointMake(0,0));
	path.addLineToPoint(CGPointMake(20,20));
	path.addLineToPoint(CGPointMake(0,40));

	const shapeLayer = CAShapeLayer.layer();
	shapeLayer.path = path.CGPath;
	shapeLayer.strokeColor = UIColor.colorWithRedGreenBlueAlpha(0, 0, 0, 1).CGColor;
	shapeLayer.fillColor = UIColor.clearColor.CGColor;
	shapeLayer.lineWidth = 2;
	shapeLayer.strokeStart = 0.0;
	shapeLayer.strokeEnd = 1.0;
	
	view.layer.addSublayer(shapeLayer);
	wrapper.add(view);
		
	return wrapper;
}

const createCircle = function(options) {
	const wrapper = createWrapper(options);	
	const view = UIView.cast(wrapper);

	const centerPoint = CGPointMake(150, 150);
	const startAngle = 0;
	const endAngle = 360;
	const radius = 145;

	const path = UIBezierPath.bezierPath();
	path.addArcWithCenterRadiusStartAngleEndAngleClockwise(centerPoint, radius, DEGREES_TO_RADIANS(startAngle), DEGREES_TO_RADIANS(endAngle), true);

	const shapeLayer = CAShapeLayer.layer();
	shapeLayer.path = path.CGPath;
	shapeLayer.strokeColor = UIColor.colorWithRedGreenBlueAlpha(0, 0, 0, 1).CGColor;
	shapeLayer.fillColor = UIColor.clearColor.CGColor;
	shapeLayer.lineWidth = 2;
	shapeLayer.strokeStart = 0.0;
	shapeLayer.strokeEnd = 1.0;
	
	view.layer.addSublayer(shapeLayer);
	wrapper.add(view);
	
	return wrapper;
}

export { createArrow, createCircle }
