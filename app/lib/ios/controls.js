var UIView = require('UIKit/UIView'),
	UIColor = require('UIKit/UIColor'),
	UIBezierPath = require('UIKit/UIBezierPath'),
	CAShapeLayer = require('QuartzCore/CAShapeLayer'),
	CGPointMake = require('CoreGraphics').CGPointMake,
	CGRectMake = require('CoreGraphics').CGRectMake;

function bubble() {
	// Bubbles to parent view
}

function createWrapper(options) {
	return Ti.UI.createView(options || {});
}

function DEGREES_TO_RADIANS(angle) {
	return (Number(angle) / 180.0 * Math.PI);
}

exports.createArrow = function (options) {
	var wrapper = createWrapper(options);
	wrapper.setTransform(Ti.UI.create2DMatrix().rotate(options.rotation || 0));
	
	var view = UIView.cast(wrapper);

	var path = UIBezierPath.bezierPath();
	path.moveToPoint(CGPointMake(0,0));
	path.addLineToPoint(CGPointMake(20,20));
	path.addLineToPoint(CGPointMake(0,40));

	var shapeLayer = CAShapeLayer.layer();
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

exports.createCircle = function(options) {
	var wrapper = createWrapper(options);	
	var view = UIView.cast(wrapper);

	var centerPoint = CGPointMake(150, 150);
	var startAngle = 0;
	var endAngle = 360;
	var radius = 145;

	var path = UIBezierPath.bezierPath();
	path.addArcWithCenterRadiusStartAngleEndAngleClockwise(centerPoint, radius, DEGREES_TO_RADIANS(startAngle), DEGREES_TO_RADIANS(endAngle), true);

	var shapeLayer = CAShapeLayer.layer();
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