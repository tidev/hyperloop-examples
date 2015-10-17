/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	$.navWin.open();

})(arguments[0] || {});

function onListViewItemclick(e) {

	// We've set the items special itemId-property to the controller name 
	var controllerName = e.itemId;

	// Which we use to create the controller, get the window and open it in the navigation window
	// See lib/xp.ui.js to see how we emulate this component for Android
	$.navWin.openWindow(Alloy.createController(controllerName).getView());
}