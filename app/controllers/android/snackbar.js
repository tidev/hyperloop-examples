(function (container) {
	var Snackbar = require('android.support.design.widget.Snackbar');

	$.button.addEventListener('click', function () {
		var	snack = Snackbar.make(container, "Hello world!", Snackbar.LENGTH_LONG);
		snack.show();
	});

})($.alert_container);
