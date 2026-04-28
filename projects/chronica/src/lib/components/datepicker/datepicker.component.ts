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
  ViewContainerRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef, OverlayConfig, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ChronicaMonth,
  ChronicaCalendarConfig,
  ChronicaEvent,
  ChronicaLocale,
  DEFAULT_CALENDAR_CONFIG,
  CHRONICA_LOCALES,
} from '../../models/index';
import { ChronicaCalendarUtils } from '../../utils/calendar.utils';

@Component({
  selector: 'chronica-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChronicaDatepickerComponent),
      multi: true,
    },
  ],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
})
export class ChronicaDatepickerComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor
{
  @Input() selectedDate: Date | null = null;
  @Input() config: ChronicaCalendarConfig = DEFAULT_CALENDAR_CONFIG;
  @Input() locale: ChronicaLocale | string = 'en-US';
  @Input() initialMonth?: number;
  @Input() initialYear?: number;
  @Input() popupPosition: 'bottom' | 'top' | 'auto' = 'auto';
  @Input() hideInput: boolean = false;
  @Input() placeholder: string = 'Select date';

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
  isPopupOpen = false;
  private overlayRef: OverlayRef | null = null;
  private destroy$ = new Subject<void>();

  @ViewChild('calendarTemplate', { static: true }) calendarTemplate!: TemplateRef<any>;

  constructor(
    private cdr: ChangeDetectorRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef
  ) {
    // Initialize with current year range
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
      // Only update selected date display, don't reinitialize calendar
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

    // Update year range first, then generate month without additional year range update
    this.yearRange = ChronicaCalendarUtils.updateYearRange(year);
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(year, month, this.config);

    // Mark selected date if it exists
    if (this.selectedDate) {
      this.updateSelectedDate();
    }
  }

  private generateMonth(year: number, month: number): void {
    // Ensure year range includes the target year before generating month
    this.yearRange = ChronicaCalendarUtils.updateYearRange(year);

    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(year, month, this.config);

    // Mark selected date if it exists
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

  // New method to handle day selection with the updated template
  selectDate(day: number): void {
    if (this.isDateDisabled(day) || this.disabled) return;

    // Ensure we don't exceed the actual days in the current month
    const daysInCurrentMonth = new Date(
      this.currentMonth.year,
      this.currentMonth.month + 1,
      0
    ).getDate();
    const validDay = Math.min(day, daysInCurrentMonth);

    const selectedDate = new Date(this.currentMonth.year, this.currentMonth.month, validDay);
    this.selectedDate = selectedDate;

    // Call ControlValueAccessor callbacks
    this.onChange(selectedDate);
    this.onTouched();

    // Emit events
    this.dateSelected.emit(new Date(selectedDate));
    this.calendarEvent.emit({
      type: 'dateSelect',
      payload: new Date(selectedDate),
      timestamp: Date.now(),
    });

    // Close popup after date selection
    this.closePopup();
  }

  // Method to change month via dropdown
  changeMonth(monthIndex: number): void {
    // Ensure monthIndex is a valid number
    if (typeof monthIndex !== 'number' || monthIndex < 0 || monthIndex > 11) {
      return;
    }

    // Update currentMonth directly without calling generateMonth to avoid year range updates
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(
      this.currentMonth.year,
      monthIndex,
      this.config
    );

    // Mark selected date if it exists
    if (this.selectedDate) {
      this.updateSelectedDate();
    }

    this.monthChanged.emit({ month: monthIndex, year: this.currentMonth.year });
    this.calendarEvent.emit({
      type: 'monthChange',
      payload: { month: monthIndex, year: this.currentMonth.year },
      timestamp: Date.now(),
    });
  }

  // Method to change year via dropdown
  changeYear(year: number | string): void {
    // Ensure we have a number (template select may pass string)
    const numericYear = typeof year === 'string' ? parseInt(year, 10) : year;
    if (Number.isNaN(numericYear)) return;

    // Update year range first (mutates in-place) then update calendar
    this.yearRange = ChronicaCalendarUtils.updateYearRange(numericYear);
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(
      numericYear,
      this.currentMonth.month,
      this.config
    );

    // Mark selected date if it exists
    if (this.selectedDate) {
      this.updateSelectedDate();
    }

    this.monthChanged.emit({
      month: this.currentMonth.month,
      year: numericYear,
    });
    this.calendarEvent.emit({
      type: 'yearChange',
      payload: { month: this.currentMonth.month, year: numericYear },
      timestamp: Date.now(),
    });
  }

  // Get days in the current month for the calendar
  getDaysInMonth(): number[] {
    const year = this.currentMonth.year;
    const month = this.currentMonth.month;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  // Get the offset for the first day of the month (empty cells before the 1st)
  getFirstDayOffset(): number[] {
    const year = this.currentMonth.year;
    const month = this.currentMonth.month;
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const firstDayOfWeek = this.config.firstDayOfWeek || 0;
    const offset = (firstDayOfMonth - firstDayOfWeek + 7) % 7;
    return Array.from({ length: offset }, (_, i) => i);
  }

  // Check if a day is the selected date
  isSelectedDate(day: number): boolean {
    if (!this.selectedDate) return false;
    const date = this.selectedDate;
    return (
      date.getDate() === day &&
      date.getMonth() === this.currentMonth.month &&
      date.getFullYear() === this.currentMonth.year
    );
  }

  // Check if a day is today
  isToday(day: number): boolean {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === this.currentMonth.month &&
      today.getFullYear() === this.currentMonth.year
    );
  }

  // Check if a date is disabled
  isDateDisabled(day: number): boolean {
    if (this.disabled) return true;

    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);

    if (this.config.minDate && date < this.config.minDate) {
      return true;
    }

    if (this.config.maxDate && date > this.config.maxDate) {
      return true;
    }

    if (this.config.disabledDates) {
      return this.config.disabledDates.some((disabledDate) =>
        ChronicaCalendarUtils.isSameDate(date, disabledDate)
      );
    }

    return false;
  }

  isWeekend(day: number): boolean {
    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    return ChronicaCalendarUtils.isWeekend(date);
  }

  getDateLabel(day: number): string {
    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    const locale = this.getCurrentLocale();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = locale.monthNames[date.getMonth()];
    return `${dayName}, ${monthName} ${day}, ${date.getFullYear()}`;
  }

  previousMonth(): void {
    if (this.isPreviousMonthDisabled()) return;

    const prev = ChronicaCalendarUtils.getPreviousMonth(
      this.currentMonth.month,
      this.currentMonth.year
    );

    // Update year range to include the new year if needed
    this.yearRange = ChronicaCalendarUtils.updateYearRange(prev.year);

    // Update currentMonth directly to avoid additional year range calls
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(
      prev.year,
      prev.month,
      this.config
    );

    // Mark selected date if it exists
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
    if (this.isNextMonthDisabled()) return;

    const next = ChronicaCalendarUtils.getNextMonth(
      this.currentMonth.month,
      this.currentMonth.year
    );

    // Update year range to include the new year if needed
    this.yearRange = ChronicaCalendarUtils.updateYearRange(next.year);

    // Update currentMonth directly to avoid additional year range calls
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(
      next.year,
      next.month,
      this.config
    );

    // Mark selected date if it exists
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

  isPreviousMonthDisabled(): boolean {
    if (!this.config.minDate) return false;

    const firstDayOfPreviousMonth = new Date(
      this.currentMonth.year,
      this.currentMonth.month - 1,
      1
    );

    return firstDayOfPreviousMonth < this.config.minDate;
  }

  isNextMonthDisabled(): boolean {
    if (!this.config.maxDate) return false;

    const lastDayOfNextMonth = new Date(this.currentMonth.year, this.currentMonth.month + 2, 0);

    return lastDayOfNextMonth > this.config.maxDate;
  }

  goToToday(): void {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();

    // Update year range to include today's year if it's not in current range
    this.yearRange = ChronicaCalendarUtils.updateYearRange(todayYear);

    // Update currentMonth directly to avoid additional year range calls
    this.currentMonth = ChronicaCalendarUtils.generateCalendarMonth(
      todayYear,
      todayMonth,
      this.config
    );

    // Select today's date
    this.selectDate(today.getDate());

    this.monthChanged.emit({
      month: todayMonth,
      year: todayYear,
    });
    this.calendarEvent.emit({
      type: 'monthChange',
      payload: { month: todayMonth, year: todayYear },
      timestamp: Date.now(),
    });
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

  // Get current locale configuration
  getCurrentLocale(): ChronicaLocale {
    if (typeof this.locale === 'string') {
      return CHRONICA_LOCALES[this.locale] || CHRONICA_LOCALES['en-US'];
    }
    return this.locale;
  }

  // Get day names from locale, respecting firstDayOfWeek
  private getDayNamesFromLocale(locale: ChronicaLocale): string[] {
    const firstDayOfWeek = this.config.firstDayOfWeek ?? locale.weekStartsOn;
    const dayNames = [...locale.dayNamesShort];

    // Rotate array to start with the configured first day of week
    for (let i = 0; i < firstDayOfWeek; i++) {
      dayNames.push(dayNames.shift()!);
    }

    return dayNames;
  }

  // Format date according to locale
  formatDate(date: Date): string {
    const locale = this.getCurrentLocale();
    const format = locale.dateFormat;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format.replace('yyyy', year.toString()).replace('MM', month).replace('dd', day);
  }

  //#region Getters
  get formattedDate(): string {
    if (!this.selectedDate) {
      return this.placeholder;
    }
    return this.formatDate(this.selectedDate);
  }

  // Get theme class for styling
  get themeClass(): string {
    return `chronica-${this.config.theme || 'light'}`;
  }

  // Get color theme class for styling
  get colorThemeClass(): string {
    return `chronica-${this.config.colorTheme || 'blue'}`;
  }

  private getPositions(): ConnectedPosition[] {
    const bottom: ConnectedPosition = { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 14 };
    const top: ConnectedPosition = { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -14 };
    if (this.popupPosition === 'bottom') return [bottom];
    if (this.popupPosition === 'top') return [top];
    return [bottom, top];
  }

  //#region Popup management
  openPopup(): void {
    if (this.overlayRef) {
      return;
    }

    const overlayConfig = new OverlayConfig({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions(this.getPositions()),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef = this.overlay.create(overlayConfig);

    // Create and attach the template portal
    const portal = new TemplatePortal(this.calendarTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.isPopupOpen = true;

    if (this.selectedDate) {
      // When opening popup, navigate to the selected date's month/year
      this.generateMonth(this.selectedDate.getFullYear(), this.selectedDate.getMonth());
    }

    this.overlayRef.backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.closePopup());
  }

  closePopup(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isPopupOpen = false;
  }

  //#region Cleanup
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
