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

export interface CalendarLocale {
  monthNames: string[];
  dayNames: string[];
  dayNamesShort: string[];
  todayLabel: string;
  weekStartsOn: number;
  dateFormat: string;
}

export interface CalendarConfig {
  locale?: CalendarLocale | string;
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

// Predefined locale configurations
export const CALENDAR_LOCALES: { [key: string]: CalendarLocale } = {
  'en-US': {
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    todayLabel: 'Today',
    weekStartsOn: 0,
    dateFormat: 'MM/dd/yyyy'
  },
  'en-GB': {
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    todayLabel: 'Today',
    weekStartsOn: 1,
    dateFormat: 'dd/MM/yyyy'
  },
  'es-ES': {
    monthNames: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    todayLabel: 'Hoy',
    weekStartsOn: 1,
    dateFormat: 'dd/MM/yyyy'
  },
  'fr-FR': {
    monthNames: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    todayLabel: 'Aujourd\'hui',
    weekStartsOn: 1,
    dateFormat: 'dd/MM/yyyy'
  },
  'de-DE': {
    monthNames: [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ],
    dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    todayLabel: 'Heute',
    weekStartsOn: 1,
    dateFormat: 'dd.MM.yyyy'
  },
  'it-IT': {
    monthNames: [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ],
    dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    todayLabel: 'Oggi',
    weekStartsOn: 1,
    dateFormat: 'dd/MM/yyyy'
  },
  'pt-BR': {
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    todayLabel: 'Hoje',
    weekStartsOn: 0,
    dateFormat: 'dd/MM/yyyy'
  },
  'ru-RU': {
    monthNames: [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ],
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    todayLabel: 'Сегодня',
    weekStartsOn: 1,
    dateFormat: 'dd.MM.yyyy'
  },
  'ja-JP': {
    monthNames: [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月'
    ],
    dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
    dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
    todayLabel: '今日',
    weekStartsOn: 0,
    dateFormat: 'yyyy/MM/dd'
  },
  'zh-CN': {
    monthNames: [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ],
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
    todayLabel: '今天',
    weekStartsOn: 1,
    dateFormat: 'yyyy/MM/dd'
  },
  'ar-SA': {
    monthNames: [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ],
    dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesShort: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
    todayLabel: 'اليوم',
    weekStartsOn: 6,
    dateFormat: 'dd/MM/yyyy'
  }
};

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
