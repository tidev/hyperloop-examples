import { UIColor, UIView, UIBezierPath, UIKit } from 'UIKit';
import CoreGraphics from 'CoreGraphics';
import DrawRectView from '/subclasses/drawrectview';

const CGContextFillRect = CoreGraphics.CGContextFillRect;
const CGPointMake = CoreGraphics.CGPointMake;
const CGRectMake = CoreGraphics.CGRectMake;
const UIGraphicsGetCurrentContext = UIKit.UIGraphicsGetCurrentContext;

(function (container) {
	// http://stackoverflow.com/a/14991292/795295
	const view = new DrawRectView();

	view.onDrawRect = (rect) => {
		const beams = 9;
		const radius = rect.size.width / 2;

		UIColor.whiteColor.setFill();
		CGContextFillRect(UIGraphicsGetCurrentContext(), rect);

		UIColor.redColor.setFill();
		UIColor.greenColor.setStroke();

		const bezierPath = UIBezierPath.bezierPath();
		const centerPoint = CGPointMake(rect.size.width / 2, rect.size.height / 2);
		const thisPoint = CGPointMake(centerPoint.x + radius, centerPoint.y);

		bezierPath.moveToPoint(centerPoint);

		let thisAngle = 0;
		const sliceDegrees = 360 / beams / 2;

		for (let i = 0; i < beams; i++) {

			const x = radius * Math.cos(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerPoint.x;
			const y = radius * Math.sin(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerPoint.y;

			thisPoint = CGPointMake(x, y);
			bezierPath.addLineToPoint(thisPoint);
			thisAngle += sliceDegrees;

			const x2 = radius * Math.cos(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerPoint.x;
			const y2 = radius * Math.sin(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerPoint.y;

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

	view.backgroundColor = UIColor.yellowColor;
	view.frame = CGRectMake(0, 0, 300, 300);
	container.add(view);
})($.rect_container);

// convenience function for converting an angle in degress to radians
function DEGREES_TO_RADIANS(angle) {
	return (Number(angle) / 180.0 * Math.PI);
};
