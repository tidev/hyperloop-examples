import Snackbar from 'android.support.design.widget.Snackbar';

(function (container) {
	$.button.addEventListener('click', () => {
		const snack = Snackbar.make(container, 'Hello world!', Snackbar.LENGTH_LONG);
		snack.show();
	});
})($.alert_container);
