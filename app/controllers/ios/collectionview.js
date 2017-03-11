(function (container) {

	var UIScreen = require('UIKit/UIScreen'),
	    UICollectionViewFlowLayout = require('UIKit/UICollectionViewFlowLayout'),
	    UIView = require('UIKit/UIView'),
	    UIColor = require('UIKit/UIColor'),
	    UICollectionView = require('UIKit/UICollectionView'),
	    UICollectionViewCell = require('UIKit/UICollectionViewCell'),
	    UIEdgeInsetsMake = require('UIKit').UIEdgeInsetsMake,
	    CGSizeMake = require('CoreGraphics').CGSizeMake,
	    CGRectMake = require('CoreGraphics').CGRectMake,
		colors = [],
		numberOfColors = 50;

	// Subclass delegate + data source
	var CollectionViewDataSourceAndDelegate = require('subclasses/collectionviewdatasourcedelegate')
	var dataSourceDelegate = new CollectionViewDataSourceAndDelegate();
    
	// Return the number of collection view cells
    dataSourceDelegate.numberOfCells = function(collectionView, indexPath) {
        return colors.length;
    };
    
	// Return the configured UICollectionViewCell
    dataSourceDelegate.cellForItem = function(collectionView, indexPath) {
        var cell = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath("Cell", indexPath);
        cell.backgroundColor = colors[indexPath.row];
        
        return cell;
    };
    
	// Triggered when we click on a certain cell
    dataSourceDelegate.didSelectItem = function(collectionView, indexPath) {
        var cell = collectionView.cellForItemAtIndexPath(indexPath);
        Ti.API.warn("Cell selected at Index = " + indexPath.row);
    };
    
	// Generate 500 colors
    for (var i = 0; i < 500; i++) {
        var hue = ((Math.random() * 4294967296) % 256 / 256.0);
        var saturation = ((Math.random() * 4294967296) % 128 / 256.0) + 0.5;
        var brightness = ((Math.random() * 4294967296) % 128 / 256.0) + 0.5;
        colors.push(UIColor.colorWithHueSaturationBrightnessAlpha(hue, saturation, brightness, 1));
    }
    
	// Calculate the cell specs 
    var screenRect = UIScreen.mainScreen.bounds;
    screenRect = CGRectMake(0, 0, UIScreen.mainScreen.bounds.size.width, UIScreen.mainScreen.bounds.size.height - 64);
    var cellWidth = screenRect.size.width / 3.0;
    
	// Create the cell layout and assign the size 
    var layout = new UICollectionViewFlowLayout()
    layout.sectionInset = UIEdgeInsetsMake(0, 0, 0, 0);
    layout.itemSize = CGSizeMake(cellWidth, cellWidth);
    layout.minimumLineSpacing = 0;
    layout.minimumInteritemSpacing = 0;
         
	// Create the UICollectionView, set the delegate, datasource and layout
    collectionView = UICollectionView.alloc().initWithFrameCollectionViewLayout(screenRect, layout);
    collectionView.registerClassForCellWithReuseIdentifier("UICollectionViewCell", "Cell");
    collectionView.backgroundColor = UIColor.clearColor;
    collectionView.setDataSource(dataSourceDelegate);
    collectionView.setDelegate(dataSourceDelegate);
    
	// Add the view to our Titanium Mobile view
	container.add(collectionView);

})($.container);
