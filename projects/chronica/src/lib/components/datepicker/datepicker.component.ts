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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
export class ChronicaDatepickerComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() selectedDate: Date | null = null;
  @Input() config: CalendarConfig = DEFAULT_CALENDAR_CONFIG;
  @Input() locale: CalendarLocale | string = 'en-US';
  @Input() initialMonth?: number;
  @Input() initialYear?: number;
  @Input() popupPosition: 'bottom' | 'top' | 'auto' = 'auto';

  @Output() dateSelected = new EventEmitter<Date>();
  @Output() monthChanged = new EventEmitter<{ month: number; year: number }>();
  @Output() calendarEvent = new EventEmitter<CalendarEvent>();

  // ControlValueAccessor properties
  private onChange = (value: Date | null) => {};
  private onTouched = () => {};
  disabled = false;

  currentMonth!: CalendarMonth;
  dayNames: string[] = [];
  monthNames: string[] = [];
  yearRange: number[] = [];
  isPopupOpen = false;

  constructor(
    private calendarService: ChronicaService,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize with current year range
    this.updateYearRange(new Date().getFullYear());
  }

  private updateYearRange(centerYear: number): void {
    // Create new array to avoid reference issues with Angular change detection
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
    this.updateYearRange(year);
    this.currentMonth = this.calendarService.generateCalendarMonth(year, month, this.config);

    // Mark selected date if it exists
    if (this.selectedDate) {
      this.updateSelectedDate();
    }
  }

  private generateMonth(year: number, month: number): void {
    // Ensure year range includes the target year before generating month
    this.updateYearRange(year);

    this.currentMonth = this.calendarService.generateCalendarMonth(year, month, this.config);

    // Mark selected date if it exists
    if (this.selectedDate) {
      this.updateSelectedDate();
    }
  }

  private updateSelectedDate(): void {
    if (!this.selectedDate) return;

    this.currentMonth.weeks.forEach((week) => {
      week.dates.forEach((date) => {
        date.isSelected = this.calendarService.isSameDate(date.date, this.selectedDate!);
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
      date: new Date(selectedDate),
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
    this.currentMonth = this.calendarService.generateCalendarMonth(
      this.currentMonth.year,
      monthIndex,
      this.config
    );

    // Mark selected date if it exists
    if (this.selectedDate) {
      this.updateSelectedDate();
    }

    // Force change detection to ensure dropdown stays in sync
    this.cdr.detectChanges();

    this.monthChanged.emit({ month: monthIndex, year: this.currentMonth.year });
    this.calendarEvent.emit({
      type: 'monthChange',
      month: monthIndex,
      year: this.currentMonth.year,
    });
  }

  // Method to change year via dropdown
  changeYear(year: number | string): void {
    // Ensure we have a number (template select may pass string)
    const numericYear = typeof year === 'string' ? parseInt(year, 10) : year;
    if (Number.isNaN(numericYear)) return;

    // Update year range first (mutates in-place) then update calendar
    this.updateYearRange(numericYear);
    this.currentMonth = this.calendarService.generateCalendarMonth(
      numericYear,
      this.currentMonth.month,
      this.config
    );

    // Mark selected date if it exists
    if (this.selectedDate) {
      this.updateSelectedDate();
    }

    // Force change detection to ensure dropdown stays in sync
    this.cdr.detectChanges();

    this.monthChanged.emit({
      month: this.currentMonth.month,
      year: numericYear,
    });
    this.calendarEvent.emit({
      type: 'yearChange',
      month: this.currentMonth.month,
      year: numericYear,
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
        this.calendarService.isSameDate(date, disabledDate)
      );
    }

    return false;
  }

  previousMonth(): void {
    if (this.isPreviousMonthDisabled()) return;

    const prev = this.calendarService.getPreviousMonth(
      this.currentMonth.month,
      this.currentMonth.year
    );

    // Update year range to include the new year if needed
    this.updateYearRange(prev.year);

    // Update currentMonth directly to avoid additional year range calls
    this.currentMonth = this.calendarService.generateCalendarMonth(
      prev.year,
      prev.month,
      this.config
    );

    // Mark selected date if it exists
    if (this.selectedDate) {
      this.updateSelectedDate();
    }

    // Force change detection to ensure dropdown stays in sync
    this.cdr.detectChanges();

    this.monthChanged.emit(prev);
    this.calendarEvent.emit({
      type: 'monthChange',
      month: prev.month,
      year: prev.year,
    });
  }

  nextMonth(): void {
    if (this.isNextMonthDisabled()) return;

    const next = this.calendarService.getNextMonth(this.currentMonth.month, this.currentMonth.year);

    // Update year range to include the new year if needed
    this.updateYearRange(next.year);

    // Update currentMonth directly to avoid additional year range calls
    this.currentMonth = this.calendarService.generateCalendarMonth(
      next.year,
      next.month,
      this.config
    );

    // Mark selected date if it exists
    if (this.selectedDate) {
      this.updateSelectedDate();
    }

    // Force change detection to ensure dropdown stays in sync
    this.cdr.detectChanges();

    this.monthChanged.emit(next);
    this.calendarEvent.emit({
      type: 'monthChange',
      month: next.month,
      year: next.year,
    });
  }

  isPreviousMonthDisabled(): boolean {
    if (!this.config.minDate) return false;

    const firstDayOfCurrentMonth = new Date(this.currentMonth.year, this.currentMonth.month, 1);
    const firstDayOfPreviousMonth = new Date(
      this.currentMonth.year,
      this.currentMonth.month - 1,
      1
    );

    return firstDayOfPreviousMonth < this.config.minDate;
  }

  isNextMonthDisabled(): boolean {
    if (!this.config.maxDate) return false;

    const lastDayOfCurrentMonth = new Date(this.currentMonth.year, this.currentMonth.month + 1, 0);
    const lastDayOfNextMonth = new Date(this.currentMonth.year, this.currentMonth.month + 2, 0);

    return lastDayOfNextMonth > this.config.maxDate;
  }

  goToToday(): void {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();

    // Update year range to include today's year if it's not in current range
    this.updateYearRange(todayYear);

    // Update currentMonth directly to avoid additional year range calls
    this.currentMonth = this.calendarService.generateCalendarMonth(
      todayYear,
      todayMonth,
      this.config
    );

    // Select today's date
    this.selectDate(today.getDate());

    // Force change detection to ensure dropdown stays in sync
    this.cdr.detectChanges();

    this.monthChanged.emit({
      month: todayMonth,
      year: todayYear,
    });
    this.calendarEvent.emit({
      type: 'monthChange',
      month: todayMonth,
      year: todayYear,
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

  // Get CSS custom properties for color theming
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

  // Get current locale configuration
  getCurrentLocale(): CalendarLocale {
    if (typeof this.locale === 'string') {
      return CALENDAR_LOCALES[this.locale] || CALENDAR_LOCALES['en-US'];
    }
    return this.locale;
  }

  // Get day names from locale, respecting firstDayOfWeek
  private getDayNamesFromLocale(locale: CalendarLocale): string[] {
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

  // Popup functionality methods
  togglePopup(): void {
    this.isPopupOpen = !this.isPopupOpen;
    if (this.isPopupOpen && this.selectedDate) {
      // When opening popup, navigate to the selected date's month/year
      this.generateMonth(this.selectedDate.getFullYear(), this.selectedDate.getMonth());
    }
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isPopupOpen) {
      const target = event.target as HTMLElement;
      const calendarContainer = target.closest('.chronica-calendar-container');

      if (!calendarContainer) {
        this.closePopup();
      }
    }
  }
}
