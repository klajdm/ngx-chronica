import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  forwardRef,
  ChangeDetectorRef,
  HostListener,
  ViewContainerRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  CalendarMonth,
  CalendarConfig,
  CalendarEvent,
  CalendarLocale,
  DEFAULT_CALENDAR_CONFIG,
  COLOR_THEMES,
  CALENDAR_LOCALES,
} from '../../models/chronica.models';
import { ChronicaService } from '../../services/chronica.service';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

@Component({
  selector: 'chronica-date-range',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChronicaDateRangeComponent),
      multi: true,
    },
  ],
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css'],
})
export class ChronicaDateRangeComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor
{
  @Input() config: CalendarConfig = DEFAULT_CALENDAR_CONFIG;
  @Input() locale: CalendarLocale | string = 'en-US';
  @Input() placeholder = 'Select date range';
  @Input() disabled = false;
  @Input() required = false;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() initialMonth?: number;
  @Input() initialYear?: number;

  @Output() dateRangeChange = new EventEmitter<DateRange>();
  @Output() calendarEvent = new EventEmitter<CalendarEvent>();

  // ControlValueAccessor properties
  private onChange = (value: DateRange | null) => {};
  private onTouched = () => {};

  // Calendar state
  currentMonth!: CalendarMonth;
  dayNames: string[] = [];
  monthNames: string[] = [];
  yearRange: number[] = [];
  isPopupOpen = false;
  private overlayRef: OverlayRef | null = null;

  // Date range state
  private _dateRange: DateRange = { startDate: null, endDate: null };
  private _selectingStartDate = true;
  hoveredDate: Date | null = null;

  @ViewChild('dateRangeTemplate', { static: true }) dateRangeTemplate!: TemplateRef<any>;

  constructor(
    private calendarService: ChronicaService,
    private cdr: ChangeDetectorRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef
  ) {
    this.updateYearRange(new Date().getFullYear());
  }

  ngOnInit(): void {
    this.initializeCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['locale']) {
      this.initializeCalendar();
    }
    if (changes['minDate'] || changes['maxDate']) {
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
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

  // ControlValueAccessor implementation
  writeValue(value: DateRange | null): void {
    if (value) {
      this._dateRange = {
        startDate: value.startDate ? new Date(value.startDate) : null,
        endDate: value.endDate ? new Date(value.endDate) : null,
      };
    } else {
      this._dateRange = { startDate: null, endDate: null };
    }
  }

  registerOnChange(fn: (value: DateRange | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Getters
  get dateRange(): DateRange {
    return this._dateRange;
  }

  get isSelectingStartDate(): boolean {
    return this._selectingStartDate;
  }

  get formattedDateRange(): string {
    if (!this._dateRange.startDate && !this._dateRange.endDate) {
      return this.placeholder;
    }

    const locale = this.getCurrentLocale();
    const startStr = this._dateRange.startDate ? this.formatDate(this._dateRange.startDate) : '';
    const endStr = this._dateRange.endDate ? this.formatDate(this._dateRange.endDate) : '';

    if (startStr && endStr) {
      return `${startStr} - ${endStr}`;
    } else if (startStr) {
      return `${startStr} - Select end date`;
    } else if (endStr) {
      return `Select start date - ${endStr}`;
    }

    return this.placeholder;
  }

  // Popup functionality
  togglePopup(): void {
    if (this.disabled) return;

    if (this.isPopupOpen) {
      this.closePopup();
    } else {
      this.openPopup();
    }
  }

  private openPopup(): void {
    if (this.overlayRef) {
      return;
    }

    const overlayConfig = new OverlayConfig({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 8,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -8,
          },
        ]),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef = this.overlay.create(overlayConfig);

    const portal = new TemplatePortal(this.dateRangeTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.isPopupOpen = true;

    // Set calendar to show the month of start date or current month
    const dateToShow = this._dateRange.startDate || new Date();
    this.generateMonth(dateToShow.getFullYear(), dateToShow.getMonth());
    this._selectingStartDate = !this._dateRange.startDate || !this._dateRange.endDate;

    this.overlayRef.backdropClick().subscribe(() => {
      this.closePopup();
    });

    this.onTouched();
  }

  closePopup(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isPopupOpen = false;
  }

  // Calendar navigation
  private generateMonth(year: number, month: number): void {
    this.updateYearRange(year);
    this.currentMonth = this.calendarService.generateCalendarMonth(year, month, this.config);
  }

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
    const firstDayOfWeek = this.config.firstDayOfWeek || 0;
    const offset = (firstDayOfMonth - firstDayOfWeek + 7) % 7;
    return Array.from({ length: offset }, (_, i) => i);
  }

  previousMonth(): void {
    if (this.isPreviousMonthDisabled()) return;

    const prev = this.calendarService.getPreviousMonth(
      this.currentMonth.month,
      this.currentMonth.year
    );
    this.generateMonth(prev.year, prev.month);
    this.cdr.detectChanges();
  }

  nextMonth(): void {
    if (this.isNextMonthDisabled()) return;

    const next = this.calendarService.getNextMonth(this.currentMonth.month, this.currentMonth.year);
    this.generateMonth(next.year, next.month);
    this.cdr.detectChanges();
  }

  changeMonth(monthIndex: number): void {
    if (typeof monthIndex !== 'number' || monthIndex < 0 || monthIndex > 11) {
      return;
    }
    this.generateMonth(this.currentMonth.year, monthIndex);
    this.cdr.detectChanges();
  }

  changeYear(year: number | string): void {
    const numericYear = typeof year === 'string' ? parseInt(year, 10) : year;
    if (Number.isNaN(numericYear)) return;

    this.generateMonth(numericYear, this.currentMonth.month);
    this.cdr.detectChanges();
  }

  isPreviousMonthDisabled(): boolean {
    if (!this.minDate) return false;
    const firstDayOfCurrentMonth = new Date(this.currentMonth.year, this.currentMonth.month, 1);
    const firstDayOfPreviousMonth = new Date(
      this.currentMonth.year,
      this.currentMonth.month - 1,
      1
    );
    return firstDayOfPreviousMonth < this.minDate;
  }

  isNextMonthDisabled(): boolean {
    if (!this.maxDate) return false;
    const lastDayOfCurrentMonth = new Date(this.currentMonth.year, this.currentMonth.month + 1, 0);
    const lastDayOfNextMonth = new Date(this.currentMonth.year, this.currentMonth.month + 2, 0);
    return lastDayOfNextMonth > this.maxDate;
  }

  // Date selection
  selectDate(day: number): void {
    if (this.isDayDisabled(day) || this.disabled) return;

    const selectedDate = new Date(this.currentMonth.year, this.currentMonth.month, day);

    if (this._selectingStartDate) {
      this._dateRange.startDate = selectedDate;
      if (this._dateRange.endDate && selectedDate > this._dateRange.endDate) {
        this._dateRange.endDate = null;
      }
      this._selectingStartDate = false;
    } else {
      if (this._dateRange.startDate && selectedDate < this._dateRange.startDate) {
        this._dateRange.endDate = this._dateRange.startDate;
        this._dateRange.startDate = selectedDate;
      } else {
        this._dateRange.endDate = selectedDate;
      }
      this._selectingStartDate = true;
      this.closePopup();
    }

    this.onChange(this._dateRange);
    this.dateRangeChange.emit(this._dateRange);
    this.calendarEvent.emit({
      type: 'dateSelect',
      date: selectedDate,
    });
  }

  // Date hover for range preview
  onDateHover(day: number): void {
    const hoveredDate = new Date(this.currentMonth.year, this.currentMonth.month, day);
    this.hoveredDate = hoveredDate;
  }

  onDateLeave(): void {
    this.hoveredDate = null;
  }

  // Date state checks
  isStartDate(day: number): boolean {
    if (!this._dateRange.startDate) return false;
    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    return this.calendarService.isSameDate(date, this._dateRange.startDate);
  }

  isEndDate(day: number): boolean {
    if (!this._dateRange.endDate) return false;
    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    return this.calendarService.isSameDate(date, this._dateRange.endDate);
  }

  isInRange(day: number): boolean {
    if (!this._dateRange.startDate || !this._dateRange.endDate) return false;
    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    return date > this._dateRange.startDate && date < this._dateRange.endDate;
  }

  isInHoverRange(day: number): boolean {
    if (!this._dateRange.startDate || !this.hoveredDate || this._selectingStartDate) {
      return false;
    }
    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    const start = this._dateRange.startDate;
    const end = this.hoveredDate;
    return (date > start && date < end) || (date > end && date < start);
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === this.currentMonth.month &&
      today.getFullYear() === this.currentMonth.year
    );
  }

  isDateDisabled(date: Date): boolean {
    if (this.disabled) return true;
    if (this.minDate && date < this.minDate) return true;
    if (this.maxDate && date > this.maxDate) return true;
    return false;
  }

  isDayDisabled(day: number): boolean {
    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    return this.isDateDisabled(date);
  }

  // Quick select presets
  selectToday(): void {
    const today = new Date();
    this._dateRange = { startDate: today, endDate: today };
    this._selectingStartDate = true;
    this.onChange(this._dateRange);
    this.dateRangeChange.emit(this._dateRange);
    this.closePopup();
  }

  selectThisWeek(): void {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    this._dateRange = { startDate: startOfWeek, endDate: endOfWeek };
    this._selectingStartDate = true;
    this.onChange(this._dateRange);
    this.dateRangeChange.emit(this._dateRange);
    this.closePopup();
  }

  selectThisMonth(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this._dateRange = { startDate: startOfMonth, endDate: endOfMonth };
    this._selectingStartDate = true;
    this.onChange(this._dateRange);
    this.dateRangeChange.emit(this._dateRange);
    this.closePopup();
  }

  clearRange(): void {
    this._dateRange = { startDate: null, endDate: null };
    this._selectingStartDate = true;
    this.onChange(this._dateRange);
    this.dateRangeChange.emit(this._dateRange);
  }

  getDaysDifference(): number {
    if (!this._dateRange.startDate || !this._dateRange.endDate) {
      return 0;
    }
    const timeDiff = this._dateRange.endDate.getTime() - this._dateRange.startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  }

  // Utility methods
  getColorThemeStyles(): { [key: string]: string } {
    const colorTheme = this.config.colorTheme || 'blue';
    const colors = COLOR_THEMES[colorTheme];

    return {
      '--chronica-primary': colors.primary,
      '--chronica-primary-hover': colors.primaryHover,
      '--chronica-primary-light': colors.primaryLight,
      '--chronica-primary-dark': colors.primaryDark,
      '--chronica-accent': colors.accent,
      '--chronica-focus': colors.focus,
    };
  }

  getCurrentLocale(): CalendarLocale {
    if (typeof this.locale === 'string') {
      return CALENDAR_LOCALES[this.locale] || CALENDAR_LOCALES['en-US'];
    }
    return this.locale;
  }

  private getDayNamesFromLocale(locale: CalendarLocale): string[] {
    const firstDayOfWeek = this.config.firstDayOfWeek ?? locale.weekStartsOn;
    const dayNames = [...locale.dayNamesShort];

    for (let i = 0; i < firstDayOfWeek; i++) {
      dayNames.push(dayNames.shift()!);
    }

    return dayNames;
  }

  formatDate(date: Date): string {
    const locale = this.getCurrentLocale();
    const format = locale.dateFormat;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format.replace('yyyy', year.toString()).replace('MM', month).replace('dd', day);
  }

  get themeClass(): string {
    return `chronica-${this.config.theme || 'light'}`;
  }

  get colorThemeClass(): string {
    return `chronica-${this.config.colorTheme || 'blue'}`;
  }
}
