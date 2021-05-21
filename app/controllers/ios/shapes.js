import { UIView, UIColor, UIBezierPath } from 'UIKit';
import { CAShapeLayer, CABasicAnimation } from 'QuartzCore';
import { CoreGraphics } from 'CoreGraphics';

const CGPointMake = CoreGraphics.CGPointMake;

const pathData = [
	{ radius: 100, startAngle:270, endAngle: 89, lineWidth: 50, duration: 0.25, title: 'iOS', value:'300', lblTop: 320, lblLeft: 325 },
	{ radius: 100, startAngle:90, endAngle: 180, lineWidth: 30, duration: 0.25, title: 'Android', value:'100', lblTop: 410, lblLeft: 30 },
];

const colors = [
	{ red: 0.74, green: 0.05, blue: 0, alpha: 1.0 },
	{ red: 0.99, green: 0.62, blue: 0.14, alpha: 1.0 },
	{ red: 0.02, green: 0.48, blue: 1, alpha: 1.0 }
];

let shapes = new Array();
let labels = new Array();
let container;

(function (_container) {
	// container is a Titanium.UI.View but we can cast it into a UIView
	container = _container;

	$.button.addEventListener('click', (e) => {
		clearView();
		startAnimation();
	});
})($.shapes_container);

function DEGREES_TO_RADIANS (angle) {
	return (Number(angle) / 180.0 * Math.PI);
}

function RGB_TO_HEX (r, g, b) {
	function componentToHex(c) {
		const hex = c.toString(16); return hex.length == 1 ? '0' + hex : hex;
	}
	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function startAnimation () {
	const color = Math.floor(Math.random() * colors.length);
	const view = UIView.cast(container);

	for (let i = 0; i < pathData.length; i++) {
		animateSection(view, pathData[i].radius, pathData[i].startAngle, pathData[i].endAngle, pathData[i].lineWidth, pathData[i].duration, colors[color]);
		animateLabel(pathData[i].title, pathData[i].value, pathData[i].lblTop, pathData[i].lblLeft, colors[color]);
	}

	animateRing(container);
}

function animateSection (view, radius, startAngle, endAngle, lineWidth, duration, color) {
	const rect = view.frame;
	const centerPoint = CGPointMake(rect.size.width / 2, rect.size.height / 2);

	const path = UIBezierPath.bezierPath();
	path.addArcWithCenterRadiusStartAngleEndAngleClockwise(centerPoint, radius, DEGREES_TO_RADIANS(startAngle), DEGREES_TO_RADIANS(endAngle), true);

	const shapeLayer = CAShapeLayer.layer();
	shapeLayer.path = path.CGPath;
	shapeLayer.strokeColor = UIColor.colorWithRedGreenBlueAlpha(color.red, color.green, color.blue, color.alpha).CGColor;
	shapeLayer.fillColor = UIColor.clearColor.CGColor;
	shapeLayer.lineWidth = lineWidth;
	shapeLayer.strokeStart = 0.0;
	shapeLayer.strokeEnd = 1.0;
	view.layer.addSublayer(shapeLayer);

	const pathAnimation = CABasicAnimation.animationWithKeyPath('strokeEnd');
	pathAnimation.duration = duration;
	pathAnimation.fromValue = 0.0;
	pathAnimation.toValue = 1.0;

	shapeLayer.addAnimationForKey(pathAnimation, 'strokeEnd');
	shapes.push(shapeLayer);
}

function animateRing (view) {
	const growAndFade = Ti.UI.createAnimation({
		transform: Ti.UI.createMatrix2D().scale(1.5),
		opacity: 0.0,
		duration: 1500
	});

	const ring = Ti.UI.createView({
		backgroundColor: 'red',
		borderColor: '#6c6c6c',
		borderWidth: 1,
		borderRadius: 40,
		width: 80,
		height: 80
	});

	view.add(ring);
	ring.animate(growAndFade);
}

function animateLabel (title, value, top, left, color) {
	 const view = Ti.UI.createView({
		 width: Ti.UI.SIZE,
		 height: Ti.UI.SIZE,
		 layout: 'vertical',
		 opacity: 0.0
	 });

	 const titleLbl = Ti.UI.createLabel({
		 text: title,
		 color: RGB_TO_HEX(Math.floor(color.red*255), Math.floor(color.green*255), Math.floor(color.blue*255)),
		 font:{
			 fontSize: 16,
			 fontFamily:'Helvetica'
		 },
		 right: 0
	 });

	 const valueLbl = Ti.UI.createLabel({
		 text: value,
		 color: '#FFF',
		 font:{
			 fontSize: 20,
			 fontFamily:'Helvetica'
		 },
		 top:2,
		 right: 0
	 });

	 view.add(titleLbl);
	 view.add(valueLbl)

	 const animation = Ti.UI.createAnimation({
		 left: left,
		 top: top,
		 opacity: 1.0,
		 duration: 250
	 });

	 container.add(view);
	 view.animate(animation);
	 labels.push(view);
}

function clearView () {
	if (shapes.length) {
		shapes.forEach(function (layer) {
			layer && layer.removeFromSuperlayer();
		});
		shapes = [];
	}

	if (labels.length) {
		labels.forEach(function (view) {
			container.remove(view);
			view = null;
		});
		labels = [];
	}
}
