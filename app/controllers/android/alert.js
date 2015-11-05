(function (container) {
	var AlertDialog = require('android.app.AlertDialog'),
		Builder = require('android.app.AlertDialog.Builder'),
		Activity = require('android.app.Activity'),
		OnClickListener = require('android.content.DialogInterface.OnClickListener');

	$.button.addEventListener('click', function () {
		var	builder = new Builder(new Activity(Titanium.App.Android.getTopActivity()));
		builder.setTitle('My Title').setMessage('My Message').setCancelable(false); // modal
		builder.setPositiveButton('OK', new OnClickListener({
			onClick: function(d, which) {
				$.notice.setText('Clicked!');
			}
		}));
		builder.create().show();
	});

})($.alert_container);
