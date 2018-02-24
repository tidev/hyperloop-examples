// create a custom delegate class that can receive dataSource and delegate
// callbacks from the JBBarChartView
var ChartDelegate = Hyperloop.defineClass('ChartDelegate');

ChartDelegate.addMethod({
	selector: 'numberOfBarsInBarChartView:',
	instance: true,
	returnType: 'int',
	arguments: [
		'UIView'
	],
	callback: (view) => {
		if (this.numberOfBars) {
			return this.numberOfBars(view);
		}
		Ti.API.error('ChartDelegate numberOfBars(view) callback missing');
		return 0;
	}
});

ChartDelegate.addMethod({
	selector: 'barChartView:heightForBarViewAtIndex:',
	instance: true,
	returnType: 'double',
	arguments: [
		'UIView',
		'int'
	],
	callback: (view, index) => {
		if (this.heightForBar) {
			return this.heightForBar(view, index);
		}
		Ti.API.error('ChartDelegate heightForBar(view, index) callback missing');
		return 0;
	}
});

ChartDelegate.addMethod({
	selector: 'barChartView:colorForBarViewAtIndex:',
	instance: true,
	returnType: 'UIColor',
	arguments: [
		'UIView',
		'unsigned int'
	],
	callback: (view, index) => {
		if (this.colorForBar) {
			return this.colorForBar(view, index);
		}
		Ti.API.error('ChartDelegate colorForBar(view, index) callback missing');
		UIColor = require('UIKit/UIColor');
		return UIColor.clearColor;
	}
});

module.exports = ChartDelegate;
