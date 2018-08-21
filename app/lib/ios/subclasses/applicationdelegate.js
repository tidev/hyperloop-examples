// Create a new class to handle the UIApplicationDelegate
const TiApplicationDelegate = Hyperloop.defineClass('TiApplicationDelegate', 'NSObject', ['UIApplicationDelegate']);

TiApplicationDelegate.addMethod({
    selector: 'application:didFinishLaunchingWithOptions:',
    instance: true,
    returnType: 'BOOL',
    arguments: [
        'UIApplication',
        'NSDictionary'
    ],
    callback: function(application, options) {
        alert('HI')
        if (this.didFinishLaunchingWithOptions) {
            return this.didFinishLaunchingWithOptions(application, options);
        }
        return true;
    }
});

module.exports = TiApplicationDelegate;