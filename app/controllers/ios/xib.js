import { NSBundle } from 'Foundation';

(function (container) {
	const view = NSBundle.mainBundle.loadNibNamedOwnerOptions('view');
	container.add(view.objectAtIndex(0));
})($.xib_container);
