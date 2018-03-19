import Activity from 'android.app.Activity';
import Context from 'android.content.Context';
import Inflater from 'android.view.LayoutInflater';

const activity = new Activity(Ti.Android.currentActivity);
    
(function (container) {
  const inflater = Inflater.cast(activity.getApplicationContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE));
  const view = inflater.inflate(resIDFromString('main_content', 'layout'), null);

  container.add(view);
})($.window);

// Utility method to get a resource ID from a string
function resIDFromString(variableName, resourceName) {
  return activity.getResources().getIdentifier(variableName, resourceName, activity.getPackageName());
}
