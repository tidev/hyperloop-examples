/**
 * DonutChart example
 * @author: Bert Grantges
 *
 * For this example we'll make a very nice looking Donut Chart out of a combination
 * of Titanium Cross Platform code and IOS specific Native UI for drawing the more
 * complex objects on the screen.
 */

(function (container) {

	var UIView = require('UIKit/UIView'),
		UIColor = require('UIKit/UIColor'),
		UIBezierPath = require('UIKit/UIBezierPath'),
		UIScreen = require('UIKit/UIScreen'),
		CGPointMake = require('CoreGraphics').CGPointMake,
		CGRectMake = require('CoreGraphics').CGRectMake;

	var Styles = {
		midnight:  UIColor.colorWithRedGreenBlueAlpha(0.137, 0.180, 0.247, 1.000),
		deepRed:  UIColor.colorWithRedGreenBlueAlpha(0.710, 0.098, 0.000, 1.000),
		lightRed:  UIColor.colorWithRedGreenBlueAlpha(0.875, 0.184, 0.000, 1.000),
		blackPearl:  UIColor.colorWithRedGreenBlueAlpha(0.110, 0.141, 0.196, 1.000),
		lightGray:  UIColor.colorWithRedGreenBlueAlpha(0.929, 0.933, 0.933, 1.000)
	};

	var DrawRectView = require('/subclasses/drawrectview')

	/** Create a Titanium Wrapper View **/
	var wrapper = Ti.UI.createView({
		backgroundColor: '#232E3F'
	});

	/** Create an Instance of the DrawRectView **/
	var view = new DrawRectView();
	view.onDrawRect = function(rect) {
		//// Oval Drawing
		var ovalPath = UIBezierPath.bezierPathWithOvalInRect(CGRectMake(8, 8, 240, 240));
		Styles.blackPearl.setFill();
		ovalPath.fill();


		//// lineMarker Drawing
		var lineMarkerPath = UIBezierPath.bezierPath();
		lineMarkerPath.moveToPoint(CGPointMake(9, 129));
		lineMarkerPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(129, 9), CGPointMake(9, 62.73), CGPointMake(62.73, 9));
		Styles.deepRed.setStroke();
		lineMarkerPath.lineWidth = 2;
		lineMarkerPath.stroke();


		//// segment0 Drawing
		var segment0Path = UIBezierPath.bezierPath();
		segment0Path.moveToPoint(CGPointMake(129, 19));
		segment0Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(129, 44.01), CGPointMake(129, 25.9), CGPointMake(129, 34.38));
		segment0Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(128, 44), CGPointMake(128.67, 44), CGPointMake(128.33, 44));
		segment0Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(86.81, 54.78), CGPointMake(113.03, 44), CGPointMake(98.98, 47.92));
		segment0Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(69.83, 67.4), CGPointMake(80.62, 58.27), CGPointMake(74.92, 62.51));
		segment0Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(52.15, 49.72), CGPointMake(62.97, 60.54), CGPointMake(56.96, 54.53));
		segment0Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(65.66, 38.57), CGPointMake(56.34, 45.65), CGPointMake(60.86, 41.93));
		segment0Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(82.8, 28.78), CGPointMake(71.04, 34.82), CGPointMake(76.77, 31.53));
		segment0Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(124.97, 19.04), CGPointMake(95.7, 22.9), CGPointMake(109.96, 19.45));
		segment0Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(128, 19), CGPointMake(125.98, 19.01), CGPointMake(126.99, 19));
		segment0Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(129, 19), CGPointMake(128.33, 19), CGPointMake(128.67, 19));
		segment0Path.closePath();
		Styles.lightGray.setFill();
		segment0Path.fill();


		//// segment1 Drawing
		var segment1Path = UIBezierPath.bezierPath();
		segment1Path.moveToPoint(CGPointMake(205.72, 51.57));
		segment1Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(188.04, 69.25), CGPointMake(200.8, 56.5), CGPointMake(194.8, 62.49));
		segment1Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(130, 44.02), CGPointMake(173.22, 54.11), CGPointMake(152.73, 44.55));
		segment1Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(130, 19.02), CGPointMake(130, 34.4), CGPointMake(130, 25.91));
		segment1Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(205.72, 51.57), CGPointMake(159.63, 19.55), CGPointMake(186.38, 31.91));
		segment1Path.closePath();
		Styles.lightGray.setFill();
		segment1Path.fill();


		//// segment2 Drawing
		var segment2Path = UIBezierPath.bezierPath();
		segment2Path.moveToPoint(CGPointMake(51.44, 50.42));
		segment2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(69.12, 68.1), CGPointMake(56.25, 55.23), CGPointMake(62.25, 61.24));
		segment2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(44.01, 127), CGPointMake(53.83, 83.12), CGPointMake(44.27, 103.94));
		segment2Path.addLineToPoint(CGPointMake(19, 127));
		segment2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(51.44, 50.42), CGPointMake(19.27, 97.04), CGPointMake(31.63, 69.96));
		segment2Path.closePath();
		Styles.lightGray.setFill();
		segment2Path.fill();


		//// segment3 Drawing
		var segment3Path = UIBezierPath.bezierPath();
		segment3Path.moveToPoint(CGPointMake(237, 128));
		segment3Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(206.28, 203.85), CGPointMake(237, 157.48), CGPointMake(225.3, 184.23));
		segment3Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(188.6, 186.17), CGPointMake(201.35, 198.92), CGPointMake(195.35, 192.92));
		segment3Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(212, 128), CGPointMake(203.09, 171.07), CGPointMake(212, 150.58));
		segment3Path.addLineToPoint(CGPointMake(237, 128));
		segment3Path.addLineToPoint(CGPointMake(237, 128));
		segment3Path.closePath();
		Styles.lightGray.setFill();
		segment3Path.fill();


		//// segment4 Drawing
		var segment4Path = UIBezierPath.bezierPath();
		segment4Path.moveToPoint(CGPointMake(69.25, 188.04));
		segment4Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(51.57, 205.72), CGPointMake(62.4, 194.89), CGPointMake(56.39, 200.9));
		segment4Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(19, 128), CGPointMake(31.47, 185.94), CGPointMake(19, 158.43));
		segment4Path.addLineToPoint(CGPointMake(44, 128));
		segment4Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(69.25, 188.04), CGPointMake(44, 151.52), CGPointMake(53.67, 172.79));
		segment4Path.closePath();
		Styles.lightGray.setFill();
		segment4Path.fill();


		//// segment5 Drawing
		var segment5Path = UIBezierPath.bezierPath();
		segment5Path.moveToPoint(CGPointMake(205.58, 204.56));
		segment5Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(130, 236.98), CGPointMake(186.25, 224.15), CGPointMake(159.56, 236.45));
		segment5Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(130, 211.98), CGPointMake(130, 230.09), CGPointMake(130, 221.6));
		segment5Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(187.9, 186.89), CGPointMake(152.66, 211.45), CGPointMake(173.1, 201.94));
		segment5Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(205.58, 204.56), CGPointMake(194.66, 193.64), CGPointMake(200.65, 199.63));
		segment5Path.closePath();
		Styles.lightGray.setFill();
		segment5Path.fill();


		//// segment9 Drawing
		var segment9Path = UIBezierPath.bezierPath();
		segment9Path.moveToPoint(CGPointMake(69.97, 188.74));
		segment9Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(128, 212), CGPointMake(85.05, 203.15), CGPointMake(105.49, 212));
		segment9Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(129, 211.99), CGPointMake(128.33, 212), CGPointMake(128.67, 212));
		segment9Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(129, 236.99), CGPointMake(129, 221.62), CGPointMake(129, 230.1));
		segment9Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(128, 237), CGPointMake(128.67, 237), CGPointMake(128.33, 237));
		segment9Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(52.29, 206.42), CGPointMake(98.59, 237), CGPointMake(71.9, 225.35));
		segment9Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(69.97, 188.74), CGPointMake(57.11, 201.6), CGPointMake(63.12, 195.59));
		segment9Path.closePath();
		Styles.lightGray.setFill();
		segment9Path.fill();


		//// segmentWithPointer Drawing
		var segmentWithPointerPath = UIBezierPath.bezierPath();
		segmentWithPointerPath.moveToPoint(CGPointMake(225.26, 78.74));
		segmentWithPointerPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(225.39, 78.43), CGPointMake(225.34, 78.54), CGPointMake(225.39, 78.43));
		segmentWithPointerPath.addLineToPoint(CGPointMake(234.57, 82.39));
		segmentWithPointerPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(230.69, 91.38), CGPointMake(234.57, 82.39), CGPointMake(231.27, 90.05));
		segmentWithPointerPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(237, 127), CGPointMake(234.67, 102.52), CGPointMake(236.88, 114.51));
		segmentWithPointerPath.addLineToPoint(CGPointMake(211.99, 127));
		segmentWithPointerPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(188.74, 69.97), CGPointMake(211.74, 104.89), CGPointMake(202.93, 84.83));
		segmentWithPointerPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(206.42, 52.29), CGPointMake(195.5, 63.21), CGPointMake(201.49, 57.21));
		segmentWithPointerPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(225.26, 78.74), CGPointMake(213.94, 60.08), CGPointMake(220.31, 68.99));
		segmentWithPointerPath.closePath();
		Styles.deepRed.setFill();
		segmentWithPointerPath.fill();
	}
	var bounds = UIScreen.mainScreen.bounds;
	view.frame = CGRectMake(0, 0, 256, 256);
	view.center = CGPointMake(bounds.size.width / 2, (bounds.size.height / 2) - 30);
	view.backgroundColor = UIColor.clearColor;
	view.layer.allowsEdgeAntialiasing = true;
	view.layer.cornerRadius = 10;

	/** Add the native UIView based object to the Titanium View **/
	wrapper.add(view);

  /**
		We can mix and match Titanium and Native super easy - here
	  lets add a Titanium Label
	**/
	var lbl = Ti.UI.createLabel({
		font:{ fontSize: 48, fontWeight: "bold"},
		color: "#EDEEEE",
		text: "35"
	});

	/** Add the label to the Wrapper View **/
	wrapper.add(lbl);

	/** Now lets add the wrapper to the containing object **/
	container.add(wrapper);

})($.donut_container);
