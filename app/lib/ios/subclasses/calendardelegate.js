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
var CalendarDelegate = Hyperloop.defineClass('CalendarDelegate', 'NSObject');

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
		range.backgroundColor = UIColor.redColor;
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

module.exports = CalendarDelegate;
