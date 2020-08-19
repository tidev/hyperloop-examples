import BottomNavigationView from 'com.google.android.material.bottomnavigation.BottomNavigationView';
import Activity from 'android.app.Activity';
import LayoutParams from 'android.widget.FrameLayout.LayoutParams';
import ViewGroupLayoutParams from 'android.view.ViewGroup.LayoutParams';
import Gravity from 'android.view.Gravity';

const activity = new Activity(Ti.Android.currentActivity);

(function (container) {
  // Create a new instance by passing the current activity
  const bottomNav = new BottomNavigationView(activity);

  // Set the layout (in Ti-language: width = fill, height = size, bottom = 0)
  bottomNav.setLayoutParams(new LayoutParams(ViewGroupLayoutParams.MATCH_PARENT, ViewGroupLayoutParams.WRAP_CONTENT, Gravity.BOTTOM));
  
  // Optional: Handle reselection
  bottomNav.setOnNavigationItemReselectedListener(new BottomNavigationView.OnNavigationItemReselectedListener({
    onNavigationItemReselected: (menuItem) => {
      const message = 'Menu reselected to "' + menuItem.getTitle() + '"';

      Ti.API.info(message);
      $.stateLabel.text = message;

      return true;
    }
  }));

  // Optional: Handle selection
  bottomNav.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener({
    onNavigationItemSelected: (menuItem) => {
      const message = 'Menu item "' + menuItem.getTitle() + '" selected!';

      Ti.API.info(message);
      $.stateLabel.text = message;

      return true;
    }
  }));

  // Crazy stuff here! So how does this work?
  // Instead of using R.menu.tabs and R.colors.tabs_background_color, we use the programmatic approach to receive them
  // In the future, this may also be possible by Ti.App.Android.R.*, but thats not available so far.
  bottomNav.inflateMenu(resIDFromString('tabs', 'menu'));
  bottomNav.setItemBackgroundResource(resIDFromString('tabs_background_color', 'color')); 

  // Add a (5) badge on the 2nd tab item.
  // Note: This requires the app/activity to use a "Theme.MaterialComponents" based theme.
  var menuItemId = bottomNav.getMenu().getItem(1).getItemId();
  var badgeDrawable = bottomNav.getOrCreateBadge(menuItemId);
  badgeDrawable.setVisible(true);
  badgeDrawable.setNumber(5);

  // Uncomment to use custom item colors
  // 
  // const states = [
  //   [R.attr.state_enabled], // enabled
  //   [-R.attr.state_enabled], // disabled
  //   [-R.attr.state_checked], // unchecked
  //   [R.attr.state_pressed] // pressed
  // ];
  // 
  // const colors = [
  //   Color.WHITE,
  //   Color.GRAY,
  //   Color.GREEN,
  //   Color.BLUE
  // ];
  // 
  // bottomNav.setItemTextColor(new ColorStateList(states, colors));

  // Add it to your Titanium view!
  container.add(bottomNav);
})($.win);

// Utility method to get a resource ID from a string
function resIDFromString(variableName, resourceName) {
  return activity.getResources().getIdentifier(variableName, resourceName, activity.getPackageName());
}
