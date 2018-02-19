var BottomNavigationView = require('android.support.design.widget.BottomNavigationView'),
    Activity = require('android.app.Activity'),
    LayoutParams = require('android.widget.FrameLayout.LayoutParams'),
    ViewGroupLayoutParams = require('android.view.ViewGroup.LayoutParams'),
    Color = require('android.graphics.Color'),
    Gravity = require('android.view.Gravity');
    ColorStateList = require('android.content.res.ColorStateList'),
    R = require('android.R');

var activity = new Activity(Ti.Android.currentActivity);

(function (container) {
  // Create a new instance by passing the current activity
  var bottomNav = new BottomNavigationView(activity);

  // Set the layout (in Ti-language: width = fill, height = size, bottom = 0)
  bottomNav.setLayoutParams(new LayoutParams(ViewGroupLayoutParams.MATCH_PARENT, ViewGroupLayoutParams.WRAP_CONTENT, Gravity.BOTTOM));
  
  // Optional: Handle reselection
  bottomNav.setOnNavigationItemReselectedListener(new BottomNavigationView.OnNavigationItemReselectedListener({
    onNavigationItemReselected: function(menuItem) {
      var message = 'Menu reselected to "' + menuItem.getTitle() + '"';

      Ti.API.info(message);
      $.stateLabel.setText(message);

      return true;
    }
  }));

  // Optional: Handle selection
  bottomNav.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener({
    onNavigationItemSelected: function(menuItem) {
      var message = 'Menu item "' + menuItem.getTitle() + '" selected!';

      Ti.API.info(message);
      $.stateLabel.setText(message);

      // TODO: Add more logic here to actually change the currently selected item / Titanium view as well

      return false;
    }
  }));

  // Crazy stuff here! So how does this work?
  //   1. You can search for the hex-values in build/android/gen/ti/modules/titanium/ui/R.java
  //   2. Convert the hex into a decimal number, e.g. using https://www.binaryhexconverter.com/hex-to-decimal-converter
  //   3. Insert the res-ID's below
  bottomNav.inflateMenu(2131689472); // HACKY HACKY -- USES THE RES-ID of app/platform/android/res/menu/tabs.xml
  bottomNav.setItemBackgroundResource(2131558401);  // HACKY HACKY -- USES THE RES-ID "tabs_background_color" of app/platform/android/res/values/colors.xml
  
  // Uncomment to use custom item colors
  // 
  // var states = [
  //   [R.attr.state_enabled], // enabled
  //   [-R.attr.state_enabled], // disabled
  //   [-R.attr.state_checked], // unchecked
  //   [R.attr.state_pressed] // pressed
  // ];
  // 
  // var colors = [
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
