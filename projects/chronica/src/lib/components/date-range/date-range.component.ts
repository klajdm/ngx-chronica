import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  forwardRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewContainerRef,
  ElementRef,
  ViewChild,
  TemplateRef,
  output,
  DestroyRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CHRONICA_LOCALES,
  ChronicaCalendarConfig,
  ChronicaDateRange,
  ChronicaEvent,
  ChronicaLocale,
  ChronicaMonth,
  DEFAULT_CALENDAR_CONFIG,
} from '../../models';
import { ChronicaCalendarUtils } from '../../utils/calendar.utils';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChronicaDateRangeComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  @Input() config: ChronicaCalendarConfig = DEFAULT_CALENDAR_CONFIG;
  @Input() locale: ChronicaLocale | string = 'en-US';
  @Input() placeholder = 'Select date range';
  @Input() disabled = false;
  @Input() required = false;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() initialMonth?: number;
  @Input() initialYear?: number;

  readonly dateRangeChange = output<ChronicaDateRange>();
  readonly calendarEvent = output<ChronicaEvent>();

  // ControlValueAccessor properties
  private onChange = (_value: ChronicaDateRange | null) => {};
  private onTouched = () => {};

  // Calendar state
  currentMonth!: ChronicaMonth;
  dayNames: string[] = [];
  monthNames: string[] = [];
  yearRange: number[] = [];
  isPopupOpen = false;
  private overlayRef: OverlayRef | null = null;
  private readonly destroyRef = inject(DestroyRef);
  focusedDay: number | null = null;
  liveAnnouncement = '';

  // Date range state
  private _dateRange: ChronicaDateRange = { startDate: null, endDate: null };
  private _selectingStartDate = true;
  hoveredDate: Date | null = null;

  @ViewChild('dateRangeTemplate', { static: true }) dateRangeTemplate!: TemplateRef<any>;

  constructor(
    private cdr: ChangeDetectorRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef
  ) {
    this.yearRange = ChronicaCalendarUtils.updateYearRange(new Date().getFullYear());
  }

  ngOnInit(): void {
    this.initializeCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['locale']) {
      this.initializeCalendar();
    }
    if (changes['minDate'] || changes['maxDate']) {
      this.cdr.markForCheck();
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
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(
      year,
      month,
      this.getLocaleConfig()
    );
  }

  // ControlValueAccessor implementation
  writeValue(value: ChronicaDateRange | null): void {
    if (value) {
      this._dateRange = {
        startDate: value.startDate ? new Date(value.startDate) : null,
        endDate: value.endDate ? new Date(value.endDate) : null,
      };
    } else {
      this._dateRange = { startDate: null, endDate: null };
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: ChronicaDateRange | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // Calendar navigation
  private generateMonth(year: number, month: number): void {
    this.yearRange = ChronicaCalendarUtils.updateYearRange(year);
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(
      year,
      month,
      this.getLocaleConfig()
    );
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

  onDayKeydown(event: KeyboardEvent, day: number): void {
    const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];
    if (!navKeys.includes(event.key)) return;
    event.preventDefault();

    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    const weekStartsOn = this.getCurrentLocale().weekStartsOn;

    switch (event.key) {
      case 'ArrowLeft': date.setDate(date.getDate() - 1); break;
      case 'ArrowRight': date.setDate(date.getDate() + 1); break;
      case 'ArrowUp': date.setDate(date.getDate() - 7); break;
      case 'ArrowDown': date.setDate(date.getDate() + 7); break;
      case 'PageUp': date.setMonth(date.getMonth() - 1); break;
      case 'PageDown': date.setMonth(date.getMonth() + 1); break;
      case 'Home': { const dow = (date.getDay() - weekStartsOn + 7) % 7; date.setDate(date.getDate() - dow); break; }
      case 'End': { const dow = (date.getDay() - weekStartsOn + 7) % 7; date.setDate(date.getDate() + (6 - dow)); break; }
    }
    this.navigateToDay(date);
  }

  private navigateToDay(date: Date): void {
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth();
    const targetDay = date.getDate();
    if (targetYear !== this.currentMonth.year || targetMonth !== this.currentMonth.month) {
      this.generateMonth(targetYear, targetMonth);
      this.cdr.markForCheck();
    }
    this.focusedDay = targetDay;
    const locale = this.getCurrentLocale();
    this.liveAnnouncement = `${date.toLocaleDateString('en-US', { weekday: 'long' })}, ${locale.monthNames[targetMonth]} ${targetDay}, ${targetYear}`;
    setTimeout(() => {
      const container = this.overlayRef?.overlayElement ?? this.elementRef.nativeElement;
      (container.querySelector(`[data-day="${targetDay}"]`) as HTMLElement | null)?.focus();
    });
  }

  previousMonth(): void {
    if (this.isPreviousMonthDisabled()) return;

    const prev = ChronicaCalendarUtils.getPreviousMonth(
      this.currentMonth.month,
      this.currentMonth.year
    );
    this.generateMonth(prev.year, prev.month);
  }

  nextMonth(): void {
    if (this.isNextMonthDisabled()) return;

    const next = ChronicaCalendarUtils.getNextMonth(
      this.currentMonth.month,
      this.currentMonth.year
    );
    this.generateMonth(next.year, next.month);
  }

  changeMonth(monthIndex: number): void {
    if (typeof monthIndex !== 'number' || monthIndex < 0 || monthIndex > 11) {
      return;
    }
    this.generateMonth(this.currentMonth.year, monthIndex);
  }

  changeYear(year: number | string): void {
    const numericYear = typeof year === 'string' ? parseInt(year, 10) : year;
    if (Number.isNaN(numericYear)) return;

    this.generateMonth(numericYear, this.currentMonth.month);
  }

  onMonthChange(event: Event): void {
    this.changeMonth(+(event.target as HTMLSelectElement).value);
  }

  onYearChange(event: Event): void {
    this.changeYear(+(event.target as HTMLSelectElement).value);
  }

  isPreviousMonthDisabled(): boolean {
    if (!this.minDate) return false;
    const firstDayOfPreviousMonth = new Date(
      this.currentMonth.year,
      this.currentMonth.month - 1,
      1
    );
    return firstDayOfPreviousMonth < this.minDate;
  }

  isNextMonthDisabled(): boolean {
    if (!this.maxDate) return false;
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

    const locale = this.getCurrentLocale();
    this.liveAnnouncement = `${selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}, ${locale.monthNames[selectedDate.getMonth()]} ${day}, ${selectedDate.getFullYear()} selected`;
    this.onChange(this._dateRange);
    this.dateRangeChange.emit(this._dateRange);
    this.calendarEvent.emit({
      type: 'dateSelect',
      payload: new Date(selectedDate),
      timestamp: Date.now(),
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
    return ChronicaCalendarUtils.isSameDate(date, this._dateRange.startDate);
  }

  isEndDate(day: number): boolean {
    if (!this._dateRange.endDate) return false;
    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    return ChronicaCalendarUtils.isSameDate(date, this._dateRange.endDate);
  }

  isInRange(day: number): boolean {
    if (!this._dateRange.startDate || !this._dateRange.endDate) return false;
    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    return date >= this._dateRange.startDate && date <= this._dateRange.endDate;
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

  isWeekend(day: number): boolean {
    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    return ChronicaCalendarUtils.isWeekend(date);
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
    const firstDayOfWeek = this.config.firstDayOfWeek ?? 0;
    const dayOffset = (today.getDay() - firstDayOfWeek + 7) % 7;
    startOfWeek.setDate(today.getDate() - dayOffset);
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

  formatDate(date: Date): string {
    const locale = this.getCurrentLocale();
    const format = locale.dateFormat;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format.replace('yyyy', year.toString()).replace('MM', month).replace('dd', day);
  }

  //#region Getters
  get dateRange(): ChronicaDateRange {
    return this._dateRange;
  }

  get isSelectingStartDate(): boolean {
    return this._selectingStartDate;
  }

  get formattedDateRange(): string {
    if (!this._dateRange.startDate && !this._dateRange.endDate) {
      return this.placeholder;
    }

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

  get themeClass(): string {
    return `chronica-${this.config.theme || 'light'}`;
  }

  get colorThemeClass(): string {
    return `chronica-${this.config.colorTheme || 'blue'}`;
  }

  //#region Popup functionality
  openPopup(): void {
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
            offsetY: 14,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -14,
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

    this.overlayRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closePopup());

    this.onTouched();
  }

  closePopup(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isPopupOpen = false;
  }
}
