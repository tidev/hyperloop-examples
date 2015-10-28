(function (container) {

	var CGRectMake = require('CoreGraphics').CGRectMake,
		UIColor = require('UIKit/UIColor'),
		UIScreen = require('UIKit/UIScreen'),
		JBBarChartView = require('JBChartView/JBBarChartView');

	// create a custom delegate class that can receive dataSource and delegate
	// callbacks from the JBBarChartView
	var CustomChartDelegate = Hyperloop.defineClass('CustomChartDelegate');

	CustomChartDelegate.addMethod({
		selector: 'numberOfBarsInBarChartView:',
		instance: true,
		encoding: 'I@:@',
		callback: function(view) {
			return 3;
		}
	});

	CustomChartDelegate.addMethod({
		selector: 'barChartView:heightForBarViewAtIndex:',
		instance: true,
		encoding: 'd@:@I',
		callback: function(view, index) {
			// randomize the height
			return Math.max(10, Math.floor(100 * Math.random()));
		}
	});

	CustomChartDelegate.addMethod({
		selector: 'barChartView:colorForBarViewAtIndex:',
		instance: true,
		encoding: '@@:@I',
		callback: function(view, index) {
			// randomize the color for each bar
			var r = (Math.random() % 255);
			var g = (Math.random() % 255);
			var b = (Math.random() % 255);
			return UIColor.colorWithRedGreenBlueAlpha(r, g, b, 1);
		}
	});

	// create a new bar view
	var chart = new JBBarChartView();
	chart.minimumValue = 1;
	chart.maximumValue = 100;

	// create a delegate and datasource
	var delegate = new CustomChartDelegate();
	chart.delegate = delegate;
	chart.dataSource = delegate;

	// make the chart take up most of the screen bounds
	var bounds = UIScreen.mainScreen().bounds;
	chart.frame = CGRectMake(0, 0, bounds.size.width - 40, bounds.size.height - 100);

	// docs say we need to reload the data initially to cause it to paint
	chart.reloadData();

	// add the chart to the container
	container.add(chart);

})($.chart_container);
