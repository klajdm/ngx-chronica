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
  theme?: "light" | "dark" | "auto";
  colorTheme?: "blue" | "green" | "purple" | "red" | "orange" | "teal" | "pink" | "indigo";
}

export interface CalendarEvent {
  type: "dateSelect" | "monthChange" | "yearChange";
  date?: Date;
  month?: number;
  year?: number;
}

export const DEFAULT_CALENDAR_CONFIG: CalendarConfig = {
  locale: "en-US",
  firstDayOfWeek: 0,
  showWeekNumbers: false,
  showAdjacentMonths: true,
  showTodayButton: true,
  theme: "light",
  colorTheme: "blue",
};

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DAY_NAMES_SHORT = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

// Color theme definitions
export const COLOR_THEMES = {
  blue: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryLight: '#dbeafe',
    primaryDark: '#1d4ed8',
    accent: '#60a5fa',
    focus: 'rgba(59, 130, 246, 0.2)'
  },
  green: {
    primary: '#10b981',
    primaryHover: '#059669',
    primaryLight: '#d1fae5',
    primaryDark: '#047857',
    accent: '#34d399',
    focus: 'rgba(16, 185, 129, 0.2)'
  },
  purple: {
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    primaryLight: '#ede9fe',
    primaryDark: '#6d28d9',
    accent: '#a78bfa',
    focus: 'rgba(139, 92, 246, 0.2)'
  },
  red: {
    primary: '#ef4444',
    primaryHover: '#dc2626',
    primaryLight: '#fee2e2',
    primaryDark: '#b91c1c',
    accent: '#f87171',
    focus: 'rgba(239, 68, 68, 0.2)'
  },
  orange: {
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryLight: '#fed7aa',
    primaryDark: '#c2410c',
    accent: '#fb923c',
    focus: 'rgba(249, 115, 22, 0.2)'
  },
  teal: {
    primary: '#14b8a6',
    primaryHover: '#0d9488',
    primaryLight: '#ccfbf1',
    primaryDark: '#0f766e',
    accent: '#2dd4bf',
    focus: 'rgba(20, 184, 166, 0.2)'
  },
  pink: {
    primary: '#ec4899',
    primaryHover: '#db2777',
    primaryLight: '#fce7f3',
    primaryDark: '#be185d',
    accent: '#f472b6',
    focus: 'rgba(236, 72, 153, 0.2)'
  },
  indigo: {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: '#e0e7ff',
    primaryDark: '#4338ca',
    accent: '#818cf8',
    focus: 'rgba(99, 102, 241, 0.2)'
  }
};
