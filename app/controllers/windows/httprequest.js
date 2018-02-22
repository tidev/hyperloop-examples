function startRequest() {

    var HttpClient = require('Windows.Web.Http.HttpClient'),
        Uri = require('System.Uri'),
        httpclient = new HttpClient(),
        uri = new Uri('http://www.appcelerator.com/');

    httpclient.GetAsync(uri).then(function (response) {
        return response.Content.ReadAsStringAsync();
    }).then(
        function(content) {
            Ti.API.info('Response is: ' + content);
            alert('Request completed!');
            $.btn.setTouchEnabled(true);
            $.btn.setTitle('Start request!');
        },
        function (err) {
            Ti.API.error('HTTP error');
        });

    $.btn.setTouchEnabled(false);
    $.btn.setTitle('Loading ...');
}