import { Localytics } from 'Localytics';

(function (container) {
	// Initialize SDK
	Localytics.autoIntegrateLaunchOptions(Alloy.CFG.services.localytics.apiKey, null);	
})($.container);

function tagProduct() {
	// Tag a sample product
	Localytics.tagPurchasedItemIdItemTypeItemPriceAttributes('Shirt', 'sku-123', 'Apparel', 15, []);
}
