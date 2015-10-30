(function (container) {

	var MyClass = require('MyFramework/MyClass'),
		CGRectMake = require('CoreGraphics').CGRectMake;

	var view = new MyClass();
	view.frame = CGRectMake(140, 150, 100, 100);
	container.add(view);

})($.custom_container);
