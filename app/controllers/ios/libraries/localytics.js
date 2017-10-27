var Localytics = require('Localytics/Localytics');

/**
 * Implementation of the GLCalendarView 3rd Party Library for iOS
 * using Appcelerator Hyperloop.
 *
 * Credits go to Glow-Inc (https://github.com/Glow-Inc/GLCalendarView)
 * for their great open source calendar!
 */
(function (container) {
	// Initialize SDK
	Localytics.autoIntegrateLaunchOptions(Alloy.CFG.services.localytics.apiKey, null);	
})($.container);

function tagProduct() {
	// Tag a sample product
	Localytics.tagPurchasedItemIdItemTypeItemPriceAttributes('Shirt', 'sku-123', 'Apparel', 15, []);
}
