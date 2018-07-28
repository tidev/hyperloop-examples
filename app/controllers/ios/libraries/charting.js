import { UIColor, UIScreen } from 'UIKit';
import { CoreGraphics } from 'CoreGraphics';
import { JBBarChartView } from 'JBChartView/JBBarChartView';
import { ChartDelegate } from '/subclasses/chartdelegate';

const CGRectMake = CoreGraphics.CGRectMake;

(function (container) {
	// create a new bar view
	const chart = new JBBarChartView();
	const bounds = UIScreen.mainScreen.bounds;

	chart.minimumValue = 1;
	chart.maximumValue = 100;

	// create a delegate and datasource
	const delegate = new ChartDelegate();
	delegate.numberOfBars = function (view) {
		return 3;
	};

	delegate.heightForBar = function (view, index) {
		return Math.max(10, Math.floor(100 * Math.random()));
	};

	delegate.colorForBar = function (view, index) {
		// randomize the color for each bar
		const r = (Math.random() % 255);
		const g = (Math.random() % 255);
		const b = (Math.random() % 255);
		return UIColor.colorWithRedGreenBlueAlpha(r, g, b, 1);
	};

	chart.delegate = delegate;
	chart.dataSource = delegate;

	// make the chart take up most of the screen bounds
	chart.frame = CGRectMake(20, 0, bounds.size.width - 40, bounds.size.height - 100);

	// docs say we need to reload the data initially to cause it to paint
	chart.reloadData();

	// add the chart to the container
	container.add(chart);
})($.chart_container);
