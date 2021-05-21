import { UIScreen, UITableView, UITableViewCell, UIKit } from 'UIKit';
import { TableViewDataSourceAndDelegate } from '/subclasses/tableviewdatasourcedelegate';

const UITableViewStyleGrouped = UIKit.UITableViewStyleGrouped;
const UITableViewCellStyleSubtitle = UIKit.UITableViewCellStyleSubtitle;
const UITableViewCellAccessoryDisclosureIndicator = UIKit.UITableViewCellAccessoryDisclosureIndicator;

(function (container) {	
	// Grabs the JSON-file from app/lib/static/data.json 
	const file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'static', 'data.json'); 
	const users = JSON.parse(file.read().text).users;

	// Create + configure tableView
	const tableView = UITableView.alloc().initWithFrameStyle(UIScreen.mainScreen.bounds, UITableViewStyleGrouped);
	const dataSourceDelegate = new TableViewDataSourceAndDelegate();

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
		let cell = tableView.dequeueReusableCellWithIdentifier('hyperloop_cell');
		const user = users[indexPath.row];

    if (!cell) {
        cell = UITableViewCell.alloc().initWithStyleReuseIdentifier(UITableViewCellStyleSubtitle, 'hyperloop_cell');
    }

		cell.textLabel.text = user.firstName + ' ' + user.lastName;
		cell.detailTextLabel.text = user.email; // NOTE: These are no real mail-addresses ;-)
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
