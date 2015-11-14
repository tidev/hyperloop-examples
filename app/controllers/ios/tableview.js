(function (container) {

	var UIScreen = require("UIKit/UIScreen"),
		UIColor = require("UIKit/UIColor"),
		UITableView = require("UIKit/UITableView"),
		UITableViewCell = require("UIKit/UITableViewCell"),
		NSIndexPath = require("Foundation").NSIndexPath,
		UITableViewCellStyleDefault = require("UIKit").UITableViewCellStyleDefault,
		UITableViewCellAccessoryDisclosureIndicator = require("UIKit").UITableViewCellAccessoryDisclosureIndicator

	// Subclass delegate + data source
	var TableViewDataSourceAndDelegate = require('subclasses/tableviewdatasourcedelegate')

	// Create + configure tableView
	var tableView = UITableView.alloc().initWithFrame(UIScreen.mainScreen().bounds);
	var dataSourceDelegate = new TableViewDataSourceAndDelegate();

	dataSourceDelegate.numberOfSections = function(tableView) {
		return 10;
	};
	dataSourceDelegate.numberOfRows = function(tableView, section) {
		if (Number(section) % 2) {
			return 5;
		} else {
			return 10;
		}
	};
	dataSourceDelegate.titleForHeader = function(tableView, section) {
		return 'Header for section ' + section;
	};
	dataSourceDelegate.heightForRow = function(tableView, indexPath) {
		return 44;
	};
	dataSourceDelegate.cellForRow = function(tableView, indexPath) {
		var cell = tableView.dequeueReusableCellWithIdentifier('hyperloop_cell');
	    if (!cell) {
	        cell = UITableViewCell.alloc().initWithStyleReuseIdentifier(UITableViewCellStyleDefault, 'hyperloop_cell');
	    }
	    // Set the data for this cell:
	    cell.textLabel.text = 'Row: ' + indexPath.row + ' Section:' + indexPath.section;
	    // set the accessory view:
	    cell.accessoryType =  UITableViewCellAccessoryDisclosureIndicator;
	    return cell;
	};

	// Assign delegate + data source
	tableView.setDelegate(dataSourceDelegate);
	tableView.setDataSource(dataSourceDelegate);
	
	container.add(tableView);

})($.tableview_container);
