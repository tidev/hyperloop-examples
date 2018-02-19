var Activity = require('android.app.Activity'),
    Context = require('android.content.Context'),
    Inflater = require('android.view.LayoutInflater'),
    activity = new Activity(Ti.Android.currentActivity);
    
(function (container) {
  var inflater = Inflater.cast(activity.getApplicationContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE));
  var view = inflater.inflate(resIDFromString('main_content', 'layout'), null);

  container.add(view);
})($.window);

// Utility method to get a resource ID from a string
function resIDFromString(variableName, resourceName) {
  return activity.getResources().getIdentifier(variableName, resourceName, activity.getPackageName());
}
