var AKFAccountKit = require("AccountKit/AKFAccountKit"),
    AKFResponseTypeAccessToken = require("AccountKit").AKFResponseTypeAccessToken,
    AKFPhoneNumber = require("AccountKit/AKFPhoneNumber"),
    NSLocale = require("Foundation/NSLocale"),
    NSLocaleCountryCode = require("Foundation/NSLocaleCountryCode"),
    NSUUID = require("Foundation/NSUUID"),
    TiApp = require("Titanium/TiApp"),
    delegate,
    accountKit;

(function (container) {    
    initialize();
})($.container);

function initialize() {
    if (!accountKit) {
        
        var AccountKitDelegate = require("subclasses/AccountKitDelegate");
        delegate = new AccountKitDelegate();
        
        delegate.viewControllerDidCancel = function(viewController) {
            Ti.API.warn("viewControllerDidCancel");
        };
        
        delegate.didCompleteLoginWithAccessToken = function(viewController, accessToken, state) {
            Ti.API.warn("didCompleteLoginWithAccessToken");
        };
        
        delegate.didCompleteLoginWithAuthorizationCode = function(viewController, authorizationCode, state) {
            Ti.API.warn("didCompleteLoginWithAuthorizationCode");
        };
        
        delegate.didFailWithError = function(viewController, error) {
            Ti.API.warn("didFailWithError");
        };
        
        accountKit = AKFAccountKit.alloc().initWithResponseType(AKFResponseTypeAccessToken);
    }
}

function loginWithPhone() {
    var phone = "+49 123 456 78";
    var inputState = NSUUID.UUID().UUIDString;
    
    var phoneNumber = AKFPhoneNumber.alloc().initWithCountryCodePhoneNumber("DE", phone);
    var viewController = accountKit.viewControllerForPhoneLoginWithPhoneNumberState(phoneNumber, inputState);
    viewController.setEnableSendToFacebook(true);
    viewController.setDelegate(delegate);
    
    TiApp.app().showModalController(viewController, true);
}

function loginWithEmail(e) {    
    var email = "john@doe.com";
    var inputState = NSUUID.UUID().UUIDString;
    
    var viewController = accountKit.viewControllerForEmailLoginWithEmailState(email, inputState);
    viewController.setDelegate(delegate);
    
    TiApp.app().showModalController(viewController, true);    
}