const CollectionViewDataSourceAndDelegate = Hyperloop.defineClass('CollectionViewDataSourceAndDelegate', 'NSObject', ['UICollectionViewDataSource', 'UICollectionViewDelegate', 'UICollectionViewDelegateFlowLayout']);

CollectionViewDataSourceAndDelegate.addMethod({
	selector: 'collectionView:numberOfItemsInSection:',
	instance: true,
	arguments: ['UICollectionView', 'long'],
	returnType: 'long',
	callback: function (collectionView, indexPath) {
		if (this.numberOfCells) {
			return this.numberOfCells(collectionView, indexPath);
		}
		return null;
	}
});
    
CollectionViewDataSourceAndDelegate.addMethod({
	selector: 'collectionView:cellForItemAtIndexPath:',
	instance: true,
	arguments: ['UICollectionView', 'NSIndexPath'],
	returnType: 'UICollectionViewCell',
	callback: function (collectionView, indexPath) {
		if (this.cellForItem) {
			return this.cellForItem(collectionView, indexPath);
		}
		return null;
	}
});
    
CollectionViewDataSourceAndDelegate.addMethod({
    selector: 'collectionView:didSelectItemAtIndexPath:',
    instance: true,
    arguments: ['UICollectionView', 'NSIndexPath'],
    callback: function (collectionView, indexPath) {
        if (this.didSelectItem) {
            this.didSelectItem(collectionView, indexPath);
        }
    }
});

export { CollectionViewDataSourceAndDelegate }
