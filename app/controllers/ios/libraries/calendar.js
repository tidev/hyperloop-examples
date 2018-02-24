/**
 * Implementation of the GLCalendarView 3rd Party Library for iOS
 * using Appcelerator Hyperloop.
 *
 * Credits go to Glow-Inc (https://github.com/Glow-Inc/GLCalendarView)
 * for their great open source calendar!
 */
(function (container) {

	// Require in core native classes
	var CGRectMake = require('CoreGraphics').CGRectMake,
		UIView = require('UIKit/UIView'),
		UIScreen = require('UIKit/UIScreen'),
		UIColor = require('UIKit/UIColor'),
		NSDate = require('Foundation/NSDate');

	// Require in 3rd Party Native Classes
	var GLCalendarView = require('GLCalendarView/GLCalendarView'),
		GLCalendarDateRange = require('GLCalendarView/GLCalendarDateRange'),
		GLDateUtils = require('GLCalendarView/GLDateUtils');

	var calendar, delegate, currentSelectedRange;
	var CalendarDelegate = require('/subclasses/calendardelegate');

	// Get the screensize
	var bounds = UIScreen.mainScreen.bounds
	var frame = CGRectMake(0, 0, bounds.size.width, bounds.size.height);
	var today = NSDate.date();
	calendar = new GLCalendarView();
	delegate = new CalendarDelegate();

	// Setup the GLCalendarView
	calendar.frame = frame;
	calendar.delegate = delegate;
	calendar.firstDate = GLDateUtils.dateByAddingDaysToDate(-182, today);
	calendar.lastDate = GLDateUtils.dateByAddingDaysToDate(182, today);

	// Add GLCalendarView to the Titanium View container
	container.add(calendar);
	calendar.reload();

	/**
	 * Add Click Event Listener for the Right Nav Button
	 * This event listener scrolls the calendar to the current day of the calendar.
	 */
	// $.deleteButton.addEventListener('click', removeCurrentRange);

	/**
	 * Removes the currently selected range from the CalendarView
	 */
	function removeCurrentRange() {
		if (currentSelectedRange) {
			calendar.removeRange(currentSelectedRange);
			currentSelectedRange = null;
		}
	}

	/**
	 * Scroll to Today's date once the view is loaded.
	 */
	container.addEventListener('postlayout', (e) => {
		calendar.scrollToDateAnimated(today, false);
	});

})($.calendar_container);
