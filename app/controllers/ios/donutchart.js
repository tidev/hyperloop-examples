(function (container) {

	var UIView = require('UIKit/UIView'),
		UIColor = require('UIKit/UIColor'),
		UIBezierPath = require('UIKit/UIBezierPath'),
		UIScreen = require('UIKit/UIScreen'),
		CGPointMake = require('CoreGraphics').CGPointMake,
		CGRectMake = require('CoreGraphics').CGRectMake;

	function DEGREES_TO_RADIANS(angle) { return (Number(angle) / 180.0 * Math.PI) };

	var DonutChartView = Hyperloop.defineClass('DonutChartView', 'UIView');

	DonutChartView.addMethod({
		selector: 'drawRect:',
		instance: true,
		encoding: 'v@:{CGRect={CGPoint=dd}{CGSize=dd}}',
		callback: function(rect) {
			var centerPoint = CGPointMake(rect.size.width / 2, rect.size.height / 2);

			//http://stackoverflow.com/questions/18404124/uibezierpath-draw-circle-with-different-strokes

			var bluePath = UIBezierPath.bezierPath();
			bluePath.addArcWithCenterRadiusStartAngleEndAngleClockwise(
				centerPoint,
				90.0,
				DEGREES_TO_RADIANS(-90),
				DEGREES_TO_RADIANS(90),
				true
			);

			bluePath.lineWidth = 50;
			UIColor.blueColor().setStroke();
			bluePath.stroke();

			var redPath = UIBezierPath.bezierPath();
			redPath.addArcWithCenterRadiusStartAngleEndAngleClockwise(
				centerPoint,
				90.0,
				DEGREES_TO_RADIANS(92),
				DEGREES_TO_RADIANS(180),
				true
			);

			redPath.lineWidth = 30;
			UIColor.redColor().setStroke();
			redPath.stroke();

			var greenPath = UIBezierPath.bezierPath();
			greenPath.addArcWithCenterRadiusStartAngleEndAngleClockwise(
				centerPoint,
				90.0,
				DEGREES_TO_RADIANS(182),
				DEGREES_TO_RADIANS(-92),
				true
			);

			greenPath.lineWidth = 10;
			UIColor.greenColor().setStroke();
			greenPath.stroke();

			var ovalRect = CGRectMake((rect.size.width / 2)-50,(rect.size.height / 2)-50,100,100);
			var circle = UIBezierPath.bezierPathWithOvalInRect(ovalRect);

			UIColor.lightGrayColor().setFill();
			circle.fill();
		}
	});

	var view = new DonutChartView();
	// make the chart take up most of the screen bounds
	var bounds = UIScreen.mainScreen().bounds;
	view.frame = CGRectMake(0, 0, bounds.size.width - 40, bounds.size.height - 60);
	view.backgroundColor = UIColor.clearColor();
	view.layer.allowsEdgeAntialiasing = true;
	view.layer.cornerRadius = 10;
	container.add(view);


})($.donut_container);
