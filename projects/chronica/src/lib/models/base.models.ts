/**
 * Base Chronica Models
 * Common interfaces and types used across all Chronica components
 */

export type ChronicaTheme = 'light' | 'dark' | 'auto';
export type ChronicaColorTheme =
  | 'blue'
  | 'green'
  | 'purple'
  | 'red'
  | 'orange'
  | 'teal'
  | 'pink'
  | 'indigo';

/**
 * Base configuration interface that all Chronica components extend
 */
export interface ChronicaBaseConfig {
  /** Visual theme mode */
  theme?: ChronicaTheme;
  /** Color theme for primary colors */
  colorTheme?: ChronicaColorTheme;
  /** Whether the component is disabled */
  disabled?: boolean;
}

/**
 * Locale configuration for internationalization
 */
export interface ChronicaLocale {
  /** Full month names */
  monthNames: string[];
  /** Full day names */
  dayNames: string[];
  /** Short day names (3 chars) */
  dayNamesShort: string[];
  /** Label for "Today" button */
  todayLabel: string;
  /** First day of week (0=Sunday, 1=Monday, etc.) */
  weekStartsOn: number;
  /** Default date format pattern */
  dateFormat: string;
}

/**
 * Event emitted by Chronica components
 */
export interface ChronicaEvent<T = any> {
  /** Type of event */
  type: string;
  /** Event payload */
  payload?: T;
  /** Timestamp when event occurred */
  timestamp: number;
}

/**
 * Color theme definition
 */
export interface ChronicaColorThemeDefinition {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  focus: string;
}

/**
 * Predefined color theme definitions
 */
export const CHRONICA_COLOR_THEMES: Record<ChronicaColorTheme, ChronicaColorThemeDefinition> = {
  blue: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryLight: '#dbeafe',
    primaryDark: '#1d4ed8',
    accent: '#60a5fa',
    focus: 'rgba(59, 130, 246, 0.2)',
  },
  green: {
    primary: '#10b981',
    primaryHover: '#059669',
    primaryLight: '#d1fae5',
    primaryDark: '#047857',
    accent: '#34d399',
    focus: 'rgba(16, 185, 129, 0.2)',
  },
  purple: {
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    primaryLight: '#ede9fe',
    primaryDark: '#6d28d9',
    accent: '#a78bfa',
    focus: 'rgba(139, 92, 246, 0.2)',
  },
  red: {
    primary: '#ef4444',
    primaryHover: '#dc2626',
    primaryLight: '#fee2e2',
    primaryDark: '#b91c1c',
    accent: '#f87171',
    focus: 'rgba(239, 68, 68, 0.2)',
  },
  orange: {
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryLight: '#fed7aa',
    primaryDark: '#c2410c',
    accent: '#fb923c',
    focus: 'rgba(249, 115, 22, 0.2)',
  },
  teal: {
    primary: '#14b8a6',
    primaryHover: '#0d9488',
    primaryLight: '#ccfbf1',
    primaryDark: '#0f766e',
    accent: '#5eead4',
    focus: 'rgba(20, 184, 166, 0.2)',
  },
  pink: {
    primary: '#ec4899',
    primaryHover: '#db2777',
    primaryLight: '#fce7f3',
    primaryDark: '#be185d',
    accent: '#f472b6',
    focus: 'rgba(236, 72, 153, 0.2)',
  },
  indigo: {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: '#e0e7ff',
    primaryDark: '#4338ca',
    accent: '#818cf8',
    focus: 'rgba(99, 102, 241, 0.2)',
  },
};

/**
 * Default base configuration
 */
export const DEFAULT_CHRONICA_CONFIG: ChronicaBaseConfig = {
  theme: 'light',
  colorTheme: 'blue',
  disabled: false,
};
