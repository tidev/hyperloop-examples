import BottomNavigationView from 'com.google.android.material.bottomnavigation.BottomNavigationView';
import Activity from 'android.app.Activity';
import LayoutParams from 'android.widget.FrameLayout.LayoutParams';
import ViewGroupLayoutParams from 'android.view.ViewGroup.LayoutParams';
import Gravity from 'android.view.Gravity';

$.win.activity.onCreate = () => {
	// Create a new instance by passing the current activity
	const activity = new Activity($.win.activity);
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

	// Inflate this app's menu res file from: ./app/platform/android/res/menu/tabs.xml
	bottomNav.inflateMenu(Ti.App.Android.R.menu.tabs);
	bottomNav.setItemBackgroundResource(Ti.App.Android.R.color.tabs_background_color);

	// Add a (5) badge on the 2nd tab item.
	// Note: This requires the app/activity to use a "Theme.MaterialComponents" based theme.
	var menuItemId = bottomNav.getMenu().getItem(1).getItemId();
	var badgeDrawable = bottomNav.getOrCreateBadge(menuItemId);
	badgeDrawable.setVisible(true);
	badgeDrawable.setNumber(5);

	// Uncomment to use custom item colors
//	const states = [
//		[R.attr.state_enabled], // enabled
//		[-R.attr.state_enabled], // disabled
//		[-R.attr.state_checked], // unchecked
//		[R.attr.state_pressed] // pressed
//	];
//	const colors = [
//		Color.WHITE,
//		Color.GRAY,
//		Color.GREEN,
//		Color.BLUE
//	];
//	bottomNav.setItemTextColor(new ColorStateList(states, colors));

	// Add it to your Titanium view!
	$.win.add(bottomNav);
};
