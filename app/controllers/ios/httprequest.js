import { UIApplication } from 'UIKit';
import { NSURL, NSURLSession, NSURLSessionConfiguration } from 'Foundation';
import { URLSessionDelegate } from '/subclasses/urlsessiondelegate';

function startRequest() {
	const delegate = new URLSessionDelegate();
	const urlPath = NSURL.alloc().initWithString('https://titaniumsdk.com');
	const sessionConfiguration = NSURLSessionConfiguration.defaultSessionConfiguration;

	// Set request headers like `User-Agent` and `Authorization`
	sessionConfiguration.HTTPAdditionalHeaders = {'User-Agent' : 'TiDev Hyperloop'};

	const session = NSURLSession.sessionWithConfigurationDelegateDelegateQueue(sessionConfiguration, delegate, null);
	const task = session.dataTaskWithURLCompletionHandler(urlPath, (data, response, error) => {
		UIApplication.sharedApplication.networkActivityIndicatorVisible = false

		alert('Request completed!');
		session.finishTasksAndInvalidate();
		$.btn.title = 'Start request!';
		$.btn.enabled = true;
	});

	delegate.didBecomeInvalidWithError = function(session, error) {
		Ti.API.warn('Request did become invalid with error: ' + error.localizedDescription);
		session.finishTasksAndInvalidate();
	};

	UIApplication.sharedApplication.networkActivityIndicatorVisible = true;
	$.btn.enabled = false;
	$.btn.title = 'Loading ...';
	task.resume();
}
