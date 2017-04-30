(function (container) {

    $.notice.text = 'Tap the red box';

    var Canvas = require('Windows.UI.Xaml.Controls.Canvas'),
        SolidColorBrush = require('Windows.UI.Xaml.Media.SolidColorBrush'),
        Colors = require('Windows.UI.Colors'),
        TranslateTransform = require('Windows.UI.Xaml.Media.TranslateTransform');

    var box = new Canvas();
    box.Background = new SolidColorBrush(Colors.Red);
    box.Width  = 250;
    box.Height = 250;

    box.addEventListener('Tapped', function (e) {
        $.notice.text = 'Tapped';
    });

    box.addEventListener('DoubleTapped', function (e) {
        $.notice.text = 'DoubleTapped';
    });

    box.addEventListener('Holding', function (e) {
        $.notice.text = 'Holding';
    });

    box.addEventListener('RightTapped', function (e) {
        $.notice.text = 'RightTapped';
    });

    box.addEventListener('PointerPressed', function (e) {
        $.notice.text = 'PointerPressed';
    });
    
    box.addEventListener('PointerReleased', function (e) {
        $.notice.text = 'PointerReleased';
    });

    box.addEventListener('PointerEntered', function (e) {
        $.notice.text = 'PointerEntered';
    });

    box.addEventListener('PointerExited', function (e) {
        $.notice.text = 'PointerExited';
    });

    container.add(box);

})($.touch_container);
