
// Register UIApplicationDelegate API's for iOS
if (OS_IOS) {
    registerApplicationDelegate();
}

function registerApplicationDelegate() {
    const TiApp = require('Titanium/TiApp');

    // Create a new class to handle the delegate
    var ApplicationDelegate = Hyperloop.defineClass('TiAppApplicationDelegate', 'NSObject', 'UIApplicationDelegate');

    // Add the selector to handle the result
    ApplicationDelegate.addMethod({
        selector: 'application:didFinishLaunchingWithOptions:',
        instance: true,
        returnType: 'BOOL',
        arguments: [
            'UIApplication',
            'NSDictionary'
        ],
        callback: function(application, options) {
            if (this.didFinishLaunchingWithOptions) {
                return this.didFinishLaunchingWithOptions(application, options);
            }
            return true;
        }
    });

    // Add the selector to handle the result
    ApplicationDelegate.addMethod({
        selector: 'applicationDidEnterBackground:',
        instance: true,
        arguments: [
            'UIApplication'
        ],
        callback: function(application) {
            if (this.applicationDidEnterBackground) {
                this.applicationDidEnterBackground(application);
            }
        }
    });

    // Instantiate the delegate subclass
    var applicationDelegate = new ApplicationDelegate();

    // Called when the application finished launching. Initialize SDK's here for example
    applicationDelegate.didFinishLaunchingWithOptions = function (application, options) {
        Ti.API.warn('didFinishLaunchingWithOptions: called!');
        return true
    };

    applicationDelegate.applicationDidEnterBackground = function (application) {
        Ti.API.warn('applicationDidEnterBackground: called!');
    };

    TiApp.app().registerApplicationDelegate(ApplicationDelegate);
}