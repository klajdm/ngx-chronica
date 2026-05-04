import { ChronicaCalendarUtils } from './calendar.utils';
import { CHRONICA_LOCALES } from '../models';

describe('ChronicaCalendarUtils', () => {
  const d = (y: number, m: number, day: number) => new Date(y, m, day);

  // ─── isSameDate ────────────────────────────────────────────────────────────
  describe('isSameDate', () => {
    it('returns true for identical dates', () => {
      expect(ChronicaCalendarUtils.isSameDate(d(2024, 4, 15), d(2024, 4, 15))).toBeTrue();
    });
    it('ignores time component', () => {
      const a = new Date(2024, 4, 15, 10, 30);
      const b = new Date(2024, 4, 15, 22, 0);
      expect(ChronicaCalendarUtils.isSameDate(a, b)).toBeTrue();
    });
    it('returns false for different day', () => {
      expect(ChronicaCalendarUtils.isSameDate(d(2024, 4, 15), d(2024, 4, 16))).toBeFalse();
    });
    it('returns false for different month', () => {
      expect(ChronicaCalendarUtils.isSameDate(d(2024, 4, 15), d(2024, 5, 15))).toBeFalse();
    });
    it('returns false for different year', () => {
      expect(ChronicaCalendarUtils.isSameDate(d(2024, 4, 15), d(2025, 4, 15))).toBeFalse();
    });
  });

  // ─── isToday ───────────────────────────────────────────────────────────────
  describe('isToday', () => {
    it('returns true for today', () => {
      expect(ChronicaCalendarUtils.isToday(new Date())).toBeTrue();
    });
    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(ChronicaCalendarUtils.isToday(yesterday)).toBeFalse();
    });
    it('returns false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(ChronicaCalendarUtils.isToday(tomorrow)).toBeFalse();
    });
  });

  // ─── isWeekend ─────────────────────────────────────────────────────────────
  describe('isWeekend', () => {
    it('returns true for Sunday', () => {
      expect(ChronicaCalendarUtils.isWeekend(new Date(2024, 4, 5))).toBeTrue(); // Sun May 5 2024
    });
    it('returns true for Saturday', () => {
      expect(ChronicaCalendarUtils.isWeekend(new Date(2024, 4, 4))).toBeTrue(); // Sat May 4 2024
    });
    it('returns false for Monday', () => {
      expect(ChronicaCalendarUtils.isWeekend(new Date(2024, 4, 6))).toBeFalse(); // Mon May 6 2024
    });
    it('returns false for Friday', () => {
      expect(ChronicaCalendarUtils.isWeekend(new Date(2024, 4, 10))).toBeFalse(); // Fri May 10 2024
    });
  });

  // ─── getFirstDayOfMonth ────────────────────────────────────────────────────
  describe('getFirstDayOfMonth', () => {
    it('returns day 1 of the same month/year', () => {
      const result = ChronicaCalendarUtils.getFirstDayOfMonth(d(2024, 4, 15));
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(4);
      expect(result.getFullYear()).toBe(2024);
    });
    it('returns day 1 when given the last day', () => {
      const result = ChronicaCalendarUtils.getFirstDayOfMonth(d(2024, 4, 31));
      expect(result.getDate()).toBe(1);
    });
  });

  // ─── getLastDayOfMonth ─────────────────────────────────────────────────────
  describe('getLastDayOfMonth', () => {
    it('returns 31 for May', () => {
      expect(ChronicaCalendarUtils.getLastDayOfMonth(d(2024, 4, 1)).getDate()).toBe(31);
    });
    it('returns 30 for April', () => {
      expect(ChronicaCalendarUtils.getLastDayOfMonth(d(2024, 3, 1)).getDate()).toBe(30);
    });
    it('returns 29 for February in a leap year', () => {
      expect(ChronicaCalendarUtils.getLastDayOfMonth(d(2024, 1, 1)).getDate()).toBe(29);
    });
    it('returns 28 for February in a non-leap year', () => {
      expect(ChronicaCalendarUtils.getLastDayOfMonth(d(2023, 1, 1)).getDate()).toBe(28);
    });
  });

  // ─── addMonths ─────────────────────────────────────────────────────────────
  describe('addMonths', () => {
    it('adds months within the same year', () => {
      const result = ChronicaCalendarUtils.addMonths(d(2024, 0, 15), 2);
      expect(result.getMonth()).toBe(2);
      expect(result.getFullYear()).toBe(2024);
    });
    it('wraps to next year when crossing December', () => {
      const result = ChronicaCalendarUtils.addMonths(d(2024, 11, 15), 1);
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2025);
    });
    it('subtracts months with negative value', () => {
      const result = ChronicaCalendarUtils.addMonths(d(2024, 2, 15), -2);
      expect(result.getMonth()).toBe(0);
    });
    it('does not mutate the original date', () => {
      const original = d(2024, 0, 15);
      ChronicaCalendarUtils.addMonths(original, 3);
      expect(original.getMonth()).toBe(0);
    });
  });

  // ─── addDays ───────────────────────────────────────────────────────────────
  describe('addDays', () => {
    it('adds days within the same month', () => {
      const result = ChronicaCalendarUtils.addDays(d(2024, 4, 15), 5);
      expect(result.getDate()).toBe(20);
      expect(result.getMonth()).toBe(4);
    });
    it('wraps to next month', () => {
      const result = ChronicaCalendarUtils.addDays(d(2024, 4, 30), 3);
      expect(result.getDate()).toBe(2);
      expect(result.getMonth()).toBe(5);
    });
    it('subtracts days with negative value', () => {
      const result = ChronicaCalendarUtils.addDays(d(2024, 4, 5), -4);
      expect(result.getDate()).toBe(1);
    });
    it('does not mutate the original date', () => {
      const original = d(2024, 4, 15);
      ChronicaCalendarUtils.addDays(original, 5);
      expect(original.getDate()).toBe(15);
    });
  });

  // ─── stripTime ─────────────────────────────────────────────────────────────
  describe('stripTime', () => {
    it('sets hours, minutes, seconds, ms to zero', () => {
      const withTime = new Date(2024, 4, 15, 10, 30, 45, 999);
      const stripped = ChronicaCalendarUtils.stripTime(withTime);
      expect(stripped.getHours()).toBe(0);
      expect(stripped.getMinutes()).toBe(0);
      expect(stripped.getSeconds()).toBe(0);
      expect(stripped.getMilliseconds()).toBe(0);
    });
    it('preserves the date part', () => {
      const date = new Date(2024, 4, 15, 23, 59, 59);
      const stripped = ChronicaCalendarUtils.stripTime(date);
      expect(stripped.getFullYear()).toBe(2024);
      expect(stripped.getMonth()).toBe(4);
      expect(stripped.getDate()).toBe(15);
    });
  });

  // ─── formatDate ────────────────────────────────────────────────────────────
  describe('formatDate', () => {
    it('formats en-US as MM/dd/yyyy', () => {
      const locale = CHRONICA_LOCALES['en-US'];
      expect(ChronicaCalendarUtils.formatDate(d(2024, 4, 5), locale)).toBe('05/05/2024');
    });
    it('formats de-DE as dd.MM.yyyy', () => {
      const locale = CHRONICA_LOCALES['de-DE'];
      expect(ChronicaCalendarUtils.formatDate(d(2024, 4, 5), locale)).toBe('05.05.2024');
    });
    it('formats ja-JP as yyyy/MM/dd', () => {
      const locale = CHRONICA_LOCALES['ja-JP'];
      expect(ChronicaCalendarUtils.formatDate(d(2024, 4, 5), locale)).toBe('2024/05/05');
    });
    it('zero-pads single-digit day and month', () => {
      const locale = CHRONICA_LOCALES['en-US'];
      expect(ChronicaCalendarUtils.formatDate(d(2024, 0, 3), locale)).toBe('01/03/2024');
    });
  });

  // ─── getPreviousMonth ──────────────────────────────────────────────────────
  describe('getPreviousMonth', () => {
    it('returns the previous month in the same year', () => {
      expect(ChronicaCalendarUtils.getPreviousMonth(5, 2024)).toEqual({ month: 4, year: 2024 });
    });
    it('wraps from January to December of the previous year', () => {
      expect(ChronicaCalendarUtils.getPreviousMonth(0, 2024)).toEqual({ month: 11, year: 2023 });
    });
  });

  // ─── getNextMonth ──────────────────────────────────────────────────────────
  describe('getNextMonth', () => {
    it('returns the next month in the same year', () => {
      expect(ChronicaCalendarUtils.getNextMonth(5, 2024)).toEqual({ month: 6, year: 2024 });
    });
    it('wraps from December to January of the next year', () => {
      expect(ChronicaCalendarUtils.getNextMonth(11, 2024)).toEqual({ month: 0, year: 2025 });
    });
  });

  // ─── generateDecadeGrid ────────────────────────────────────────────────────
  describe('generateDecadeGrid', () => {
    it('generates exactly 10 years', () => {
      expect(ChronicaCalendarUtils.generateDecadeGrid(2024).length).toBe(10);
    });
    it('starts at the beginning of the decade', () => {
      expect(ChronicaCalendarUtils.generateDecadeGrid(2024)[0]).toBe(2020);
    });
    it('ends at the last year of the decade', () => {
      expect(ChronicaCalendarUtils.generateDecadeGrid(2024)[9]).toBe(2029);
    });
    it('works for an exact decade boundary', () => {
      expect(ChronicaCalendarUtils.generateDecadeGrid(2030)[0]).toBe(2030);
    });
  });

  // ─── updateYearRange ───────────────────────────────────────────────────────
  describe('updateYearRange', () => {
    it('generates 21 years (±10 around center)', () => {
      const range = ChronicaCalendarUtils.updateYearRange(2024);
      expect(range.length).toBe(21);
    });
    it('starts 10 years before the center year', () => {
      expect(ChronicaCalendarUtils.updateYearRange(2024)[0]).toBe(2014);
    });
    it('ends 10 years after the center year', () => {
      const range = ChronicaCalendarUtils.updateYearRange(2024);
      expect(range[range.length - 1]).toBe(2034);
    });
    it('contains the center year', () => {
      expect(ChronicaCalendarUtils.updateYearRange(2024)).toContain(2024);
    });
  });

  // ─── isDateDisabled ────────────────────────────────────────────────────────
  describe('isDateDisabled', () => {
    it('returns false with no constraints', () => {
      expect(ChronicaCalendarUtils.isDateDisabled(d(2024, 4, 15), {})).toBeFalse();
    });
    it('returns true when date is before minDate', () => {
      expect(ChronicaCalendarUtils.isDateDisabled(d(2024, 4, 9), { minDate: d(2024, 4, 10) })).toBeTrue();
    });
    it('returns false when date equals minDate', () => {
      expect(ChronicaCalendarUtils.isDateDisabled(d(2024, 4, 10), { minDate: d(2024, 4, 10) })).toBeFalse();
    });
    it('returns true when date is after maxDate', () => {
      expect(ChronicaCalendarUtils.isDateDisabled(d(2024, 4, 21), { maxDate: d(2024, 4, 20) })).toBeTrue();
    });
    it('returns false when date equals maxDate', () => {
      expect(ChronicaCalendarUtils.isDateDisabled(d(2024, 4, 20), { maxDate: d(2024, 4, 20) })).toBeFalse();
    });
    it('returns true when date is in disabledDates', () => {
      expect(ChronicaCalendarUtils.isDateDisabled(d(2024, 4, 15), { disabledDates: [d(2024, 4, 15)] })).toBeTrue();
    });
    it('returns false when date is not in disabledDates', () => {
      expect(ChronicaCalendarUtils.isDateDisabled(d(2024, 4, 16), { disabledDates: [d(2024, 4, 15)] })).toBeFalse();
    });
    it('ignores time when comparing against minDate', () => {
      const minDate = new Date(2024, 4, 10, 23, 59, 59);
      expect(ChronicaCalendarUtils.isDateDisabled(d(2024, 4, 10), { minDate })).toBeFalse();
    });
  });

  // ─── generateCalendarMonth ─────────────────────────────────────────────────
  describe('generateCalendarMonth', () => {
    it('returns correct month and year', () => {
      const month = ChronicaCalendarUtils.generateCalendarMonth(2024, 4);
      expect(month.month).toBe(4);
      expect(month.year).toBe(2024);
    });
    it('generates between 4 and 6 weeks', () => {
      const month = ChronicaCalendarUtils.generateCalendarMonth(2024, 4);
      expect(month.weeks.length).toBeGreaterThanOrEqual(4);
      expect(month.weeks.length).toBeLessThanOrEqual(6);
    });
    it('each week has exactly 7 cells', () => {
      const month = ChronicaCalendarUtils.generateCalendarMonth(2024, 4);
      month.weeks.forEach((week) => expect(week.length).toBe(7));
    });
    it('marks today as isToday', () => {
      const now = new Date();
      const month = ChronicaCalendarUtils.generateCalendarMonth(now.getFullYear(), now.getMonth());
      const todayCell = month.dates.find((c) => ChronicaCalendarUtils.isSameDate(c.date, now));
      expect(todayCell?.isToday).toBeTrue();
    });
    it('cells outside current month have inCurrentMonth = false', () => {
      const month = ChronicaCalendarUtils.generateCalendarMonth(2024, 4);
      month.dates
        .filter((c) => !c.inCurrentMonth)
        .forEach((c) => expect(c.date.getMonth()).not.toBe(4));
    });
    it('uses en-US displayName by default', () => {
      const month = ChronicaCalendarUtils.generateCalendarMonth(2024, 4);
      expect(month.displayName).toBe('May');
    });
    it('respects firstDayOfWeek = 1 (Monday)', () => {
      const month = ChronicaCalendarUtils.generateCalendarMonth(2024, 4, { firstDayOfWeek: 1 });
      month.weeks.forEach((week) => expect(week[0].date.getDay()).toBe(1));
    });
    it('respects firstDayOfWeek = 0 (Sunday)', () => {
      const month = ChronicaCalendarUtils.generateCalendarMonth(2024, 4, { firstDayOfWeek: 0 });
      month.weeks.forEach((week) => expect(week[0].date.getDay()).toBe(0));
    });
    it('disables dates before minDate', () => {
      const minDate = d(2024, 4, 10);
      const month = ChronicaCalendarUtils.generateCalendarMonth(2024, 4, { minDate });
      const day9 = month.dates.find(
        (c) => c.inCurrentMonth && c.date.getDate() === 9
      );
      expect(day9?.disabled).toBeTrue();
    });
    it('all dates in month array are unique', () => {
      const month = ChronicaCalendarUtils.generateCalendarMonth(2024, 4);
      const timestamps = month.dates.map((c) => c.date.getTime());
      const unique = new Set(timestamps);
      expect(unique.size).toBe(timestamps.length);
    });
  });
});
