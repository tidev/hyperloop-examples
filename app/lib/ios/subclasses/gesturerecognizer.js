// create a custom implementation of UIPanGestureRecognizer
const PanGestureRecognizer = Hyperloop.defineClass('NativePanGestureRecognizer', 'UIPanGestureRecognizer');

// we are going to implement a callback which will do the changes as the user moves the view
PanGestureRecognizer.addMethod({
	selector: 'onAction:',
	arguments: ['NativePanGestureRecognizer'],
	callback: function (recognizer) {
		if (this.onAction) {
			this.onAction(recognizer);
		}
	}
});

export { PanGestureRecognizer };
