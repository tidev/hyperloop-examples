(function (container) {

	var UIScreen = require('UIKit/UIScreen'),
		UIColor = require('UIKit/UIColor'),
		UITableView = require('UIKit/UITableView'),
		UITableViewCell = require('UIKit/UITableViewCell'),
		NSIndexPath = require('Foundation').NSIndexPath,
		UITableViewStyleGrouped = require('UIKit').UITableViewStyleGrouped,
		UITableViewCellStyleSubtitle = require('UIKit').UITableViewCellStyleSubtitle,
		UITableViewCellAccessoryDisclosureIndicator = require('UIKit').UITableViewCellAccessoryDisclosureIndicator;
	
	// Grabs the JSON-file from app/lib/static/data.json 
	var file = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory() + 'static/data.json'); 
	var users = JSON.parse(file.read().text).users;
	
	// Subclass delegate + data source
	var TableViewDataSourceAndDelegate = require('/subclasses/tableviewdatasourcedelegate')

	// Create + configure tableView
	var tableView = UITableView.alloc().initWithFrameStyle(UIScreen.mainScreen.bounds, UITableViewStyleGrouped);
	var dataSourceDelegate = new TableViewDataSourceAndDelegate();

	dataSourceDelegate.numberOfSections = function(tableView) {
		return 1;
	};
	dataSourceDelegate.numberOfRows = function(tableView, section) {
		return users.length;
	};
	dataSourceDelegate.titleForHeader = function(tableView, section) {
		return 'Available users: ' + users.length;
	};
	dataSourceDelegate.heightForRow = function(tableView, indexPath) {
		return 44;
	};
	dataSourceDelegate.cellForRow = function(tableView, indexPath) {
		var cell = tableView.dequeueReusableCellWithIdentifier('hyperloop_cell');
		var user = users[indexPath.row];
				
	    if (!cell) {
	        cell = UITableViewCell.alloc().initWithStyleReuseIdentifier(UITableViewCellStyleSubtitle, 'hyperloop_cell');
	    }
		cell.textLabel.text = user.firstName + ' ' + user.lastName;
		cell.detailTextLabel.text = user.email; // NOTE: This are not real email-addresses ;-)
	    cell.accessoryType =  UITableViewCellAccessoryDisclosureIndicator;
		
	    return cell;
	};
	dataSourceDelegate.didSelectRowAtIndexPath = function(tableView, indexPath) {		
		alert('Call me maybe: ' + users[indexPath.row].phone);
		tableView.deselectRowAtIndexPathAnimated(indexPath, true);
	};

	// Assign delegate + data source
	tableView.setDelegate(dataSourceDelegate);
	tableView.setDataSource(dataSourceDelegate);

	container.add(tableView);

})($.tableview_container);
