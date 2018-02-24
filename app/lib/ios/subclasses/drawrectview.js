var DrawRectView = Hyperloop.defineClass('DrawRectView', 'UIView');
DrawRectView.addMethod({
	selector: 'drawRect:',
	instance: true,
	arguments: [
		'CGRect'
	],
	callback: (rect) => {
		if (this.onDrawRect) {
			this.onDrawRect(rect);
		}
	}
});

module.exports = DrawRectView;
