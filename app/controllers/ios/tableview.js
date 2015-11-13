(function (container) {

	var UIScreen = require("UIKit/UIScreen"),
		UIColor = require("UIKit/UIColor"),
		UITableView = require("UIKit/UITableView"),
		UITableViewCell = require("UIKit/UITableViewCell"),
		NSIndexPath = require("Foundation").NSIndexPath,
		UITableViewCellStyleDefault = require("UIKit").UITableViewCellStyleDefault;

	// Subclass delegate + data source
	var HLTableViewDelegate = Hyperloop.defineClass('HLTableViewDelegate', 'NSObject', 'UITableViewDelegate');
	var HLTableViewDataSource = Hyperloop.defineClass('HLTableViewDataSource', 'NSObject', 'UITableViewDataSource');

	HLTableViewDataSource.addMethod({
		signature: 'numberOfSectionsInTableView:',
		instance: true,
		arguments: ['UITableView'],
		returnType: 'long',
		callback: function (tableView) {
			return 3;
		}
	});

	HLTableViewDataSource.addMethod({
		signature: 'tableView:numberOfRowsInSection:',
		instance: true,
		arguments: ['UITableView', 'NSInteger'],
		returnType: 'long',
		callback: function (tableView, section) {
			return 5;
		}
	});

	HLTableViewDataSource.addMethod({
		signature: 'tableView:titleForHeaderInSection:',
		instance: true,
		arguments: ['UITableView', 'long'],
		returnType: 'NSString',
		callback: function (tableView, section) {
			return "Section " + (section + 1);
		}
	});

	HLTableViewDelegate.addMethod({
		signature: 'tableView:heightForRowAtIndexPath:',
		instance: true,
		arguments: ['UITableView', 'NSIndexPath'],
		returnType: 'CGFloat',
		callback: function (tableView, indexPath) {
			return 43;
		}
	});

	HLTableViewDataSource.addMethod({
		signature: 'tableView:cellForRowAtIndexPath:',
		instance: true,
		arguments: ['UITableView', 'NSIndexPath'],
		returnType: 'UITableViewCell',
		callback: function (tableView, indexPath) {
			var cell = UITableViewCell.cast(tableView.dequeueReusableCellWithIdentifierForIndexPath("Cell", indexPath));

			if (!cell) {
				cell = UITableViewCell.alloc().initWithStyleReuseIdentifier(UITableViewCellStyleDefault, "Cell");
			}

			cell.textLabel.setText("Cell " + (indexPath.row + 1));
			cell.setBackgroundColor(UIColor.greenColor());

			return cell;
		}
	});

	// Create + configure tableView
	var tableView = UITableView.alloc().initWithFrame(UIScreen.mainScreen().bounds);
	var delegate = new HLTableViewDelegate();
	var dataSource = new HLTableViewDataSource();

	// Assign delegate + data source
	tableView.setDelegate(delegate);
	tableView.setDataSource(dataSource);

	// Register cell identifier class (default)
	tableView.registerClassForCellReuseIdentifier(UITableViewCell.class(), "Cell");

	container.add(tableView);

})($.tableview_container);
