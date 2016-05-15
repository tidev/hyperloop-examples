var VolleyPackage = require("com.android.volley.*");
var JSONPackage = require("org.json.*");
var activity = new Activity(Ti.Android.currentActivity);

function startRequest() {

    var queue = VolleyPackage.toolbox.Volley.newRequestQueue(activity);
    var url ="https://appcelerator.com";

    var request = new VolleyPackage.toolbox.JsonObjectRequest(VolleyPackage.Request.Method.GET, url, 
        new VolleyPackage.Response.Listener({
            onResponse: function(response) {
                Ti.API.error("Response is: "+ response);

                alert("Request completed!");
                $.btn.setTitle("Start request!");
                $.btn.setEnabled(true);
            }
        }),
        new VolleyPackage.Response.ErrorListener({
            onErrrorResponse: function(error) {
                Ti.API.error("HTTP error");
            }
        })
    );

    $.btn.setEnabled(false);
    $.btn.setTitle("Loading ...");

    queue.add(stringRequest);
}