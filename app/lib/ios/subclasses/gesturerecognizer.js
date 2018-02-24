// create a custom implementation of UIPanGestureRecognizer
var NativePanGestureRecognizer = Hyperloop.defineClass('NativePanGestureRecognizer', 'UIPanGestureRecognizer');

// we are going to implement a callback which will do the changes as the user moves the view
NativePanGestureRecognizer.addMethod({
	selector: 'onAction:',
	arguments: ['NativePanGestureRecognizer'],
	callback: (recognizer) => {
		if (this.onAction) {
			this.onAction(recognizer);
		}
	}
});

module.exports = NativePanGestureRecognizer;
