import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  CHRONICA_LOCALES,
  ChronicaCalendarConfig,
  ChronicaCalendarView,
  ChronicaDate,
  ChronicaEvent,
  ChronicaLocale,
  ChronicaMonth,
  DEFAULT_CALENDAR_CONFIG,
} from '../../models';
import { ChronicaCalendarUtils } from '../../utils/calendar.utils';

@Component({
  selector: 'chronica-inline-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChronicaInlineCalendarComponent),
      multi: true,
    },
  ],
  templateUrl: './inline-calendar.component.html',
  styleUrl: './inline-calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChronicaInlineCalendarComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @Input() selectedDate: Date | null = null;
  @Input() config: ChronicaCalendarConfig = DEFAULT_CALENDAR_CONFIG;
  @Input() locale: ChronicaLocale | string = 'en-US';
  @Input() initialMonth?: number;
  @Input() initialYear?: number;

  @Output() dateSelected = new EventEmitter<Date>();
  @Output() monthChanged = new EventEmitter<{ month: number; year: number }>();
  @Output() calendarEvent = new EventEmitter<ChronicaEvent>();

  // ControlValueAccessor properties
  private onChange = (_value: Date | null) => {};
  private onTouched = () => {};
  disabled = false;

  currentMonth!: ChronicaMonth;
  dayNames: string[] = [];
  monthNames: string[] = [];
  yearRange: number[] = [];
  currentView: ChronicaCalendarView = 'month';
  yearGridYears: number[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    this.yearRange = ChronicaCalendarUtils.updateYearRange(new Date().getFullYear());
  }

  ngOnInit(): void {
    this.initializeCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['locale']) {
      this.initializeCalendar();
    }
    if (changes['selectedDate'] && !changes['selectedDate'].firstChange) {
      this.updateSelectedDate();
    }
  }

  private initializeCalendar(): void {
    const now = new Date();
    const month = this.initialMonth ?? now.getMonth();
    const year = this.initialYear ?? now.getFullYear();

    const currentLocale = this.getCurrentLocale();
    this.dayNames = this.getDayNamesFromLocale(currentLocale);
    this.monthNames = currentLocale.monthNames;

    this.yearRange = ChronicaCalendarUtils.updateYearRange(year);
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(year, month, this.getLocaleConfig());

    if (this.selectedDate) {
      this.updateSelectedDate();
    }
  }

  private updateSelectedDate(): void {
    if (!this.selectedDate) return;

    this.currentMonth.weeks.forEach((week) => {
      week.forEach((date) => {
        date.selected = ChronicaCalendarUtils.isSameDate(date.date, this.selectedDate!);
      });
    });
  }

  selectDate(date: ChronicaDate): void {
    if (date.disabled || this.disabled) return;

    this.selectedDate = new Date(date.date);

    this.onChange(this.selectedDate);
    this.onTouched();

    this.dateSelected.emit(new Date(this.selectedDate));
    this.calendarEvent.emit({
      type: 'dateSelect',
      payload: new Date(this.selectedDate),
      timestamp: Date.now(),
    });

    this.updateSelectedDate();
  }

  previousMonth(): void {
    const prev = ChronicaCalendarUtils.getPreviousMonth(
      this.currentMonth.month,
      this.currentMonth.year
    );

    this.yearRange = ChronicaCalendarUtils.updateYearRange(prev.year);
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(
      prev.year,
      prev.month,
      this.getLocaleConfig()
    );

    if (this.selectedDate) {
      this.updateSelectedDate();
    }

    this.monthChanged.emit(prev);
    this.calendarEvent.emit({
      type: 'monthChange',
      payload: { month: prev.month, year: prev.year },
      timestamp: Date.now(),
    });
  }

  nextMonth(): void {
    const next = ChronicaCalendarUtils.getNextMonth(
      this.currentMonth.month,
      this.currentMonth.year
    );

    this.yearRange = ChronicaCalendarUtils.updateYearRange(next.year);
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(
      next.year,
      next.month,
      this.getLocaleConfig()
    );

    if (this.selectedDate) {
      this.updateSelectedDate();
    }

    this.monthChanged.emit(next);
    this.calendarEvent.emit({
      type: 'monthChange',
      payload: { month: next.month, year: next.year },
      timestamp: Date.now(),
    });
  }

  cycleView(): void {
    if (this.currentView === 'month') {
      this.currentView = 'months';
    } else if (this.currentView === 'months') {
      this.yearGridYears = ChronicaCalendarUtils.generateDecadeGrid(this.currentMonth.year);
      this.currentView = 'year';
    } else {
      this.currentView = 'month';
    }
  }

  selectMonth(monthIndex: number): void {
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(
      this.currentMonth.year, monthIndex, this.getLocaleConfig()
    );
    this.currentView = 'month';
    if (this.selectedDate) this.updateSelectedDate();
  }

  selectYear(year: number): void {
    this.yearRange = ChronicaCalendarUtils.updateYearRange(year);
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(
      year, this.currentMonth.month, this.getLocaleConfig()
    );
    this.currentView = 'months';
    if (this.selectedDate) this.updateSelectedDate();
  }

  isPreviousMonthDisabled(): boolean {
    if (!this.config.minDate) return false;
    const firstOfPrev = new Date(this.currentMonth.year, this.currentMonth.month - 1, 1);
    return firstOfPrev < ChronicaCalendarUtils.stripTime(this.config.minDate);
  }

  isNextMonthDisabled(): boolean {
    if (!this.config.maxDate) return false;
    const lastOfNext = new Date(this.currentMonth.year, this.currentMonth.month + 2, 0);
    return lastOfNext > ChronicaCalendarUtils.stripTime(this.config.maxDate);
  }

  goToToday(): void {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();

    this.yearRange = ChronicaCalendarUtils.updateYearRange(todayYear);
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(
      todayYear,
      todayMonth,
      this.getLocaleConfig()
    );

    this.selectedDate = new Date(today);
    this.onChange(this.selectedDate);
    this.onTouched();

    this.dateSelected.emit(new Date(this.selectedDate));
    this.updateSelectedDate();

    this.monthChanged.emit({ month: todayMonth, year: todayYear });
  }

  ngOnDestroy(): void {}

  // ControlValueAccessor implementation
  writeValue(value: Date | null): void {
    this.selectedDate = value;
    if (this.currentMonth) {
      this.updateSelectedDate();
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // Utility methods for template
  get colorThemeClass(): string {
    return `chronica-${this.config.colorTheme || 'blue'}`;
  }

  get themeClass(): string {
    return `chronica-${this.config.theme || 'light'}`;
  }

  getCurrentLocale(): ChronicaLocale {
    if (typeof this.locale === 'string') {
      return CHRONICA_LOCALES[this.locale] || CHRONICA_LOCALES['en-US'];
    }
    return this.locale;
  }

  private getLocaleConfig(): ChronicaCalendarConfig {
    return { ...this.config, locale: this.getCurrentLocale() };
  }

  private getDayNamesFromLocale(locale: ChronicaLocale): string[] {
    const firstDayOfWeek = this.config.firstDayOfWeek ?? locale.weekStartsOn;
    const dayNames = [...locale.dayNamesShort];

    for (let i = 0; i < firstDayOfWeek; i++) {
      dayNames.push(dayNames.shift()!);
    }

    return dayNames;
  }
}
