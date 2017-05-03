(function (container) {
    $.button.addEventListener('click', function () {
        var MessageDialog = require('Windows.UI.Popups.MessageDialog'),
            UICommand = require('Windows.UI.Popups.UICommand'),
            PropertyValue = require('Windows.Foundation.PropertyValue'),
            Int32 = require('System.Int32');

        var dialog = new MessageDialog('My Message');
        dialog.Title = 'My Title';
        dialog.DefaultCommandIndex = 0;
        dialog.Commands.Add(new UICommand('OK', null, PropertyValue.CreateInt32(0)));
        dialog.Commands.Add(new UICommand('Cancel', null, PropertyValue.CreateInt32(1)));
        dialog.ShowAsync().then(function (command) {
            var id = Int32.cast(command.Id);
            alert((id == 0) ? 'Pushed "OK"' : 'Pushed "Cancel"')
        });
    });
})($.alert_container);
