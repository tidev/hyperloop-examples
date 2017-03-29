/**
 * Titanium Review Dialog (Hyperloop)
 * Version: 1.0.0
 */
 
var SKStoreReviewController = require('StoreKit/SKStoreReviewController');
var UIDevice = require('UIKit/UIDevice');
var NSNumericSearch = require('Foundation').NSNumericSearch;
var NSOrderedAscending = require('Foundation').NSOrderedAscending;

exports.isSupported = function() {
    return UIDevice.currentDevice.systemVersion.compareOptions('10.3', NSNumericSearch) != NSOrderedAscending;
};

exports.requestReview = function() {
    SKStoreReviewController.requestReview();
};
