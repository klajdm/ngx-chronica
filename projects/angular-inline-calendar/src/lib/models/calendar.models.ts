export interface CalendarDate {
  date: Date;
  day: number;
  month: number;
  year: number;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isInCurrentMonth: boolean;
  isWeekend: boolean;
}

export interface CalendarMonth {
  month: number;
  year: number;
  name: string;
  weeks: CalendarWeek[];
}

export interface CalendarWeek {
  dates: CalendarDate[];
}

export interface CalendarConfig {
  locale?: string;
  firstDayOfWeek?: number; // 0 = Sunday, 1 = Monday, etc.
  showWeekNumbers?: boolean;
  showAdjacentMonths?: boolean;
  showTodayButton?: boolean; // Show/hide Today button
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: Date[];
  theme?: 'light' | 'dark' | 'auto';
}

export interface CalendarEvent {
  type: 'dateSelect' | 'monthChange' | 'yearChange';
  date?: Date;
  month?: number;
  year?: number;
}

export const DEFAULT_CALENDAR_CONFIG: CalendarConfig = {
  locale: 'en-US',
  firstDayOfWeek: 0,
  showWeekNumbers: false,
  showAdjacentMonths: true,
  showTodayButton: true,
  theme: 'light'
};

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const DAY_NAMES_SHORT = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];
