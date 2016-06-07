var AccountKitDelegate = Hyperloop.defineClass('AccountKitDelegate', 'NSObject', ['AKFViewControllerDelegate']);

AccountKitDelegate.addMethod({
	selector: 'viewControllerDidCancel:',
	instance: true,
	arguments: ['UIViewController'],
	callback: function (viewController) {
		this.viewControllerDidCancel(viewController);
	}
});

AccountKitDelegate.addMethod({
	selector: 'viewController:didCompleteLoginWithAccessToken:state:',
	instance: true,
	arguments: ['UIViewController', 'id', 'NSString'],
	callback: function (viewController, accessToken, state) {
		this.didCompleteLoginWithAccessToken(viewController, accessToken, state);
	}
});

AccountKitDelegate.addMethod({
	selector: 'viewController:didFailWithError',
	instance: true,
	arguments: ['UIViewController', 'NSError'],
	callback: function (viewController, error) {
		this.didFailWithError(viewController, error);
	}
});

AccountKitDelegate.addMethod({
	selector: 'viewController:didCompleteLoginWithAuthorizationCode:state:',
	instance: true,
	arguments: ['UIViewController', 'NSString', 'NSString'],
	callback: function (viewController, code, state) {
		this.didCompleteLoginWithAuthorizationCode(viewController, code, state);
	}
});

module.exports = AccountKitDelegate;