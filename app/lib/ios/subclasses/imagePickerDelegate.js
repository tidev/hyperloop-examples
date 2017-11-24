var ImagePickerDelegate = Hyperloop.defineClass('ImagePickerDelegate', 'NSObject');

ImagePickerDelegate.addMethod({
	selector: 'wrapperDidPress:images:',
	instance: true,
	arguments: [
		'ImagePickerController',
		'NSArray'
	],
	callback: function (imagePicker, images) {
		if (this.wrapperDidPress) {
			this.wrapperDidPress(imagePicker, images);
		}
	}
});

ImagePickerDelegate.addMethod({
	selector: 'doneButtonDidPress:images:',
	instance: true,
	arguments: [
		'ImagePickerController',
		'NSArray'
	],
	callback: function (imagePicker, images) {
		if (this.doneButtonDid) {
			this.doneButtonDidPress(imagePicker, images);
		}
	}
});

ImagePickerDelegate.addMethod({
	selector: 'cancelButtonDidPress:',
	instance: true,
	arguments: [
		'ImagePickerController'
	],
	callback: function (imagePicker) {
		if (this.cancelButtonDidPress) {
			this.cancelButtonDidPress(imagePicker);
		}
	}
});

module.exports = ImagePickerDelegate;
