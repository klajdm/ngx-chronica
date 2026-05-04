/**
 * Locale Models for Chronica Components
 * Internationalization support for date/time formatting and labels
 */

import { ChronicaLocale } from './base.models';

/**
 * Predefined locale configurations for Chronica components
 */
export const CHRONICA_LOCALES: Record<string, ChronicaLocale> = {
  'en-US': {
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    todayLabel: 'Today',
    weekStartsOn: 0,
    dateFormat: 'MM/dd/yyyy',
    labels: {
      clear: 'Clear', clearRange: 'Clear range', ok: 'OK', now: 'Now',
      hours: 'Hours', hour: 'Hour', minutes: 'Minutes', seconds: 'Seconds', days: 'Days',
      date: 'Date', time: 'Time', thisWeek: 'This Week', thisMonth: 'This Month',
    },
  },
  'en-GB': {
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    todayLabel: 'Today',
    weekStartsOn: 1,
    dateFormat: 'dd/MM/yyyy',
    labels: {
      clear: 'Clear', clearRange: 'Clear range', ok: 'OK', now: 'Now',
      hours: 'Hours', hour: 'Hour', minutes: 'Minutes', seconds: 'Seconds', days: 'Days',
      date: 'Date', time: 'Time', thisWeek: 'This Week', thisMonth: 'This Month',
    },
  },
  'es-ES': {
    monthNames: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    todayLabel: 'Hoy',
    weekStartsOn: 1,
    dateFormat: 'dd/MM/yyyy',
    labels: {
      clear: 'Borrar', clearRange: 'Borrar rango', ok: 'Aceptar', now: 'Ahora',
      hours: 'Horas', hour: 'Hora', minutes: 'Minutos', seconds: 'Segundos', days: 'Días',
      date: 'Fecha', time: 'Hora', thisWeek: 'Esta semana', thisMonth: 'Este mes',
    },
  },
  'fr-FR': {
    monthNames: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    todayLabel: "Aujourd'hui",
    weekStartsOn: 1,
    dateFormat: 'dd/MM/yyyy',
    labels: {
      clear: 'Effacer', clearRange: 'Effacer la plage', ok: 'OK', now: 'Maintenant',
      hours: 'Heures', hour: 'Heure', minutes: 'Minutes', seconds: 'Secondes', days: 'Jours',
      date: 'Date', time: 'Heure', thisWeek: 'Cette semaine', thisMonth: 'Ce mois',
    },
  },
  'de-DE': {
    monthNames: [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
    ],
    dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    todayLabel: 'Heute',
    weekStartsOn: 1,
    dateFormat: 'dd.MM.yyyy',
    labels: {
      clear: 'Löschen', clearRange: 'Bereich löschen', ok: 'OK', now: 'Jetzt',
      hours: 'Stunden', hour: 'Stunde', minutes: 'Minuten', seconds: 'Sekunden', days: 'Tage',
      date: 'Datum', time: 'Zeit', thisWeek: 'Diese Woche', thisMonth: 'Diesen Monat',
    },
  },
  'it-IT': {
    monthNames: [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
    ],
    dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    todayLabel: 'Oggi',
    weekStartsOn: 1,
    dateFormat: 'dd/MM/yyyy',
    labels: {
      clear: 'Cancella', clearRange: 'Cancella intervallo', ok: 'OK', now: 'Ora',
      hours: 'Ore', hour: 'Ora', minutes: 'Minuti', seconds: 'Secondi', days: 'Giorni',
      date: 'Data', time: 'Ora', thisWeek: 'Questa settimana', thisMonth: 'Questo mese',
    },
  },
  'pt-BR': {
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    todayLabel: 'Hoje',
    weekStartsOn: 0,
    dateFormat: 'dd/MM/yyyy',
    labels: {
      clear: 'Limpar', clearRange: 'Limpar intervalo', ok: 'OK', now: 'Agora',
      hours: 'Horas', hour: 'Hora', minutes: 'Minutos', seconds: 'Segundos', days: 'Dias',
      date: 'Data', time: 'Hora', thisWeek: 'Esta semana', thisMonth: 'Este mês',
    },
  },
  'zh-CN': {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
    todayLabel: '今天',
    weekStartsOn: 1,
    dateFormat: 'yyyy/MM/dd',
    labels: {
      clear: '清除', clearRange: '清除范围', ok: '确定', now: '现在',
      hours: '小时', hour: '小时', minutes: '分钟', seconds: '秒', days: '天',
      date: '日期', time: '时间', thisWeek: '本周', thisMonth: '本月',
    },
  },
  'ja-JP': {
    monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
    dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
    todayLabel: '今日',
    weekStartsOn: 0,
    dateFormat: 'yyyy/MM/dd',
    labels: {
      clear: 'クリア', clearRange: '範囲をクリア', ok: 'OK', now: '現在',
      hours: '時間', hour: '時', minutes: '分', seconds: '秒', days: '日',
      date: '日付', time: '時刻', thisWeek: '今週', thisMonth: '今月',
    },
  },
  'ko-KR': {
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    todayLabel: '오늘',
    weekStartsOn: 0,
    dateFormat: 'yyyy. MM. dd.',
    labels: {
      clear: '지우기', clearRange: '범위 지우기', ok: '확인', now: '지금',
      hours: '시간', hour: '시', minutes: '분', seconds: '초', days: '일',
      date: '날짜', time: '시간', thisWeek: '이번 주', thisMonth: '이번 달',
    },
  },
  'ru-RU': {
    monthNames: [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
    ],
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    todayLabel: 'Сегодня',
    weekStartsOn: 1,
    dateFormat: 'dd.MM.yyyy',
    labels: {
      clear: 'Очистить', clearRange: 'Очистить диапазон', ok: 'ОК', now: 'Сейчас',
      hours: 'Часы', hour: 'Час', minutes: 'Минуты', seconds: 'Секунды', days: 'Дни',
      date: 'Дата', time: 'Время', thisWeek: 'Эта неделя', thisMonth: 'Этот месяц',
    },
  },
};

/**
 * Get locale configuration by locale code
 * @param localeCode - The locale code (e.g., 'en-US')
 * @returns The locale configuration or 'en-US' as fallback
 */
export function getChronicaLocale(localeCode: string): ChronicaLocale {
  return CHRONICA_LOCALES[localeCode] || CHRONICA_LOCALES['en-US'];
}

/**
 * Get available locale codes
 * @returns Array of available locale codes
 */
export function getAvailableLocales(): string[] {
  return Object.keys(CHRONICA_LOCALES);
}
