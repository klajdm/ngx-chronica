import { ChronicaTimeFormat, ChronicaTimeRange, ChronicaTimeValue } from '../models';

/**
 * Time utility functions
 */
export class ChronicaTimeUtils {
  /**
   * Convert 24h to 12h format
   */
  static to12Hour(hours: number): { hours: number; period: 'AM' | 'PM' } {
    if (hours === 0) {
      return { hours: 12, period: 'AM' };
    } else if (hours < 12) {
      return { hours, period: 'AM' };
    } else if (hours === 12) {
      return { hours: 12, period: 'PM' };
    } else {
      return { hours: hours - 12, period: 'PM' };
    }
  }

  /**
   * Convert 12h to 24h format
   */
  static to24Hour(hours: number, period: 'AM' | 'PM'): number {
    if (period === 'AM') {
      return hours === 12 ? 0 : hours;
    } else {
      return hours === 12 ? 12 : hours + 12;
    }
  }

  /**
   * Format time value to string
   */
  static formatTime(time: ChronicaTimeValue, format: ChronicaTimeFormat = '24h'): string {
    if (format === '12h' && time.period) {
      const { hours: displayHours } = this.to12Hour(time.hours);
      const hoursStr = displayHours.toString().padStart(2, '0');
      const minutesStr = time.minutes.toString().padStart(2, '0');

      if (time.seconds !== undefined) {
        const secondsStr = time.seconds.toString().padStart(2, '0');
        return `${hoursStr}:${minutesStr}:${secondsStr} ${time.period}`;
      }

      return `${hoursStr}:${minutesStr} ${time.period}`;
    } else {
      const hoursStr = time.hours.toString().padStart(2, '0');
      const minutesStr = time.minutes.toString().padStart(2, '0');

      if (time.seconds !== undefined) {
        const secondsStr = time.seconds.toString().padStart(2, '0');
        return `${hoursStr}:${minutesStr}:${secondsStr}`;
      }

      return `${hoursStr}:${minutesStr}`;
    }
  }

  /**
   * Parse time string to ChronicaTimeValue
   */
  static parseTime(
    timeString: string,
    format: ChronicaTimeFormat = '24h'
  ): ChronicaTimeValue | null {
    const timeRegex =
      format === '12h'
        ? /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i
        : /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

    const match = timeString.trim().match(timeRegex);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = match[3] ? parseInt(match[3], 10) : undefined;
    const period = match[4] as 'AM' | 'PM' | undefined;

    if (format === '12h' && period) {
      hours = this.to24Hour(hours, period);
    }

    // Validate ranges
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }

    if (seconds !== undefined && (seconds < 0 || seconds > 59)) {
      return null;
    }

    return { hours, minutes, seconds, period };
  }

  /**
   * Get current time
   */
  static getCurrentTime(includeSeconds = false): ChronicaTimeValue {
    const now = new Date();
    const time: ChronicaTimeValue = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
    };

    if (includeSeconds) {
      time.seconds = now.getSeconds();
    }

    return time;
  }

  /**
   * Convert time to Date object (using today's date)
   */
  static timeToDate(time: ChronicaTimeValue, baseDate?: Date): Date {
    const date = baseDate ? new Date(baseDate) : new Date();
    date.setHours(time.hours);
    date.setMinutes(time.minutes);
    date.setSeconds(time.seconds || 0);
    date.setMilliseconds(0);
    return date;
  }

  /**
   * Extract time from Date object
   */
  static dateToTime(date: Date, includeSeconds = false): ChronicaTimeValue {
    const time: ChronicaTimeValue = {
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };

    if (includeSeconds) {
      time.seconds = date.getSeconds();
    }

    return time;
  }

  /**
   * Compare two time values
   */
  static compareTime(time1: ChronicaTimeValue, time2: ChronicaTimeValue): number {
    const date1 = this.timeToDate(time1);
    const date2 = this.timeToDate(time2);
    return date1.getTime() - date2.getTime();
  }

  /**
   * Check if time is in range
   */
  static isTimeInRange(time: ChronicaTimeValue, range: ChronicaTimeRange): boolean {
    if (!range.startTime || !range.endTime) return true;

    return (
      this.compareTime(time, range.startTime) >= 0 && this.compareTime(time, range.endTime) <= 0
    );
  }
}
