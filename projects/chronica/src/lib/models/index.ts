/**
 * Chronica Models - Main Export Index
 * Centralized exports for all Chronica component models
 */

// Base models - Core interfaces and configurations
export * from './base.models';

// Locale models - Internationalization support
export * from './locale.models';

// Calendar models - Date picker and inline calendar components
export * from './calendar.models';

// Time models - Time picker and time-related components
export * from './time.models';

// DateTime models - Combined date and time picker components
export * from './datetime.models';

// Re-export commonly used types for convenience
export type {
  ChronicaTheme,
  ChronicaColorTheme,
  ChronicaBaseConfig,
  ChronicaLocale,
  ChronicaEvent,
} from './base.models';

export type {
  ChronicaCalendarConfig,
  ChronicaDate,
  ChronicaMonth,
  ChronicaDateRange,
  ChronicaCalendarView,
} from './calendar.models';

export type {
  ChronicaTimeFormat,
  ChronicaTimeMode,
  ChronicaTimeConfig,
  ChronicaTimeValue,
  ChronicaDateTimeValue,
} from './time.models';

export type {
  ChronicaDateTimeLayout,
  ChronicaDateTimeConfig,
  ChronicaDateTimeRange,
} from './datetime.models';

// Re-export commonly used constants
export { CHRONICA_COLOR_THEMES, DEFAULT_CHRONICA_CONFIG } from './base.models';

export { CHRONICA_LOCALES } from './locale.models';

export { DEFAULT_CALENDAR_CONFIG } from './calendar.models';

export { DEFAULT_TIME_CONFIG } from './time.models';

export { DEFAULT_DATETIME_CONFIG } from './datetime.models';
