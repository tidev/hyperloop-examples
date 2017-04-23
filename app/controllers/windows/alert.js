(function (container) {
    $.button.addEventListener('click', function () {
        var MessageDialog = require('Windows.UI.Popups.MessageDialog');
        var dialog = new MessageDialog('My Message');
        dialog.Title = 'My Title';
        dialog.ShowAsync().then(function () {
            $.notice.setText('Clicked!');
        });

    });
})($.alert_container);
