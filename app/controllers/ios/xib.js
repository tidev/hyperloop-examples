(function (container) {

	var NSBundle = require('Foundation/NSBundle');

	var view = NSBundle.mainBundle.loadNibNamedOwnerOptions('view');

	container.add(view.objectAtIndex(0));

})($.xib_container);
