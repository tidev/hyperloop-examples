import { MMMarkdown } from 'MMMarkdown';
let nav;

(function (args) {
	nav = args.nav;
})(arguments[0] || {});

function convertButtonTapped() {
	$.markdownField.blur();
	$.htmlField.value = MMMarkdown.HTMLStringWithMarkdownError($.markdownField.value, null);
}

function openInWebViewButtonTapped() {
	nav.openWindow(Alloy.createController('libraries/markdownResult', { html: $.htmlField.value }).getView());
}
