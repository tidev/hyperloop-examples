var ImagePickerController = require('ImagePicker/ImagePickerController');
var ImagePickerDelegate = require('/subclasses/ImagePickerDelegate');
var imagePicker;

(function (container) {
	// Prepare delegates
	var imagePickerDelegate = new ImagePickerDelegate();

	imagePickerDelegate.wrapperDidPress = function(imagePicker, images) {
		Ti.API.info('wrapperDidPress');
		Ti.API.info(images);
	};
	
	imagePickerDelegate.doneButtonDidPress = function(imagePicker, images) {
		Ti.API.info('doneButtonDidPress');
		Ti.API.info(images);
	};
	
	imagePickerDelegate.cancelButtonDidPressImagePicker = function(imagePicker) {
		Ti.API.info('cancelButtonDidPress');
	};

	// Initialize image picker
	imagePicker = new ImagePickerController();
	imagePicker.delegate = imagePickerDelegate;
	imagePicker.imageLimit = 5;	
})($.container);

function selectPhoto() {
	TiApp.app().showModalController(imagePicker, true);
}
