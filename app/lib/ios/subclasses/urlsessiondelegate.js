var URLSessionDelegate = Hyperloop.defineClass('URLSessionDelegate', 'NSObject', ['NSURLSessionDelegate']);

URLSessionDelegate.addMethod({
    selector: 'session:didBecomeInvalidWithError:',
	instance: true,
	arguments: ['NSURLSession', 'NSError'],
	callback: function (session, error) {
		if (this.didBecomeInvalidWithError) {
			this.didBecomeInvalidWithError(session, error);
		}
	}
});

module.exports = URLSessionDelegate;