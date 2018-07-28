import { SKStoreReviewController } from 'StoreKit';
import { UIDevice } from 'UIKit';
import { Foundation } from 'Foundation';

const isSupported = () => {
    return UIDevice.currentDevice.systemVersion.compareOptions('10.3', Foundation.NSNumericSearch) !== Foundation.NSOrderedAscending;
};

const requestReview = () => {
    SKStoreReviewController.requestReview();
};

export { isSupported, requestReview }
