exports.createWebView = function(args) {

    if (!OS_IOS) {
        return Ti.UI.createWebView(args);
    }

    var WKWebView = require("WebKit/WKWebView"),
        WKNavigation = require("WebKit/WKNavigation"),
        NSURLRequest = require("Foundation/NSURLRequest"),
        NSURL = require("Foundation/NSURL"),
        UIScreen = require("UIKit/UIScreen"),
        CGRectMake = require('CoreGraphics').CGRectMake;

    // function tht creates our delegate
    function createWebViewDelegate() {
        var WebViewDelegate = Hyperloop.defineClass('WebViewDelegate', 'NSObject', ['WKNavigationDelegate']);

        WebViewDelegate.addMethod({
            selector: 'webView:didFinishNavigation:',
            instance: true,
            arguments: ['WKWebView', 'WKNavigation'],
            callback: (webView, navigation) => {
                if (this.didFinishNavigation) {
                    this.didFinishNavigation(webView, navigation);
                }
            }
        });

        return WebViewDelegate;
    }

    // init a new WKWebView, plus delegate
    var webview = new WKWebView(),
        WebViewDelegate = createWebViewDelegate(),
        delegate = new WebViewDelegate();

    // Assign the deleate to the webview
    webview.setNavigationDelegate(delegate);

    // need an add event listener method for Ti & Alloy
    webview.addEventListener = function(event, handler) {
        webview[event] = handler;
    };

    // need a remove event listener method
    webview.removeEventListener = function(event, handler) {
        webview[event] = null;
        delete webview[event];
    };

    // need a fire event method
    webview.fireEvent = function(event, args) {
        webview[event] && webview[event](args);
    };

    // fire our load event -- you could also just do webView.load()
    delegate.didFinishNavigation = function(webview, navigation) {
        webview.fireEvent("load", {
            url: webview.URL
        });
    };

    // load the URL into the webview
    webview.loadRequest(NSURLRequest.alloc().initWithURL(NSURL.alloc().initWithString(args.url)));

    return webview;
};
