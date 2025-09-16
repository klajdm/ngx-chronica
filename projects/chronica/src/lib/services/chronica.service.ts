import { Injectable } from '@angular/core';
import {
  CalendarDate,
  CalendarMonth,
  CalendarWeek,
  CalendarConfig,
  DEFAULT_CALENDAR_CONFIG,
  MONTH_NAMES,
  DAY_NAMES_SHORT,
} from '../models/chronica.models';

@Injectable({
  providedIn: 'root',
})
export class ChronicaService {
  constructor() {}

  /**
   * Strip time from a Date (normalize to local midnight)
   */
  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /**
   * Generates a calendar month with all dates
   */
  generateCalendarMonth(
    year: number,
    month: number,
    config: CalendarConfig = DEFAULT_CALENDAR_CONFIG
  ): CalendarMonth {
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

    const weeks: CalendarWeek[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const week: CalendarWeek = { dates: [] };

      for (let i = 0; i < 7; i++) {
        const calendarDate = this.createCalendarDate(currentDate, year, month, config);
        week.dates.push(calendarDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(week);
    }

    return {
      month,
      year,
      name: MONTH_NAMES[month],
      weeks,
    };
  }

  /**
   * Creates a CalendarDate object
   */
  private createCalendarDate(
    date: Date,
    currentMonth: number,
    currentYear: number,
    config: CalendarConfig
  ): CalendarDate {
    const today = this.stripTime(new Date());
    const isToday = this.isSameDate(this.stripTime(date), today);
    const isInCurrentMonth = date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isDisabled = this.isDateDisabled(date, config);

    return {
      date: this.stripTime(new Date(date)),
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      isToday,
      isSelected: false,
      isDisabled,
      isInCurrentMonth,
      isWeekend,
    };
  }

  /**
   * Checks if a date is disabled based on config
   */
  private isDateDisabled(date: Date, config: CalendarConfig): boolean {
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
  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Gets the day names based on first day of week setting
   */
  getDayNames(config: CalendarConfig = DEFAULT_CALENDAR_CONFIG): string[] {
    const firstDayOfWeek = config.firstDayOfWeek || 0;
    const dayNames = [...DAY_NAMES_SHORT];

    if (firstDayOfWeek > 0) {
      const rotated = dayNames.splice(firstDayOfWeek);
      return [...rotated, ...dayNames];
    }

    return dayNames;
  }

  /**
   * Formats a date according to locale
   */
  formatDate(date: Date, locale: string = 'en-US'): string {
    return date.toLocaleDateString(locale);
  }

  /**
   * Gets the previous month/year
   */
  getPreviousMonth(month: number, year: number): { month: number; year: number } {
    if (month === 0) {
      return { month: 11, year: year - 1 };
    }
    return { month: month - 1, year };
  }

  /**
   * Gets the next month/year
   */
  getNextMonth(month: number, year: number): { month: number; year: number } {
    if (month === 11) {
      return { month: 0, year: year + 1 };
    }
    return { month: month + 1, year };
  }
}
