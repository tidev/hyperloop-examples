(function (container) {

	var sizeViewContainer = Ti.UI.createView({
		width: '200',
		height: '200',
		top: 20,
		backgroundColor: 'green'
	});

	var sizeView = Ti.UI.createLabel({
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		text: 'Hello',
		backgroundColor: 'red',
		color: 'white'
	});

	container.add(sizeViewContainer);
	sizeViewContainer.add(sizeView);

	var fillViewContainer = Ti.UI.createView({
		width: '200',
		height: '200',
		backgroundColor: 'blue'
	});

	var fillView = Ti.UI.createLabel({
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		text: 'Hello',
		backgroundColor: 'red',
		color: 'white'
	});

	container.add(fillViewContainer);
	fillViewContainer.add(fillView);

	var bottomViewContainer = Ti.UI.createView({
		width: '200',
		height: '200',
		bottom: 20,
		backgroundColor: 'red'
	});

	container.add(bottomViewContainer);

	if (OS_IOS) {
		var button = Ti.UI.createButton({
			title: 'Make size to fit',
			bottom: 10
		});

		var UILabel = require('UIKit/UILabel');
		var UIColor = require('UIKit/UIColor');
		var label = new UILabel();
		label.text = "Hello";
		label.backgroundColor = UIColor.yellowColor();
		bottomViewContainer.add(label);

		button.addEventListener('click', function () {
			// if you call sizeToFit will make the label the biggest size to accomodate the label and position at 0,0
			label.sizeToFit();
		});

		bottomViewContainer.add(button);
	}

})($.sizefill_container);
