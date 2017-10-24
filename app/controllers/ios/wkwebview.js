
(function constructor(args) {
  $.loader.show();
})(arguments[0] || {});

function onLoad(e) {
    $.loader.hide();
}
