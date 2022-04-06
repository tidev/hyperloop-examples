import VolleyPackage from 'com.android.volley.*';
import VolleyToolbox from 'com.android.volley.toolbox.*';
import Activity from 'android.app.Activity';

function startRequest() {
	const activity = new Activity($.win.activity);
	const queue = VolleyToolbox.Volley.newRequestQueue(activity);
	const url = 'https://www.titaniumsdk.com';

	const request = new VolleyToolbox.StringRequest(VolleyPackage.Request.Method.GET, url,
		new VolleyPackage.Response.Listener({
			onResponse: (response) => {
				Ti.API.info('Response is: ' + response);
				alert('Request completed!');
				$.btn.title = 'Start request!';
				$.btn.enabled = true;
			}
		}),
		new VolleyPackage.Response.ErrorListener({
			onErrrorResponse: (error) => {
				Ti.API.error('HTTP error');
			}
		})
	);
	$.btn.enabled = false;
	$.btn.title = 'Loading ...';
	queue.add(request);
}
