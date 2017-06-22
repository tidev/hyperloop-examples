(function (container) {

    var List = require('System.Collections.Generic.List<System.Int32>'),
        Int32 = require('System.Int32');

    var vec = new List();
    vec.Add(Int32.cast(0));
    vec.Add(Int32.cast(1));
    vec.Add(Int32.cast(2));

    $.notice.text   = 'BEFORE vec[1]: ' + vec[1] + '\n';
    vec[1] = 100;
    $.notice.text  += 'AFTER  vec[1]: ' + vec[1] + '\n';
    $.notice.text  += 'vec.IndexOf(Int32.cast(1))  : '   + vec.IndexOf(Int32.cast(1)) + '\n';
    $.notice.text  += 'vec.IndexOf(Int32.cast(100)): ' + vec.IndexOf(Int32.cast(100)) + '\n';

})($.win);
