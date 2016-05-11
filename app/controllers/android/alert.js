(function (container) {
    var AndroidAppPkg = require('android.app.*'),
        AlertDialog = AndroidAppPkg.AlertDialog,
        Builder = AlertDialog.Builder,
        Activity = AndroidAppPkg.Activity,
        OnClickListener = require('android.content.DialogInterface.OnClickListener');

    $.button.addEventListener('click', function () {
        var builder = new Builder(new Activity(Titanium.App.Android.getTopActivity()));
        builder.setTitle('My Title').setMessage('My Message').setCancelable(false); // modal
        builder.setPositiveButton('OK', new OnClickListener({
            onClick: function(d, which) {
                $.notice.setText('Clicked!');
				Ti.API.warn(AndroidAppPkg);
            }
        }));
        builder.create().show();
    });

})($.alert_container);