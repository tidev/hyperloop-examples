(function (container) {

    var KeyboardCapabilities = require('Windows.Devices.Input.KeyboardCapabilities'),
        MouseCapabilities    = require('Windows.Devices.Input.MouseCapabilities'),
        TouchCapabilities    = require('Windows.Devices.Input.TouchCapabilities');

    var kbdCapabilities   = new KeyboardCapabilities();
    $.notice1.text =  'Keyboard present = ' + kbdCapabilities.KeyboardPresent;

    var mouseCapabilities = new MouseCapabilities();
    $.notice2.text = 'Mouse present = ' + mouseCapabilities.MousePresent + '\n'
        + 'Number of buttons = ' + mouseCapabilities.NumberOfButtons + '\n'
        + 'Vertical wheel present = ' + mouseCapabilities.VerticalWheelPresent + '\n'
        + 'Horizontal wheel present = ' + mouseCapabilities.HorizontalWheelPresent + '\n'
        + 'Buttons swapped = ' + mouseCapabilities.SwapButtons;

    var touchCapabilities = new TouchCapabilities();
    $.notice3.text = 'Touch present = ' + touchCapabilities.TouchPresent + '\n'
        + 'Touch contacts supported = ' + touchCapabilities.Contacts;

})($.win);
