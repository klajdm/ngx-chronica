import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  TemplateRef,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChronicaDateTimeConfig,
  ChronicaDateTimeValue,
  DEFAULT_DATETIME_CONFIG,
  ChronicaLocale,
  ChronicaTimeConfig,
  ChronicaTimeValue,
  ChronicaCalendarConfig,
  CHRONICA_LOCALES,
  DEFAULT_TIME_CONFIG,
  DEFAULT_CALENDAR_CONFIG,
} from '../../models/index';
import { ChronicaCalendarUtils } from '../../utils/calendar.utils';

export type DateTimeValue = ChronicaDateTimeValue;

export type DateTimePickerConfig = ChronicaDateTimeConfig;

export const DEFAULT_DATETIME_PICKER_CONFIG: DateTimePickerConfig = DEFAULT_DATETIME_CONFIG;

@Component({
  selector: 'chronica-datetime-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChronicaDateTimePickerComponent),
      multi: true,
    },
  ],
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.css'],
})
export class ChronicaDateTimePickerComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor
{
  @Input() config: DateTimePickerConfig = DEFAULT_DATETIME_PICKER_CONFIG;
  @Input() locale: ChronicaLocale | string = 'en-US';
  @Input() placeholder = 'Select date and time';
  @Input() disabled = false;
  @Input() required = false;
  @Input() hideInput = false;
  @Input() popupPosition: 'bottom' | 'top' | 'auto' = 'auto';

  @Output() dateTimeChange = new EventEmitter<DateTimeValue>();
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() timeSelected = new EventEmitter<ChronicaTimeValue>();
  @Output() calendarOpened = new EventEmitter<void>();
  @Output() calendarClosed = new EventEmitter<void>();

  // ControlValueAccessor properties
  private onChange = (value: DateTimeValue | null) => {};
  private onTouched = () => {};

  // Component state
  private _value: DateTimeValue = { date: null, time: null };
  isPopupOpen = false;
  private overlayRef: OverlayRef | null = null;

  // Calendar state
  currentMonth!: { year: number; month: number };
  dayNames: string[] = [];
  monthNames: string[] = [];
  yearRange: number[] = [];

  // Time selection state
  selectedHour = 0;
  selectedMinute = 0;
  selectedSecond = 0;
  selectedPeriod: 'AM' | 'PM' = 'AM';
  hours: number[] = [];
  minutes: number[] = [];
  seconds: number[] = [];

  @ViewChild('datetimePickerTemplate', { static: true })
  datetimePickerTemplate!: TemplateRef<any>;

  constructor(
    private cdr: ChangeDetectorRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.initializeComponent();
    }
  }

  ngOnDestroy(): void {
    this.closePopup();
  }

  private initializeComponent(): void {
    this.initializeCalendar();
    this.initializeTimeLists();
    this.resetToCurrentDateTime();
  }

  private initializeCalendar(): void {
    const now = new Date();
    this.currentMonth = {
      year: now.getFullYear(),
      month: now.getMonth(),
    };

    // Initialize day names
    const locale = this.getCurrentLocale();
    this.dayNames = locale.dayNames.map((name: string) => name.substring(0, 3));
    this.monthNames = locale.monthNames;

    // Initialize year range
    this.yearRange = ChronicaCalendarUtils.updateYearRange(now.getFullYear());
  }

  private initializeTimeLists(): void {
    // Initialize hours
    this.hours = [];
    const timeCfg = this.effectiveTimeConfig;
    const maxHour = timeCfg.timeFormat === '24h' ? 23 : 12;
    const minHour = timeCfg.timeFormat === '24h' ? 0 : 1;

    for (let i = minHour; i <= maxHour; i++) {
      this.hours.push(i);
    }

    // Initialize minutes
    this.minutes = [];
    const minuteStep = timeCfg.minuteStep || 1;
    for (let i = 0; i < 60; i += minuteStep) {
      this.minutes.push(i);
    }

    // Initialize seconds (if enabled)
    if (timeCfg.showSeconds) {
      this.seconds = [];
      const secondStep = timeCfg.secondStep || 1;
      for (let i = 0; i < 60; i += secondStep) {
        this.seconds.push(i);
      }
    }
  }

  private resetToCurrentDateTime(): void {
    const now = new Date();
    this.updateTimeSelection({
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    });
  }

  private updateTimeSelection(time: ChronicaTimeValue): void {
    const timeCfg = this.effectiveTimeConfig;
    if (timeCfg.timeFormat === '24h') {
      this.selectedHour = time.hours;
    } else {
      // Convert 24-hour to 12-hour format
      if (time.hours === 0) {
        this.selectedHour = 12;
        this.selectedPeriod = 'AM';
      } else if (time.hours < 12) {
        this.selectedHour = time.hours;
        this.selectedPeriod = 'AM';
      } else if (time.hours === 12) {
        this.selectedHour = 12;
        this.selectedPeriod = 'PM';
      } else {
        this.selectedHour = time.hours - 12;
        this.selectedPeriod = 'PM';
      }
    }

    this.selectedMinute = time.minutes;
    this.selectedSecond = time.seconds || 0;
  }

  // ControlValueAccessor implementation
  writeValue(value: DateTimeValue | null): void {
    if (value) {
      this._value = { ...value };
      if (value.time) {
        this.updateTimeSelection(value.time);
      }
    } else {
      this._value = { date: null, time: null };
      this.resetToCurrentDateTime();
    }
    this.cdr.detectChanges();
  }

  registerOnChange(fn: (value: DateTimeValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.detectChanges();
  }

  // Getters
  get dateTimeValue(): DateTimeValue {
    return this._value;
  }

  get formattedDateTime(): string {
    if (!this._value.date && !this._value.time) {
      return '';
    }

    const datePart = this._value.date ? this.formatDate(this._value.date) : 'No date';
    const timePart = this._value.time ? this.formatTime(this._value.time) : 'No time';

    return `${datePart} ${timePart}`;
  }

  private formatDate(date: Date): string {
    const locale = this.getCurrentLocale();
    return new Intl.DateTimeFormat(typeof locale === 'string' ? locale : 'en-US').format(date);
  }

  private formatTime(time: ChronicaTimeValue): string {
    const timeCfg = this.effectiveTimeConfig;
    const { hours, minutes, seconds } = time;

    if (timeCfg.timeFormat === '24h') {
      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return timeCfg.showSeconds
        ? `${timeStr}:${(seconds || 0).toString().padStart(2, '0')}`
        : timeStr;
    } else {
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const period = hours < 12 ? 'AM' : 'PM';
      const timeStr = `${displayHour}:${minutes.toString().padStart(2, '0')}`;
      const fullTimeStr = timeCfg.showSeconds
        ? `${timeStr}:${(seconds || 0).toString().padStart(2, '0')}`
        : timeStr;
      return `${fullTimeStr} ${period}`;
    }
  }

  // Popup management
  openPopup(): void {
    if (this.disabled || this.isPopupOpen) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 14,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -14,
        },
      ]);

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef = this.overlay.create(overlayConfig);
    const portal = new TemplatePortal(this.datetimePickerTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.overlayRef.backdropClick().subscribe(() => {
      this.closePopup();
    });

    this.isPopupOpen = true;
    this.calendarOpened.emit();
    this.cdr.detectChanges();
  }

  closePopup(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isPopupOpen = false;
    this.onTouched();
    this.calendarClosed.emit();
    this.cdr.detectChanges();
  }

  togglePopup(): void {
    if (this.isPopupOpen) {
      this.closePopup();
    } else {
      this.openPopup();
    }
  }

  // Calendar methods
  getDaysInMonth(): number[] {
    const year = this.currentMonth.year;
    const month = this.currentMonth.month;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  getFirstDayOffset(): number[] {
    const year = this.currentMonth.year;
    const month = this.currentMonth.month;
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const firstDayOfWeek = this.effectiveCalendarConfig.firstDayOfWeek ?? 0;
    const offset = (firstDayOfMonth - firstDayOfWeek + 7) % 7;
    return Array.from({ length: offset }, (_, i) => i);
  }

  selectDate(day: number): void {
    if (this.isDateDisabled(day) || this.disabled) return;

    const selectedDate = new Date(this.currentMonth.year, this.currentMonth.month, day);
    this._value.date = selectedDate;

    this.dateSelected.emit(new Date(selectedDate));
    this.updateValue();
  }

  isSelectedDate(day: number): boolean {
    if (!this._value.date) return false;
    const date = this._value.date;
    return (
      date.getDate() === day &&
      date.getMonth() === this.currentMonth.month &&
      date.getFullYear() === this.currentMonth.year
    );
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === this.currentMonth.month &&
      today.getFullYear() === this.currentMonth.year
    );
  }

  isDateDisabled(day: number): boolean {
    if (this.disabled) return true;

    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    const cal = this.effectiveCalendarConfig;

    if (cal.minDate && date < cal.minDate) {
      return true;
    }

    if (cal.maxDate && date > cal.maxDate) {
      return true;
    }

    if (cal.disabledDates) {
      return cal.disabledDates.some(
        (disabledDate) =>
          disabledDate.getDate() === day &&
          disabledDate.getMonth() === this.currentMonth.month &&
          disabledDate.getFullYear() === this.currentMonth.year
      );
    }

    return false;
  }

  previousMonth(): void {
    if (this.currentMonth.month === 0) {
      this.currentMonth = { year: this.currentMonth.year - 1, month: 11 };
      this.yearRange = ChronicaCalendarUtils.updateYearRange(this.currentMonth.year);
    } else {
      this.currentMonth = { ...this.currentMonth, month: this.currentMonth.month - 1 };
    }
    this.cdr.detectChanges();
  }

  nextMonth(): void {
    if (this.currentMonth.month === 11) {
      this.currentMonth = { year: this.currentMonth.year + 1, month: 0 };
      this.yearRange = ChronicaCalendarUtils.updateYearRange(this.currentMonth.year);
    } else {
      this.currentMonth = { ...this.currentMonth, month: this.currentMonth.month + 1 };
    }
    this.cdr.detectChanges();
  }

  changeMonth(monthIndex: number): void {
    this.currentMonth = { ...this.currentMonth, month: monthIndex };
    this.cdr.detectChanges();
  }

  changeYear(year: number | string): void {
    const numericYear = typeof year === 'string' ? parseInt(year, 10) : year;
    if (Number.isNaN(numericYear)) return;

    this.currentMonth = { ...this.currentMonth, year: numericYear };
    this.yearRange = ChronicaCalendarUtils.updateYearRange(numericYear);
    this.cdr.detectChanges();
  }

  goToToday(): void {
    const today = new Date();
    this.currentMonth = { year: today.getFullYear(), month: today.getMonth() };
    this.selectDate(today.getDate());
  }

  // Time picker methods
  onHourChange(hour: number): void {
    this.selectedHour = hour;
    this.updateTimeValue();
  }

  onMinuteChange(minute: number): void {
    this.selectedMinute = minute;
    this.updateTimeValue();
  }

  onSecondChange(second: number): void {
    this.selectedSecond = second;
    this.updateTimeValue();
  }

  onPeriodChange(period: 'AM' | 'PM'): void {
    this.selectedPeriod = period;
    this.updateTimeValue();
  }

  private updateTimeValue(): void {
    let hours = this.selectedHour;

    const timeCfg = this.effectiveTimeConfig;
    if (!(timeCfg.timeFormat === '24h')) {
      // Convert 12-hour to 24-hour format
      if (this.selectedPeriod === 'AM' && hours === 12) {
        hours = 0;
      } else if (this.selectedPeriod === 'PM' && hours !== 12) {
        hours += 12;
      }
    }

    const newTimeValue: ChronicaTimeValue = {
      hours,
      minutes: this.selectedMinute,
      seconds: timeCfg.showSeconds ? this.selectedSecond : undefined,
    };

    this._value.time = newTimeValue;
    this.timeSelected.emit(newTimeValue);
    this.updateValue();
  }

  setCurrentTime(): void {
    const now = new Date();
    const timeCfg2 = this.effectiveTimeConfig;
    const currentTime: ChronicaTimeValue = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: timeCfg2.showSeconds ? now.getSeconds() : undefined,
    };

    this.updateTimeSelection(currentTime);
    this._value.time = currentTime;
    this.timeSelected.emit(currentTime);
    this.updateValue();
  }

  setCurrentDateTime(): void {
    const now = new Date();

    // Set current date
    this.currentMonth = { year: now.getFullYear(), month: now.getMonth() };
    this._value.date = new Date(now);
    this.dateSelected.emit(new Date(now));

    // Set current time
    const timeCfg3 = this.effectiveTimeConfig;
    const currentTime: ChronicaTimeValue = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: timeCfg3.showSeconds ? now.getSeconds() : undefined,
    };

    this.updateTimeSelection(currentTime);
    this._value.time = currentTime;
    this.timeSelected.emit(currentTime);

    this.updateValue();
    this.cdr.detectChanges();
  }

  clearDateTime(): void {
    this._value = { date: null, time: null };
    this.onChange(null);
    this.dateTimeChange.emit(this._value);
    this.closePopup();
  }

  private updateValue(): void {
    this.onChange(this._value);
    this.dateTimeChange.emit(this._value);
  }

  // Utility methods
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

  // Template-friendly compatibility getters
  get format24Hour(): boolean {
    return this.effectiveTimeConfig.timeFormat === '24h';
  }

  get showSeconds(): boolean {
    return !!this.effectiveTimeConfig.showSeconds;
  }

  // Effective merged configs (apply defaults + user config)
  get effectiveTimeConfig(): ChronicaTimeConfig {
    return { ...(DEFAULT_TIME_CONFIG as ChronicaTimeConfig), ...(this.config.timeConfig || {}) };
  }

  get effectiveCalendarConfig(): ChronicaCalendarConfig {
    return {
      ...(DEFAULT_CALENDAR_CONFIG as ChronicaCalendarConfig),
      ...(this.config.calendarConfig || {}),
    };
  }
}
