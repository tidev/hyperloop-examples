(function (container) {

    var Canvas = require('Windows.UI.Xaml.Controls.Canvas'),
        SolidColorBrush = require('Windows.UI.Xaml.Media.SolidColorBrush'),
        Colors = require('Windows.UI.Colors'),
        TranslateTransform = require('Windows.UI.Xaml.Media.TranslateTransform');

    var box = new Canvas();
    box.Background = new SolidColorBrush(Colors.Red);
    box.Width = 50;
    box.Height = 50;

    box.addEventListener('Tapped', function (e) {
        var pos = e.GetPosition(null);
        Ti.API.info('Moving to ' + pos.X + ' : ' + pos.Y);
        var transform = new TranslateTransform();
        transform.X = pos.X;
        transform.Y = pos.Y;
        box.RenderTransform = transform;
    });

    container.add(box);
})($.touch_container);
