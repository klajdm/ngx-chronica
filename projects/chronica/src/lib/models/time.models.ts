/**
 * Time Models for Chronica Components
 * Models specific to time-based components (time-picker, datetime-picker)
 */

import { ChronicaBaseConfig } from './base.models';

/**
 * Time format types
 */
export type ChronicaTimeFormat = '12h' | '24h';

/**
 * Time selection mode
 */
export type ChronicaTimeMode = 'hours-minutes' | 'hours-minutes-seconds';

/**
 * Configuration interface for time components
 */
export interface ChronicaTimeConfig extends ChronicaBaseConfig {
  /** Time format (12h or 24h) */
  timeFormat?: ChronicaTimeFormat;
  /** Time selection mode */
  timeMode?: ChronicaTimeMode;
  /** Minimum selectable hour (0-23) */
  minHour?: number;
  /** Maximum selectable hour (0-23) */
  maxHour?: number;
  /** Hour step increment */
  hourStep?: number;
  /** Minute step increment */
  minuteStep?: number;
  /** Second step increment */
  secondStep?: number;
  /** Show AM/PM selector for 12h format */
  showAmPm?: boolean;
  /** Show seconds selector */
  showSeconds?: boolean;
  /** Show now button */
  showNowButton?: boolean;
  /** Placeholder text for time input */
  placeholder?: string;
}

/**
 * Represents a time value
 */
export interface ChronicaTimeValue {
  /** Hour (0-23) */
  hours: number;
  /** Minute (0-59) */
  minutes: number;
  /** Second (0-59) */
  seconds?: number;
  /** AM/PM for 12h format */
  period?: 'AM' | 'PM';
}

/**
 * DateTime value combining date and time
 */
export interface ChronicaDateTimeValue {
  /** Date component */
  date: Date | null;
  /** Time component */
  time: ChronicaTimeValue | null;
}

/**
 * Time duration interface
 */
export interface ChronicaDurationValue {
  /** Days */
  days?: number;
  /** Hours */
  hours?: number;
  /** Minutes */
  minutes?: number;
  /** Seconds */
  seconds?: number;
}

/**
 * Time range interface
 */
export interface ChronicaTimeRange {
  /** Start time */
  startTime: ChronicaTimeValue | null;
  /** End time */
  endTime: ChronicaTimeValue | null;
}

/**
 * Time selection event
 */
export interface ChronicaTimeSelectionEvent {
  /** Selected time */
  time: ChronicaTimeValue;
  /** Selection type */
  type: 'hours' | 'minutes' | 'seconds' | 'period';
  /** Complete time value */
  fullTime: ChronicaTimeValue;
}

/**
 * Time component of datetime selection event
 */
export interface ChronicaTimeComponentEvent {
  /** Selected datetime */
  dateTime: ChronicaDateTimeValue;
  /** Component that triggered the event */
  component: 'date' | 'time';
}

/**
 * Default time configuration
 */
export const DEFAULT_TIME_CONFIG: ChronicaTimeConfig = {
  theme: 'light',
  colorTheme: 'blue',
  disabled: false,
  timeFormat: '24h',
  timeMode: 'hours-minutes',
  minHour: 0,
  maxHour: 23,
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
  showAmPm: true,
  showSeconds: false,
  showNowButton: true,
  placeholder: 'Select time',
};
