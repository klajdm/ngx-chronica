import { ChronicaTimeUtils } from './time.utils';

describe('ChronicaTimeUtils', () => {
  // ─── to12Hour ──────────────────────────────────────────────────────────────
  describe('to12Hour', () => {
    it('converts 0 (midnight) to 12 AM', () => {
      expect(ChronicaTimeUtils.to12Hour(0)).toEqual({ hours: 12, period: 'AM' });
    });
    it('converts 1 to 1 AM', () => {
      expect(ChronicaTimeUtils.to12Hour(1)).toEqual({ hours: 1, period: 'AM' });
    });
    it('converts 11 to 11 AM', () => {
      expect(ChronicaTimeUtils.to12Hour(11)).toEqual({ hours: 11, period: 'AM' });
    });
    it('converts 12 (noon) to 12 PM', () => {
      expect(ChronicaTimeUtils.to12Hour(12)).toEqual({ hours: 12, period: 'PM' });
    });
    it('converts 13 to 1 PM', () => {
      expect(ChronicaTimeUtils.to12Hour(13)).toEqual({ hours: 1, period: 'PM' });
    });
    it('converts 23 to 11 PM', () => {
      expect(ChronicaTimeUtils.to12Hour(23)).toEqual({ hours: 11, period: 'PM' });
    });
  });

  // ─── to24Hour ──────────────────────────────────────────────────────────────
  describe('to24Hour', () => {
    it('converts 12 AM to 0 (midnight)', () => {
      expect(ChronicaTimeUtils.to24Hour(12, 'AM')).toBe(0);
    });
    it('converts 1 AM to 1', () => {
      expect(ChronicaTimeUtils.to24Hour(1, 'AM')).toBe(1);
    });
    it('converts 11 AM to 11', () => {
      expect(ChronicaTimeUtils.to24Hour(11, 'AM')).toBe(11);
    });
    it('converts 12 PM to 12 (noon)', () => {
      expect(ChronicaTimeUtils.to24Hour(12, 'PM')).toBe(12);
    });
    it('converts 1 PM to 13', () => {
      expect(ChronicaTimeUtils.to24Hour(1, 'PM')).toBe(13);
    });
    it('converts 11 PM to 23', () => {
      expect(ChronicaTimeUtils.to24Hour(11, 'PM')).toBe(23);
    });
    it('is the inverse of to12Hour for all 24 hours', () => {
      for (let h = 0; h < 24; h++) {
        const { hours, period } = ChronicaTimeUtils.to12Hour(h);
        expect(ChronicaTimeUtils.to24Hour(hours, period)).withContext(`hour ${h}`).toBe(h);
      }
    });
  });

  // ─── formatTime ────────────────────────────────────────────────────────────
  describe('formatTime', () => {
    it('formats 24h HH:mm without seconds', () => {
      expect(ChronicaTimeUtils.formatTime({ hours: 9, minutes: 5 })).toBe('09:05');
    });
    it('formats 24h HH:mm:ss with seconds', () => {
      expect(ChronicaTimeUtils.formatTime({ hours: 14, minutes: 30, seconds: 45 })).toBe('14:30:45');
    });
    it('pads single-digit hours and minutes', () => {
      expect(ChronicaTimeUtils.formatTime({ hours: 0, minutes: 0 })).toBe('00:00');
    });
    it('formats 12h without seconds', () => {
      expect(ChronicaTimeUtils.formatTime({ hours: 9, minutes: 5, period: 'AM' }, '12h')).toBe('09:05 AM');
    });
    it('formats 12h noon', () => {
      expect(ChronicaTimeUtils.formatTime({ hours: 12, minutes: 0, period: 'PM' }, '12h')).toBe('12:00 PM');
    });
    it('formats 12h with seconds', () => {
      expect(ChronicaTimeUtils.formatTime({ hours: 3, minutes: 5, seconds: 7, period: 'AM' }, '12h')).toBe('03:05:07 AM');
    });
    it('falls back to 24h format when period is absent in 12h mode', () => {
      const result = ChronicaTimeUtils.formatTime({ hours: 15, minutes: 30 }, '12h');
      expect(result).toBe('15:30');
    });
  });

  // ─── parseTime ─────────────────────────────────────────────────────────────
  describe('parseTime', () => {
    it('parses a valid 24h time', () => {
      const result = ChronicaTimeUtils.parseTime('14:30');
      expect(result).not.toBeNull();
      expect(result?.hours).toBe(14);
      expect(result?.minutes).toBe(30);
    });
    it('parses 24h time with seconds', () => {
      const result = ChronicaTimeUtils.parseTime('14:30:45');
      expect(result?.seconds).toBe(45);
    });
    it('parses a valid 12h time (PM)', () => {
      const result = ChronicaTimeUtils.parseTime('2:30 PM', '12h');
      expect(result?.hours).toBe(14);
      expect(result?.minutes).toBe(30);
    });
    it('parses a valid 12h time (AM)', () => {
      const result = ChronicaTimeUtils.parseTime('12:00 AM', '12h');
      expect(result?.hours).toBe(0);
    });
    it('returns null for an empty string', () => {
      expect(ChronicaTimeUtils.parseTime('')).toBeNull();
    });
    it('returns null for hours > 23 in 24h', () => {
      expect(ChronicaTimeUtils.parseTime('25:00')).toBeNull();
    });
    it('returns null for minutes >= 60', () => {
      expect(ChronicaTimeUtils.parseTime('12:60')).toBeNull();
    });
    it('returns null for invalid seconds', () => {
      expect(ChronicaTimeUtils.parseTime('12:00:60')).toBeNull();
    });
    it('returns null for malformed string', () => {
      expect(ChronicaTimeUtils.parseTime('not-a-time')).toBeNull();
    });
    it('trims leading/trailing whitespace', () => {
      const result = ChronicaTimeUtils.parseTime('  09:05  ');
      expect(result?.hours).toBe(9);
    });
  });

  // ─── getCurrentTime ────────────────────────────────────────────────────────
  describe('getCurrentTime', () => {
    it('returns current hours and minutes', () => {
      const before = new Date();
      const time = ChronicaTimeUtils.getCurrentTime();
      const after = new Date();
      expect(time.hours).toBeGreaterThanOrEqual(before.getHours());
      expect(time.hours).toBeLessThanOrEqual(after.getHours());
      expect(time.minutes).toBeDefined();
    });
    it('excludes seconds by default', () => {
      expect(ChronicaTimeUtils.getCurrentTime().seconds).toBeUndefined();
    });
    it('includes seconds when flag is true', () => {
      const time = ChronicaTimeUtils.getCurrentTime(true);
      expect(time.seconds).toBeDefined();
      expect(time.seconds!).toBeGreaterThanOrEqual(0);
      expect(time.seconds!).toBeLessThan(60);
    });
  });

  // ─── timeToDate ────────────────────────────────────────────────────────────
  describe('timeToDate', () => {
    it('sets hours and minutes correctly', () => {
      const result = ChronicaTimeUtils.timeToDate({ hours: 14, minutes: 30 });
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(0);
    });
    it('sets seconds when provided', () => {
      const result = ChronicaTimeUtils.timeToDate({ hours: 10, minutes: 0, seconds: 45 });
      expect(result.getSeconds()).toBe(45);
    });
    it('preserves date from baseDate', () => {
      const base = new Date(2024, 4, 15);
      const result = ChronicaTimeUtils.timeToDate({ hours: 10, minutes: 0 }, base);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(4);
      expect(result.getDate()).toBe(15);
    });
    it('does not mutate baseDate', () => {
      const base = new Date(2024, 4, 15, 9, 0);
      ChronicaTimeUtils.timeToDate({ hours: 14, minutes: 0 }, base);
      expect(base.getHours()).toBe(9);
    });
    it('clears milliseconds', () => {
      const result = ChronicaTimeUtils.timeToDate({ hours: 10, minutes: 0 });
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  // ─── dateToTime ────────────────────────────────────────────────────────────
  describe('dateToTime', () => {
    it('extracts hours and minutes from a date', () => {
      const date = new Date(2024, 4, 15, 14, 30, 45);
      const time = ChronicaTimeUtils.dateToTime(date);
      expect(time.hours).toBe(14);
      expect(time.minutes).toBe(30);
    });
    it('excludes seconds by default', () => {
      const time = ChronicaTimeUtils.dateToTime(new Date(2024, 4, 15, 14, 30, 45));
      expect(time.seconds).toBeUndefined();
    });
    it('includes seconds when flag is true', () => {
      const time = ChronicaTimeUtils.dateToTime(new Date(2024, 4, 15, 14, 30, 45), true);
      expect(time.seconds).toBe(45);
    });
  });

  // ─── compareTime ───────────────────────────────────────────────────────────
  describe('compareTime', () => {
    it('returns 0 for equal times', () => {
      const t = { hours: 10, minutes: 30 };
      expect(ChronicaTimeUtils.compareTime(t, t)).toBe(0);
    });
    it('returns negative when first time is earlier', () => {
      expect(ChronicaTimeUtils.compareTime({ hours: 9, minutes: 0 }, { hours: 10, minutes: 0 })).toBeLessThan(0);
    });
    it('returns positive when first time is later', () => {
      expect(ChronicaTimeUtils.compareTime({ hours: 11, minutes: 0 }, { hours: 10, minutes: 0 })).toBeGreaterThan(0);
    });
    it('compares minutes correctly', () => {
      expect(ChronicaTimeUtils.compareTime({ hours: 10, minutes: 29 }, { hours: 10, minutes: 30 })).toBeLessThan(0);
    });
  });

  // ─── isTimeInRange ─────────────────────────────────────────────────────────
  describe('isTimeInRange', () => {
    const range = {
      startTime: { hours: 9, minutes: 0 },
      endTime: { hours: 17, minutes: 0 },
    };

    it('returns true for a time in the middle of the range', () => {
      expect(ChronicaTimeUtils.isTimeInRange({ hours: 12, minutes: 0 }, range)).toBeTrue();
    });
    it('returns true at the start boundary', () => {
      expect(ChronicaTimeUtils.isTimeInRange({ hours: 9, minutes: 0 }, range)).toBeTrue();
    });
    it('returns true at the end boundary', () => {
      expect(ChronicaTimeUtils.isTimeInRange({ hours: 17, minutes: 0 }, range)).toBeTrue();
    });
    it('returns false when time is before the range', () => {
      expect(ChronicaTimeUtils.isTimeInRange({ hours: 8, minutes: 59 }, range)).toBeFalse();
    });
    it('returns false when time is after the range', () => {
      expect(ChronicaTimeUtils.isTimeInRange({ hours: 17, minutes: 1 }, range)).toBeFalse();
    });
    it('returns true when startTime is null', () => {
      expect(ChronicaTimeUtils.isTimeInRange({ hours: 5, minutes: 0 }, { startTime: null, endTime: { hours: 17, minutes: 0 } })).toBeTrue();
    });
    it('returns true when endTime is null', () => {
      expect(ChronicaTimeUtils.isTimeInRange({ hours: 20, minutes: 0 }, { startTime: { hours: 9, minutes: 0 }, endTime: null })).toBeTrue();
    });
    it('returns true when both startTime and endTime are null', () => {
      expect(ChronicaTimeUtils.isTimeInRange({ hours: 12, minutes: 0 }, { startTime: null, endTime: null })).toBeTrue();
    });
  });
});
