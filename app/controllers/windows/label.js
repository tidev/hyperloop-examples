(function (container) {
	var infoString = 'We ♥ Windows';

	var TextBlock = require('Windows.UI.Xaml.Controls.TextBlock'),
	    VerticalAlignment = require('Windows.UI.Xaml.VerticalAlignment'),
	    SolidColorBrush = require('Windows.UI.Xaml.Media.SolidColorBrush'),
	    Colors = require('Windows.UI.Colors'),
	    FontFamily = require('Windows.UI.Xaml.Media.FontFamily');

	var label = new TextBlock();
	label.Text = infoString;
	label.VerticalAlignment = VerticalAlignment.Center;
	label.FontSize = 24;
	label.Foreground = new SolidColorBrush(Colors.Red);
	label.FontFamily = new FontFamily('Comic Sans MS');

	container.add(label);

})($.label_container);
