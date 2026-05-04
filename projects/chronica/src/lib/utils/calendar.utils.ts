import {
  CHRONICA_LOCALES,
  ChronicaCalendarConfig,
  ChronicaDate,
  ChronicaLocale,
  ChronicaMonth,
  DEFAULT_CALENDAR_CONFIG,
} from '../models';

/**
 * Calendar utility functions
 */
export class ChronicaCalendarUtils {
  /**
   * Check if a date is today
   */
  static isToday(date: Date): boolean {
    return this.isSameDate(date, new Date());
  }

  /**
   * Check if a date is a weekend
   */
  static isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }

  /**
   * Get the first day of the month
   */
  static getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  /**
   * Get the last day of the month
   */
  static getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  /**
   * Add months to a date
   */
  static addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }

  /**
   * Add days to a date
   */
  static addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  /**
   * Format date according to locale
   */
  static formatDate(date: Date, locale: ChronicaLocale): string {
    // Simple implementation - in real world, you'd use Intl.DateTimeFormat
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return locale.dateFormat.replace('dd', day).replace('MM', month).replace('yyyy', year);
  }

  /**
   * Strip time from a Date (normalize to local midnight)
   */
  static stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /**
   * Generates a calendar month with all dates
   */
  static generateCalendarMonth(
    year: number,
    month: number,
    config: ChronicaCalendarConfig = DEFAULT_CALENDAR_CONFIG
  ): ChronicaMonth {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = config.firstDayOfWeek || 0;

    // Calculate the first date to show (might be from previous month)
    const startDate = new Date(firstDayOfMonth);
    const dayOfWeek = (firstDayOfMonth.getDay() - firstDayOfWeek + 7) % 7;
    startDate.setDate(startDate.getDate() - dayOfWeek);

    // Calculate the last date to show (might be from next month)
    const endDate = new Date(lastDayOfMonth);
    const daysToAdd = 6 - ((lastDayOfMonth.getDay() - firstDayOfWeek + 7) % 7);
    endDate.setDate(endDate.getDate() + daysToAdd);

    const weeks: ChronicaDate[][] = [];
    const dates: ChronicaDate[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const week: ChronicaDate[] = [];

      for (let i = 0; i < 7; i++) {
        const calendarDate = this.createCalendarDate(currentDate, month, year, config);
        week.push(calendarDate);
        dates.push(calendarDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(week);
    }

    // Get locale for month name
    const locale = config.locale || CHRONICA_LOCALES['en-US'];
    const displayName = locale.monthNames[month];

    return {
      month,
      year,
      displayName,
      dates,
      weeks,
    };
  }

  /**
   * Creates a ChronicaDate object
   */
  static createCalendarDate(
    date: Date,
    currentMonth: number,
    currentYear: number,
    config: ChronicaCalendarConfig
  ): ChronicaDate {
    const stripped = this.stripTime(date);
    const today = this.stripTime(new Date());
    const isToday = this.isSameDate(stripped, today);
    const isInCurrentMonth = date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isDisabled = this.isDateDisabled(date, config);

    return {
      date: stripped,
      selected: false,
      isToday,
      inCurrentMonth: isInCurrentMonth,
      disabled: isDisabled,
      isWeekend,
    };
  }

  /**
   * Checks if a date is disabled based on config
   */
  static isDateDisabled(date: Date, config: ChronicaCalendarConfig): boolean {
    const d = this.stripTime(date);

    if (config.minDate && d.getTime() < this.stripTime(config.minDate).getTime()) {
      return true;
    }

    if (config.maxDate && d.getTime() > this.stripTime(config.maxDate).getTime()) {
      return true;
    }

    if (config.disabledDates) {
      return config.disabledDates.some((disabledDate) =>
        this.isSameDate(d, this.stripTime(disabledDate))
      );
    }

    return false;
  }

  /**
   * Checks if two dates are the same day
   */
  static isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Gets the day names based on first day of week setting
   */
  getDayNames(config: ChronicaCalendarConfig = DEFAULT_CALENDAR_CONFIG): string[] {
    const firstDayOfWeek = config.firstDayOfWeek || 0;
    const locale = config.locale || CHRONICA_LOCALES['en-US'];
    const dayNames = [...locale.dayNamesShort];

    if (firstDayOfWeek > 0) {
      return [...dayNames.slice(firstDayOfWeek), ...dayNames.slice(0, firstDayOfWeek)];
    }

    return dayNames;
  }

  /**
   * Gets the previous month/year
   */
  static getPreviousMonth(month: number, year: number): { month: number; year: number } {
    if (month === 0) {
      return { month: 11, year: year - 1 };
    }
    return { month: month - 1, year };
  }

  /**
   * Gets the next month/year
   */
  static getNextMonth(month: number, year: number): { month: number; year: number } {
    if (month === 11) {
      return { month: 0, year: year + 1 };
    }
    return { month: month + 1, year };
  }

  /**
   * Generates the 10 years that form the decade containing a given year
   */
  static generateDecadeGrid(centerYear: number): number[] {
    const startDecade = Math.floor(centerYear / 10) * 10;
    return Array.from({ length: 10 }, (_, i) => startDecade + i);
  }

  /**
   * Generates a year range centered around a given year
   */
  static updateYearRange(centerYear: number): number[] {
    const start = centerYear - 10;
    const end = centerYear + 10;
    const newYearRange: number[] = [];
    for (let year = start; year <= end; year++) {
      newYearRange.push(year);
    }

    return newYearRange;
  }
}
