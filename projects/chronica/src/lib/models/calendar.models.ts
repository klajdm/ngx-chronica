/**
 * Calendar Models for Chronica Components
 * Models specific to calendar-based components (datepicker, inline-calendar)
 */

import { ChronicaBaseConfig, ChronicaLocale } from './base.models';

/**
 * Configuration interface for calendar components
 */
export interface ChronicaCalendarConfig extends ChronicaBaseConfig {
  /** Locale configuration */
  locale?: ChronicaLocale;
  /** Locale code string (alternative to locale object) */
  localeCode?: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Array of disabled dates */
  disabledDates?: Date[];
  /** First day of week (0=Sunday, 1=Monday, etc.) */
  firstDayOfWeek?: number;
  /** Whether to show today button */
  showTodayButton?: boolean;
  /** Whether to show navigation arrows */
  showNavigation?: boolean;
  /** Whether to show year selector */
  showYearSelector?: boolean;
  /** Whether to show month selector */
  showMonthSelector?: boolean;
  /** Number of months to display */
  monthsToShow?: number;
  /** Close popup after date selection */
  closeAfterSelection?: boolean;
}

/**
 * Represents a calendar date with selection state
 */
export interface ChronicaDate {
  /** The actual date */
  date: Date;
  /** Whether this date is selected */
  selected: boolean;
  /** Whether this date is today */
  isToday: boolean;
  /** Whether this date is in the current month */
  inCurrentMonth: boolean;
  /** Whether this date is disabled */
  disabled: boolean;
  /** Whether this date is in a weekend */
  isWeekend?: boolean;
  /** Additional CSS classes for styling */
  cssClass?: string;
}

/**
 * Represents a calendar month
 */
export interface ChronicaMonth {
  /** Month number (0-11) */
  month: number;
  /** Year */
  year: number;
  /** Display name of the month */
  displayName: string;
  /** Array of dates in this month */
  dates: ChronicaDate[];
  /** Array of week rows */
  weeks: ChronicaDate[][];
}

/**
 * Represents a calendar year
 */
export interface ChronicaYear {
  /** Year number */
  year: number;
  /** Array of months in this year */
  months: ChronicaMonth[];
  /** Whether this is the current year */
  isCurrent: boolean;
}

/**
 * Date range interface for range pickers
 */
export interface ChronicaDateRange {
  /** Start date of the range */
  startDate: Date | null;
  /** End date of the range */
  endDate: Date | null;
}

/**
 * Calendar view modes
 */
export type ChronicaCalendarView = 'month' | 'year' | 'decade';

/**
 * Calendar navigation event
 */
export interface ChronicaCalendarNavigationEvent {
  /** Previous month/year */
  previous: { month: number; year: number };
  /** Current month/year */
  current: { month: number; year: number };
  /** View mode */
  view: ChronicaCalendarView;
}

/**
 * Date selection event
 */
export interface ChronicaDateSelectionEvent {
  /** Selected date */
  date: Date;
  /** Selection type */
  type: 'single' | 'range-start' | 'range-end';
  /** For range selections, the complete range */
  range?: ChronicaDateRange;
}

/**
 * Default calendar configuration
 */
export const DEFAULT_CALENDAR_CONFIG: ChronicaCalendarConfig = {
  theme: 'light',
  colorTheme: 'blue',
  disabled: false,
  showTodayButton: true,
  showNavigation: true,
  showYearSelector: true,
  showMonthSelector: true,
  monthsToShow: 1,
  closeAfterSelection: true,
  disabledDates: [],
};
