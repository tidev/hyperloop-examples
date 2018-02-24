(function (container) {
    var Button = require("android.widget.Button"),
        LayoutParams = require('android.widget.FrameLayout.LayoutParams'),
        Activity = require('android.app.Activity'),
        Color = require('android.graphics.Color'),
        TypedValue = require('android.util.TypedValue'),
        Gravity = require('android.view.Gravity'),
        OnClickListener = require('android.view.View.OnClickListener'),
        currentActivity = new Activity(Ti.Android.currentActivity);

    // Create a new Button object with your current activity
    var button = new Button(currentActivity);

    // Set the width and height of the button layout
    // In this case, we created it density-specific to
    // look the same on different android-devices
    var width = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 200, currentActivity.getResources().getDisplayMetrics());
    var height = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 50, currentActivity.getResources().getDisplayMetrics());
    var layoutParams = new LayoutParams(width, height, Gravity.CENTER);
    button.setLayoutParams(layoutParams);

    // Set a blue background-color (also try Color.RED or Color.GREEN!)
    button.setBackgroundColor(Color.BLUE);

    // Set a button title
    button.setText("CLICK ME");

    // Register a click-listener to the button
    button.setOnClickListener(new OnClickListener({
        onClick: (v) => {
            alert("Button pressed!");
        }
    }));

    // Add it to your titanium-view
    container.add(button);

})($.window);
