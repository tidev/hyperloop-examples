(function (container) {
	const sizeViewContainer = Ti.UI.createView({
		width: '200',
		height: '200',
		top: 20,
		backgroundColor: 'green'
	});

	const sizeView = Ti.UI.createLabel({
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		text: 'Hello',
		backgroundColor: 'red',
		color: 'white'
	});

	container.add(sizeViewContainer);
	sizeViewContainer.add(sizeView);

	const fillViewContainer = Ti.UI.createView({
		width: '200',
		height: '200',
		backgroundColor: 'blue'
	});

	const fillView = Ti.UI.createLabel({
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		text: 'Hello',
		backgroundColor: 'red',
		color: 'white'
	});

	container.add(fillViewContainer);
	fillViewContainer.add(fillView);

	const bottomViewContainer = Ti.UI.createView({
		width: '200',
		height: '200',
		bottom: 20,
		backgroundColor: 'red'
	});

	container.add(bottomViewContainer);

	if (OS_IOS) {
		const button = Ti.UI.createButton({
			title: 'Make size to fit',
			bottom: 10
		});

		const UILabel = require('UIKit/UILabel');
		const UIColor = require('UIKit/UIColor');
		const label = new UILabel();
		label.text = 'Hello';
		label.backgroundColor = UIColor.yellowColor;
		bottomViewContainer.add(label);

		button.addEventListener('click', () => {
			// if you call sizeToFit will make the label the biggest size to accomodate the label and position at 0,0
			label.sizeToFit();
		});

		bottomViewContainer.add(button);
	}
})($.sizefill_container);
