import {
	UIScreen,
	UICollectionView,
	UICollectionViewFlowLayout,
	UIColor,
	UIKit
} from 'UIKit';

import { CoreGraphics } from 'CoreGraphics';
import { CollectionViewDataSourceAndDelegate } from '/subclasses/collectionviewdatasourcedelegate';

const UIEdgeInsetsMake = UIKit.UIEdgeInsetsMake;
const CGSizeMake = CoreGraphics.CGSizeMake;
const CGRectMake = CoreGraphics.CGRectMake;

(function (container) {
	// Subclass delegate + data source
	const dataSourceDelegate = new CollectionViewDataSourceAndDelegate();

	let colors = new Array();
	let collectionView;

	// Return the number of collection view cells
	dataSourceDelegate.numberOfCells = function(collectionView, indexPath) {
		return colors.length;
	};
	
	// Return the configured UICollectionViewCell
	dataSourceDelegate.cellForItem = function(collectionView, indexPath) {
		const cell = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath('Cell', indexPath);
		cell.backgroundColor = colors[indexPath.row];
		return cell;
	};

	// Triggered when we click on a certain cell
	dataSourceDelegate.didSelectItem = function(collectionView, indexPath) {
		const cell = collectionView.cellForItemAtIndexPath(indexPath);
		Ti.API.warn('Cell selected at Index = ' + indexPath.row);
	};

	// Generate 500 colors
	for (let i = 0; i < 500; i++) {
		const hue = ((Math.random() * 4294967296) % 256 / 256.0);
		const saturation = ((Math.random() * 4294967296) % 128 / 256.0) + 0.5;
		const brightness = ((Math.random() * 4294967296) % 128 / 256.0) + 0.5;
		colors.push(UIColor.colorWithHueSaturationBrightnessAlpha(hue, saturation, brightness, 1));
	}

	// Calculate the cell specs 
	const screenRect = CGRectMake(0, 0, UIScreen.mainScreen.bounds.size.width, UIScreen.mainScreen.bounds.size.height - 64);
	const cellWidth = screenRect.size.width / 3.0;

	// Create the cell layout and assign the size 
	const layout = new UICollectionViewFlowLayout()
	layout.sectionInset = UIEdgeInsetsMake(0, 0, 0, 0);
	layout.itemSize = CGSizeMake(cellWidth, cellWidth);
	layout.minimumLineSpacing = 0;
	layout.minimumInteritemSpacing = 0;

	// Create the UICollectionView, set the delegate, datasource and layout
	collectionView = UICollectionView.alloc().initWithFrameCollectionViewLayout(screenRect, layout);
	collectionView.registerClassForCellWithReuseIdentifier('UICollectionViewCell', 'Cell');
	collectionView.backgroundColor = UIColor.clearColor;
	collectionView.setDataSource(dataSourceDelegate);
	collectionView.setDelegate(dataSourceDelegate);

	// Add the view to our Titanium Mobile view
	container.add(collectionView);

})($.container);
