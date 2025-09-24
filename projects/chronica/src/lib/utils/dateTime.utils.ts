import {
  ChronicaDateTimeConfig,
  ChronicaDateTimeRange,
  ChronicaDateTimeValidation,
  ChronicaDateTimeValidationError,
  ChronicaDateTimeValue,
  ChronicaTimeValue,
  DEFAULT_DATETIME_CONFIG,
} from '../models';

/**
 * DateTime utility functions
 */
export class ChronicaDateTimeUtils {
  /**
   * Combine date and time into a single Date object
   */
  static combineDateTime(date: Date | null, time: ChronicaTimeValue | null): Date | null {
    if (!date || !time) return null;

    const combined = new Date(date);
    combined.setHours(time.hours);
    combined.setMinutes(time.minutes);
    combined.setSeconds(time.seconds || 0);
    combined.setMilliseconds(0);

    return combined;
  }

  /**
   * Split Date object into date and time components
   */
  static splitDateTime(dateTime: Date | null): ChronicaDateTimeValue {
    if (!dateTime) {
      return { date: null, time: null };
    }

    const date = new Date(dateTime);
    date.setHours(0, 0, 0, 0); // Reset time to midnight

    const time: ChronicaTimeValue = {
      hours: dateTime.getHours(),
      minutes: dateTime.getMinutes(),
      seconds: dateTime.getSeconds(),
    };

    return { date, time };
  }

  /**
   * Format datetime value to string
   */
  static formatDateTime(
    dateTime: ChronicaDateTimeValue,
    config: ChronicaDateTimeConfig = DEFAULT_DATETIME_CONFIG
  ): string {
    if (!dateTime.date || !dateTime.time) return '';

    const dateStr = dateTime.date.toLocaleDateString();
    const timeStr = this.formatTimeComponent(dateTime.time, config.timeConfig?.timeFormat || '24h');

    return `${dateStr}${config.dateTimeSeparator || ' '}${timeStr}`;
  }

  /**
   * Format time component
   */
  private static formatTimeComponent(time: ChronicaTimeValue, format: '12h' | '24h'): string {
    const hoursStr = time.hours.toString().padStart(2, '0');
    const minutesStr = time.minutes.toString().padStart(2, '0');

    if (format === '12h') {
      const period = time.hours >= 12 ? 'PM' : 'AM';
      const displayHours = time.hours === 0 ? 12 : time.hours > 12 ? time.hours - 12 : time.hours;
      return `${displayHours.toString().padStart(2, '0')}:${minutesStr} ${period}`;
    }

    return `${hoursStr}:${minutesStr}`;
  }

  /**
   * Validate datetime value
   */
  static validateDateTime(
    dateTime: ChronicaDateTimeValue,
    config: ChronicaDateTimeConfig = DEFAULT_DATETIME_CONFIG
  ): ChronicaDateTimeValidation {
    const errors: ChronicaDateTimeValidationError[] = [];

    // Check if both components are required
    if (config.requireBoth) {
      if (!dateTime.date) errors.push('date-required');
      if (!dateTime.time) errors.push('time-required');
    }

    // Validate date component
    if (dateTime.date) {
      if (isNaN(dateTime.date.getTime())) {
        errors.push('invalid-date');
      } else {
        // Check date constraints from calendar config
        const calendarConfig = config.calendarConfig;
        if (calendarConfig?.minDate && dateTime.date < calendarConfig.minDate) {
          errors.push('min-date');
        }
        if (calendarConfig?.maxDate && dateTime.date > calendarConfig.maxDate) {
          errors.push('max-date');
        }
        if (
          calendarConfig?.disabledDates?.some((disabled) =>
            this.isSameDay(dateTime.date!, disabled)
          )
        ) {
          errors.push('disabled-date');
        }
      }
    }

    // Validate time component
    if (dateTime.time) {
      const { hours, minutes, seconds } = dateTime.time;

      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        errors.push('invalid-time');
      }

      if (seconds !== undefined && (seconds < 0 || seconds > 59)) {
        errors.push('invalid-time');
      }

      // Check time constraints from time config
      const timeConfig = config.timeConfig;
      if (timeConfig?.minHour !== undefined && hours < timeConfig.minHour) {
        errors.push('min-time');
      }
      if (timeConfig?.maxHour !== undefined && hours > timeConfig.maxHour) {
        errors.push('max-time');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get current datetime
   */
  static getCurrentDateTime(): ChronicaDateTimeValue {
    const now = new Date();
    return this.splitDateTime(now);
  }

  /**
   * Check if two dates are the same day
   */
  private static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  /**
   * Compare two datetime values
   */
  static compareDateTime(dt1: ChronicaDateTimeValue, dt2: ChronicaDateTimeValue): number {
    const combined1 = this.combineDateTime(dt1.date, dt1.time);
    const combined2 = this.combineDateTime(dt2.date, dt2.time);

    if (!combined1 && !combined2) return 0;
    if (!combined1) return -1;
    if (!combined2) return 1;

    return combined1.getTime() - combined2.getTime();
  }

  /**
   * Check if datetime is in range
   */
  static isDateTimeInRange(dateTime: ChronicaDateTimeValue, range: ChronicaDateTimeRange): boolean {
    if (!range.startDateTime || !range.endDateTime) return true;

    return (
      this.compareDateTime(dateTime, range.startDateTime) >= 0 &&
      this.compareDateTime(dateTime, range.endDateTime) <= 0
    );
  }

  /**
   * Create datetime value from separate components
   */
  static createDateTime(date?: Date, time?: ChronicaTimeValue): ChronicaDateTimeValue {
    return {
      date: date || null,
      time: time || null,
    };
  }

  /**
   * Clone datetime value
   */
  static cloneDateTime(dateTime: ChronicaDateTimeValue): ChronicaDateTimeValue {
    return {
      date: dateTime.date ? new Date(dateTime.date) : null,
      time: dateTime.time ? { ...dateTime.time } : null,
    };
  }
}
