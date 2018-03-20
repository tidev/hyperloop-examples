// Native classes
import { UIView, UIScreen, UIColor } from 'UIKit';
import CoreGraphics from 'CoreGraphics/CoreGraphics';
import NSDate from 'Foundation/NSDate';

// 3rd Party Native Classes
import { GLCalendarView, GLCalendarDateRange, GLDateUtils } from 'GLCalendarView';

// Delegate from app/lib/ios/subclasses/calendardelegate.js
import { CalendarDelegate } from '/subclasses/calendardelegate';

/**
 * Implementation of the GLCalendarView 3rd Party Library for iOS
 * using Appcelerator Hyperloop.
 *
 * Credits go to Glow-Inc (https://github.com/Glow-Inc/GLCalendarView)
 * for their great open source calendar!
 */
(function (container) {
	let currentSelectedRange;

	// Prepare native classes
	const calendar = new GLCalendarView();
	const delegate = new CalendarDelegate();

	// Get the screensize
	const bounds = UIScreen.mainScreen.bounds
	const frame = CoreGraphics.CGRectMake(0, 0, bounds.size.width, bounds.size.height);
	const today = NSDate.date();

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
