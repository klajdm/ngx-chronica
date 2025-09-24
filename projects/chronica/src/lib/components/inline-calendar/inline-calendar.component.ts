import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChronicaService } from '../../services/chronica.service';
import {
  CHRONICA_COLOR_THEMES,
  CHRONICA_LOCALES,
  ChronicaCalendarConfig,
  ChronicaEvent,
  ChronicaLocale,
  ChronicaMonth,
  DEFAULT_CALENDAR_CONFIG,
} from '../../models';

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
})
export class ChronicaInlineCalendarComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() selectedDate: Date | null = null;
  @Input() config: ChronicaCalendarConfig = DEFAULT_CALENDAR_CONFIG;
  @Input() locale: ChronicaLocale | string = 'en-US';
  @Input() initialMonth?: number;
  @Input() initialYear?: number;

  @Output() dateSelected = new EventEmitter<Date>();
  @Output() monthChanged = new EventEmitter<{ month: number; year: number }>();
  @Output() calendarEvent = new EventEmitter<ChronicaEvent>();

  // ControlValueAccessor properties
  private onChange = (value: Date | null) => {};
  private onTouched = () => {};
  disabled = false;

  currentMonth!: ChronicaMonth;
  dayNames: string[] = [];
  monthNames: string[] = [];
  yearRange: number[] = [];

  constructor(private calendarService: ChronicaService) {
    this.updateYearRange(new Date().getFullYear());
  }

  private updateYearRange(centerYear: number): void {
    const start = centerYear - 10;
    const end = centerYear + 10;
    const newYearRange: number[] = [];
    for (let year = start; year <= end; year++) {
      newYearRange.push(year);
    }
    this.yearRange = newYearRange;
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

    this.updateYearRange(year);
    this.currentMonth = this.calendarService.generateCalendarMonth(year, month, this.config);

    if (this.selectedDate) {
      this.updateSelectedDate();
    }
  }

  private updateSelectedDate(): void {
    if (!this.selectedDate) return;

    this.currentMonth.weeks.forEach((week) => {
      week.forEach((date) => {
        date.selected = this.calendarService.isSameDate(date.date, this.selectedDate!);
      });
    });
  }

  selectDate(date: any): void {
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
    const prev = this.calendarService.getPreviousMonth(
      this.currentMonth.month,
      this.currentMonth.year
    );

    this.updateYearRange(prev.year);
    this.currentMonth = this.calendarService.generateCalendarMonth(
      prev.year,
      prev.month,
      this.config
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
    const next = this.calendarService.getNextMonth(this.currentMonth.month, this.currentMonth.year);

    this.updateYearRange(next.year);
    this.currentMonth = this.calendarService.generateCalendarMonth(
      next.year,
      next.month,
      this.config
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

  goToToday(): void {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();

    this.updateYearRange(todayYear);
    this.currentMonth = this.calendarService.generateCalendarMonth(
      todayYear,
      todayMonth,
      this.config
    );

    this.selectedDate = new Date(today);
    this.onChange(this.selectedDate);
    this.onTouched();

    this.dateSelected.emit(new Date(this.selectedDate));
    this.updateSelectedDate();

    this.monthChanged.emit({ month: todayMonth, year: todayYear });
  }

  // ControlValueAccessor implementation
  writeValue(value: Date | null): void {
    this.selectedDate = value;
    if (this.currentMonth) {
      this.updateSelectedDate();
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getColorThemeStyles(): { [key: string]: string } {
    const colorTheme = this.config.colorTheme || 'blue';
    const colors = CHRONICA_COLOR_THEMES[colorTheme];

    return {
      '--chronica-primary': colors.primary,
      '--chronica-primary-hover': colors.primaryHover,
      '--chronica-primary-light': colors.primaryLight,
      '--chronica-primary-dark': colors.primaryDark,
      '--chronica-accent': colors.accent,
      '--chronica-focus': colors.focus,
    };
  }

  getCurrentLocale(): ChronicaLocale {
    if (typeof this.locale === 'string') {
      return CHRONICA_LOCALES[this.locale] || CHRONICA_LOCALES['en-US'];
    }
    return this.locale;
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
