(function (container) {

	var UIView = require('UIKit/UIView'),
		UIColor = require('UIKit/UIColor'),
		UIBezierPath = require('UIKit/UIBezierPath'),
		CGRectMake = require('CoreGraphics').CGRectMake,
		CGPointMake = require('CoreGraphics').CGPointMake,
		UIGraphicsGetCurrentContext = require('UIKit').UIGraphicsGetCurrentContext,
		CGContextFillRect = require('CoreGraphics').CGContextFillRect;

	// create a unique UIView subclass for doing our custom drawing
	var CustomDrawRectClass = Hyperloop.defineClass('CustomDrawRectClass', 'UIView');

	// convenience function for converting an angle in degress to radians
	function DEGREES_TO_RADIANS (angle) { return (Number(angle) / 180.0 * Math.PI) };

	// http://stackoverflow.com/a/14991292/795295
	CustomDrawRectClass.addMethod({
		selector: 'drawRect:',
		instance: true,
		encoding: 'v@:{CGRect={CGPoint=dd}{CGSize=dd}}',
		callback: function(rect) {

			// this function is called when the drawRect: is invoked to render the view

			var beams = 9;
			var radius = rect.size.width / 2;

			UIColor.whiteColor().setFill();
			CGContextFillRect(UIGraphicsGetCurrentContext(), rect);

			UIColor.redColor().setFill();
			UIColor.greenColor().setStroke();

			var bezierPath = UIBezierPath.bezierPath();
			var centerPoint = CGPointMake(rect.size.width / 2, rect.size.height / 2);
			var thisPoint = CGPointMake(centerPoint.x + radius, centerPoint.y);
			bezierPath.moveToPoint(centerPoint);

			var thisAngle = 0;
			var sliceDegrees = 360 / beams / 2;

			for (var i = 0; i < beams; i++) {

				var x = radius * Math.cos(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerPoint.x;
				var y = radius * Math.sin(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerPoint.y;

				thisPoint = CGPointMake(x, y);
				bezierPath.addLineToPoint(thisPoint);
				thisAngle += sliceDegrees;

				var x2 = radius * Math.cos(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerPoint.x;
				var y2 = radius * Math.sin(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerPoint.y;

				thisPoint = CGPointMake(x2, y2);
				bezierPath.addLineToPoint(thisPoint);
				bezierPath.addLineToPoint(centerPoint);
				thisAngle += sliceDegrees;
			}

			bezierPath.closePath();
			bezierPath.lineWidth = 2;
			bezierPath.fill();
			bezierPath.stroke();
		}
	});

	var view = new CustomDrawRectClass();
	view.backgroundColor = UIColor.yellowColor();
	view.frame = CGRectMake(0, 0, 300, 300);
	container.add(view);

})($.rect_container);
