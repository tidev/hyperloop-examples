(function (container) {

	var Canvas = require('Windows.UI.Xaml.Controls.Canvas'),
	    SolidColorBrush = require('Windows.UI.Xaml.Media.SolidColorBrush'),
	    Colors = require('Windows.UI.Colors'),
	    Storyboard = require('Windows.UI.Xaml.Media.Animation.Storyboard'),
	    DoubleAnimation = require('Windows.UI.Xaml.Media.Animation.DoubleAnimation'),
	    CubicEase = require('Windows.UI.Xaml.Media.Animation.CubicEase'),
	    EasingMode = require('Windows.UI.Xaml.Media.Animation.EasingMode'),
	    TimeSpan = require('System.TimeSpan'),
	    Duration = require('Windows.UI.Xaml.Duration');

	var box = new Canvas();
	box.Background = new SolidColorBrush(Colors.Red);
	box.Width = 50;
	box.Height = 50;
	container.add(box);

	// Do the animation
	var flag = false;
	$.button.addEventListener('click', () => {
		$.notice.setText('');
		flag = !flag;

	    var storyboard = new Storyboard(),
	        anim = new DoubleAnimation(),
	        ease = new CubicEase();

	    ease.EasingMode = EasingMode.EaseIn;

	    anim.From = flag ? 1 : 0;
	    anim.To   = flag ? 0 : 1;

	    anim.EasingFunction = ease;
	    anim.Duration = new Duration(TimeSpan.FromSeconds(5));
	    Storyboard.SetTargetProperty(anim, 'Opacity');
	    Storyboard.SetTarget(anim, box);
	    storyboard.Children.Add(anim);

	    storyboard.Begin();
	});

})($.animateview_container);
