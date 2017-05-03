(function (container) {

    // convenience function for converting an angle in degrees to radians
    function DEGREES_TO_RADIANS(angle) { return (Number(angle) / 180.0 * Math.PI); };

    var Canvas = require('Windows.UI.Xaml.Controls.Canvas'),
        GeometryGroup = require('Windows.UI.Xaml.Media.GeometryGroup'),
        LineGeometry = require('Windows.UI.Xaml.Media.LineGeometry'),
        Path = require('Windows.UI.Xaml.Shapes.Path'),
        Point = require('Windows.Foundation.Point'),
        Window = require('Windows.UI.Xaml.Window'),
        SolidColorBrush = require('Windows.UI.Xaml.Media.SolidColorBrush'),
        Colors = require('Windows.UI.Colors');

    var canvas = new Canvas();
    canvas.Background = new SolidColorBrush(Colors.White);
    canvas.Width  = Window.Current.Bounds.Width;
    canvas.Height = Window.Current.Bounds.Height;

    var path = new Path();
    path.StrokeThickness = 4.0;
    path.Stroke = new SolidColorBrush(Colors.Blue);

    var group = new GeometryGroup(),
        centerX = canvas.Width  / 2,
        centerY = canvas.Height / 2,
        radius  = canvas.Width  / 2,
        beams = 9,
        thisAngle = 0,
        sliceDegrees = 360 / beams / 2;

    for (var i = 0; i < beams; i++) {

        var x = radius * Math.cos(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerX;
        var y = radius * Math.sin(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerY;

        var line = new LineGeometry();
        line.StartPoint = new Point(centerX, centerY);
        line.EndPoint   = new Point(x, y);
        group.Children.Add(line);

        thisAngle += sliceDegrees;

        var x2 = radius * Math.cos(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerX;
        var y2 = radius * Math.sin(DEGREES_TO_RADIANS(thisAngle + sliceDegrees)) + centerY;

        line = new LineGeometry();
        line.StartPoint = new Point(x, y);
        line.EndPoint = new Point(x2, y2);
        group.Children.Add(line);

        line = new LineGeometry();
        line.StartPoint = new Point(x2, y2);
        line.EndPoint = new Point(centerX, centerY);
        group.Children.Add(line);

        thisAngle += sliceDegrees;
    }

    path.Data = group;

    canvas.Children.Add(path);

    container.add(canvas);

})($.rect_container);
