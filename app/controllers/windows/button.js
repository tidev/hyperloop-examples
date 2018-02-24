(function (container) {
    var Button = require('Windows.UI.Xaml.Controls.Button'),
    SolidColorBrush = require('Windows.UI.Xaml.Media.SolidColorBrush'),
    Colors = require('Windows.UI.Colors');

    // Create a new Button object
    var button = new Button();

    // Set a blue foreground-color
    button.Foreground = new SolidColorBrush(Colors.Blue);

    // Set a button title
    button.Content = 'CLICK ME';

    // Register a Tapped-listener to the button
    button.addEventListener('Tapped', (e) => {
        alert("Button pressed!");
    });

    // Add it to your titanium-view
    container.add(button);

})($.window);
