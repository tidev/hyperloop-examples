var TableViewDataSourceAndDelegate = Hyperloop.defineClass('TableViewDataSourceAndDelegate', 'NSObject', ['UITableViewDelegate', 'UITableViewDataSource']);

TableViewDataSourceAndDelegate.addMethod({
	selector: 'numberOfSectionsInTableView:',
	instance: true,
	arguments: ['UITableView'],
	returnType: 'long',
	callback: function (tableView) {
		if (this.numberOfSections) {
			return this.numberOfSections(tableView);
		}
		return 1;
	}
});

TableViewDataSourceAndDelegate.addMethod({
	selector: 'tableView:numberOfRowsInSection:',
	instance: true,
	arguments: ['UITableView', 'NSInteger'],
	returnType: 'long',
	callback: function (tableView, section) {
		if (this.numberOfRows) {
			return this.numberOfRows(tableView, section);
		}
		return 1;
	}
});

TableViewDataSourceAndDelegate.addMethod({
	selector: 'tableView:titleForHeaderInSection:',
	instance: true,
	arguments: ['UITableView', 'long'],
	returnType: 'NSString',
	callback: function (tableView, section) {
		if (this.titleForHeader) {
			return this.titleForHeader(tableView, section);
		}
		return '';
	}
});

TableViewDataSourceAndDelegate.addMethod({
	selector: 'tableView:heightForRowAtIndexPath:',
	instance: true,
	arguments: ['UITableView', 'NSIndexPath'],
	returnType: 'CGFloat',
	callback: function (tableView, indexPath) {
		if (this.heightForRow) {
			return this.heightForRow(tableView, indexPath);
		}
		return 43;
	}
});

TableViewDataSourceAndDelegate.addMethod({
	selector: 'tableView:cellForRowAtIndexPath:',
	instance: true,
	arguments: ['UITableView', 'NSIndexPath'],
	returnType: 'UITableViewCell',
	callback: function (tableView, indexPath) {
		if (this.cellForRow) {
			return this.cellForRow(tableView, indexPath);
		}
		throw new Exception('TableViewDataSourceAndDelegate cellForRow(tableView, indexPath) missing');
	}
});

TableViewDataSourceAndDelegate.addMethod({
	selector: 'tableView:didSelectRowAtIndexPath:',
	instance: true,
	arguments: ['UITableView', 'NSIndexPath'],
	callback: function (tableView, indexPath) {
		if (this.didSelectRowAtIndexPath) {
			this.didSelectRowAtIndexPath(tableView, indexPath);
		}
	}
});

module.exports = TableViewDataSourceAndDelegate;