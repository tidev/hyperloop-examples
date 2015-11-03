(function (container) {

	var MyClass = require('MyFramework/MyClass'),
		MySwiftView = require('MyFramework/MySwiftView'),
		CGRectMake = require('CoreGraphics').CGRectMake,
		CGPointMake = require('CoreGraphics').CGPointMake,
		UIScreen = require('UIKit/UIScreen'),
		bounds = UIScreen.mainScreen().bounds;

	// create the objective-c class
	var view = new MyClass();
	view.frame = CGRectMake(0, 0, 96, 84);
	view.center = CGPointMake(bounds.size.width / 2, (bounds.size.height / 2) - 100);
	container.add(view);

	// create the swift class
	var view2 = new MySwiftView();
	view2.frame = CGRectMake(0, 0, 128, 128);
	view2.center = CGPointMake(bounds.size.width / 2, (bounds.size.height / 2) + 50);
	container.add(view2);

})($.custom_container);
