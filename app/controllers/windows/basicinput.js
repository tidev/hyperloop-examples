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

    box.addEventListener('Tapped', (e) => {
        $.notice.text = 'Tapped';
    });

    box.addEventListener('DoubleTapped', (e) => {
        $.notice.text = 'DoubleTapped';
    });

    box.addEventListener('Holding', (e) => {
        $.notice.text = 'Holding';
    });

    box.addEventListener('RightTapped', (e) => {
        $.notice.text = 'RightTapped';
    });

    box.addEventListener('PointerPressed', (e) => {
        $.notice.text = 'PointerPressed';
    });
    
    box.addEventListener('PointerReleased', (e) => {
        $.notice.text = 'PointerReleased';
    });

    box.addEventListener('PointerEntered', (e) => {
        $.notice.text = 'PointerEntered';
    });

    box.addEventListener('PointerExited', (e) => {
        $.notice.text = 'PointerExited';
    });

    container.add(box);

})($.touch_container);
