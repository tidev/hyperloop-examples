import VolleyPackage from 'com.android.volley.*';
import VolleyToolbox from 'com.android.volley.toolbox.*';
import Activity from 'android.app.Activity';

function startRequest() {
  const activity = new Activity(Ti.Android.currentActivity);
  const queue = VolleyToolbox.Volley.newRequestQueue(activity);
  const url = 'https://www.appcelerator.com';

  const request = new VolleyToolbox.StringRequest(VolleyPackage.Request.Method.GET, url,
      new VolleyPackage.Response.Listener({
          onResponse: (response) => {
              Ti.API.info('Response is: ' + response);

              alert('Request completed!');
              $.btn.setTitle('Start request!');
              $.btn.setEnabled(true);
          }
      }),
      new VolleyPackage.Response.ErrorListener({
          onErrrorResponse: (error) => {
              Ti.API.error('HTTP error');
          }
      })
  );

  $.btn.setEnabled(false);
  $.btn.setTitle('Loading ...');

  queue.add(request);
}
