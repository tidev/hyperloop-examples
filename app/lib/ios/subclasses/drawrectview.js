const DrawRectView = Hyperloop.defineClass('DrawRectView', 'UIView');

DrawRectView.addMethod({
	selector: 'drawRect:',
	instance: true,
	arguments: [
		'CGRect'
	],
	callback: function (rect) {
		if (this.onDrawRect) {
			this.onDrawRect(rect);
		}
	}
});

export { DrawRectView }
