/**
 * DateTime Models for Chronica Components
 * Models specific to datetime-picker component that combines date and time
 */

import { ChronicaBaseConfig } from './base.models';
import { ChronicaCalendarConfig } from './calendar.models';
import { ChronicaTimeConfig, ChronicaTimeValue, ChronicaDateTimeValue } from './time.models';

/**
 * DateTime picker layout mode
 */
export type ChronicaDateTimeLayout = 'inline' | 'popup' | 'tabs' | 'compact';

/**
 * DateTime component focus state
 */
export type ChronicaDateTimeFocus = 'date' | 'time' | 'none';

/**
 * Configuration interface for datetime components
 */
export interface ChronicaDateTimeConfig extends ChronicaBaseConfig {
  /** Calendar configuration */
  calendarConfig?: Partial<ChronicaCalendarConfig>;
  /** Time configuration */
  timeConfig?: Partial<ChronicaTimeConfig>;
  /** Layout mode for the datetime picker */
  layout?: ChronicaDateTimeLayout;
  /** Default focus component */
  defaultFocus?: ChronicaDateTimeFocus;
  /** Show separate date and time inputs */
  showSeparateInputs?: boolean;
  /** Allow clearing the selection */
  allowClear?: boolean;
  /** Placeholder text for datetime input */
  placeholder?: string;
  /** Separator between date and time in display */
  dateTimeSeparator?: string;
  /** Whether both date and time are required */
  requireBoth?: boolean;
}

/**
 * DateTime range interface
 */
export interface ChronicaDateTimeRange {
  /** Start datetime */
  startDateTime: ChronicaDateTimeValue | null;
  /** End datetime */
  endDateTime: ChronicaDateTimeValue | null;
}

/**
 * DateTime validation result
 */
export interface ChronicaDateTimeValidation {
  /** Whether the value is valid */
  valid: boolean;
  /** Validation errors */
  errors: ChronicaDateTimeValidationError[];
}

/**
 * DateTime validation error types
 */
export type ChronicaDateTimeValidationError =
  | 'required'
  | 'invalid-date'
  | 'invalid-time'
  | 'date-required'
  | 'time-required'
  | 'min-date'
  | 'max-date'
  | 'disabled-date'
  | 'min-time'
  | 'max-time';

/**
 * DateTime selection event
 */
export interface ChronicaDateTimeSelectionEvent {
  /** Selected datetime value */
  dateTime: ChronicaDateTimeValue;
  /** Component that triggered the event */
  component: 'date' | 'time' | 'clear';
  /** Whether the selection is complete */
  complete: boolean;
  /** Previous value */
  previousValue?: ChronicaDateTimeValue;
}

/**
 * DateTime focus change event
 */
export interface ChronicaDateTimeFocusEvent {
  /** Previous focus */
  previous: ChronicaDateTimeFocus;
  /** Current focus */
  current: ChronicaDateTimeFocus;
}

/**
 * Default datetime configuration
 */
export const DEFAULT_DATETIME_CONFIG: ChronicaDateTimeConfig = {
  theme: 'light',
  colorTheme: 'blue',
  disabled: false,
  layout: 'inline',
  defaultFocus: 'date',
  showSeparateInputs: false,
  allowClear: true,
  placeholder: 'Select date and time',
  dateTimeSeparator: ' ',
  requireBoth: true,
  calendarConfig: {
    showTodayButton: true,
    closeAfterSelection: false,
  },
  timeConfig: {
    timeFormat: '24h',
    showNowButton: true,
    showSeconds: false,
  },
};
