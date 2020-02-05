import Snackbar from 'com.google.android.material.snackbar.Snackbar';

(function (container) {
	$.button.addEventListener('click', () => {
		const snack = Snackbar.make(container, 'Hello world!', Snackbar.LENGTH_LONG);
		snack.show();
	});
})($.alert_container);
