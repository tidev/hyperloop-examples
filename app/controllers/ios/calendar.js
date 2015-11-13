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

	/**
	 * Create a native class to act as the delegate of the GLCalendarView.
	 * A delegate is similar to an Alloy javascript controller file for the XML
	 * view. It is responsible for interacting with the UI elements.
	 *
	 * GLCalendarView Obj- C Delegate Protocol Reference
	 * =================================================
	 * @protocol GLCalendarViewDelegate <NSObject>
	 * - (BOOL)calenderView:(GLCalendarView *)calendarView canAddRangeWithBeginDate:(NSDate *)beginDate;
	 * - (GLCalendarDateRange *)calenderView:(GLCalendarView *)calendarView rangeToAddWithBeginDate:(NSDate *)beginDate;
	 * - (void)calenderView:(GLCalendarView *)calendarView beginToEditRange:(GLCalendarDateRange *)range;
	 * - (void)calenderView:(GLCalendarView *)calendarView finishEditRange:(GLCalendarDateRange *)range continueEditing:(BOOL)continueEditing;
	 * - (BOOL)calenderView:(GLCalendarView *)calendarView canUpdateRange:(GLCalendarDateRange *)range toBeginDate:(NSDate *)beginDate endDate:(NSDate *)endDate;
	 * - (void)calenderView:(GLCalendarView *)calendarView didUpdateRange:(GLCalendarDateRange *)range toBeginDate:(NSDate *)beginDate endDate:(NSDate *)endDate;
	 * @optional
	 * - (NSArray *)weekDayTitlesForCalendarView:(GLCalendarView *)calendarView;
	 * @end
	 */
	var CalendarDelegate = Hyperloop.defineClass('CalendarDelegate', 'NSObject'/*,'GLCalendarViewDelegate'*/);


	/**
	 * Implement the required delegate methods that are defined by the
	 * GLCalendarView
	 */
	CalendarDelegate.addMethod({
		selector: 'calenderView:canAddRangeWithBeginDate:',
		instance: true,
		returnType: 'BOOL',
		arguments: [
			'GLCalendarView',
			'NSDate'
		],
		callback: function (view, beginDate) {
			return true;
		}
	});

	CalendarDelegate.addMethod({
		selector: 'calenderView:rangeToAddWithBeginDate:',
		instance: true,
		returnType: 'GLCalendarDateRange',
		arguments: [
			'GLCalendarView',
			'NSDate'
		],
		callback: function (calendarView, beginDate) {
			Ti.API.info(beginDate);

			var endDate = GLDateUtils.dateByAddingDaysToDate(2, beginDate);
			var range = GLCalendarDateRange.rangeWithBeginDateEndDate(beginDate, endDate);
			range.backgroundColor = UIColor.redColor();
			range.editable = true;

			return range;
		}
	});

	CalendarDelegate.addMethod({
		selector: 'calenderView:beginToEditRange:',
		instance: true,
		arguments: [
			'GLCalendarView',
			'NSDate'
		],
		callback: function (view, range) {
			Ti.API.info('calenderView:beginToEditRange:');
			currentSelectedRange = range;
		}
	});

	CalendarDelegate.addMethod({
		selector: 'calenderView:finishEditRange:continueEditing:',
		instance: true,
		arguments: [
			'GLCalendarView',
			'NSDate',
			'BOOL'
		],
		callback: function (view, range, continueEditing) {
			currentSelectedRange = null;
		}
	});

	CalendarDelegate.addMethod({
		selector: 'calenderView:canUpdateRange:toBeginDate:endDate:',
		instance: true,
		returnType: 'BOOL',
		arguments: [
			'GLCalendarView',
			'GLCalendarDateRange',
			'NSDate',
			'NSDate'
		],
		callback: function (view, range, beginDate, endDate) {
			return true;
		}
	});

	CalendarDelegate.addMethod({
		selector: 'calenderView:didUpdateRange:toBeginDate:endDate:',
		instance: true,
		arguments: [
			'GLCalendarView',
			'GLCalendarDateRange',
			'NSDate',
			'NSDate'
		],
		callback: function (view, range, beginDate, endDate) {
			Ti.API.info('Did Update Range' + range);
			return;
		}
	});

	// Get the screensize
	var bounds = UIScreen.mainScreen().bounds
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
	container.addEventListener('postlayout', function (e) {
		calendar.scrollToDateAnimated(today, false);
	});

})($.calendar_container);
