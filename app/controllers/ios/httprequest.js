var UIApplication = require("UIKit/UIApplication");
var NSURL = require("Foundation/NSURL");
var NSURLSessionConfiguration = require("Foundation/NSURLSessionConfiguration");
var NSURLSession = require("Foundation/NSURLSession");

function startRequest() {
    var URLSessionDelegate = require("subclasses/urlsessiondelegate");
    var delegate = new URLSessionDelegate();
    var urlPath = NSURL.alloc().initWithString("https://appcelerator.com");
    var sessionConfiguration = NSURLSessionConfiguration.defaultSessionConfiguration();
    
    // Set request headers like `User-Agent` and `Authorization`
    sessionConfiguration.HTTPAdditionalHeaders = {"User-Agent" : "Appcelerator Hyperloop"};

    var session = NSURLSession.sessionWithConfigurationDelegateDelegateQueue(sessionConfiguration, delegate, null);
    var task = session.dataTaskWithURLCompletionHandler(urlPath, function(data, response, error) {
        UIApplication.sharedApplication().networkActivityIndicatorVisible = false

        alert("Request completed!");
        session.finishTasksAndInvalidate();
        $.btn.setTitle("Start request!");
        $.btn.setEnabled(true);
    });
    
    delegate.didBecomeInvalidWithError = function(session, error) {
        Ti.API.warn("Request did become invalid with error: " + error.localizedDescription);
        session.finishTasksAndInvalidate();
    };

    UIApplication.sharedApplication().networkActivityIndicatorVisible = true;
    $.btn.setEnabled(false);
    $.btn.setTitle("Loading ...");
    task.resume();
}