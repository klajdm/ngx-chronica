import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  forwardRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import {
  CalendarMonth,
  CalendarConfig,
  CalendarEvent,
  CalendarLocale,
  DEFAULT_CALENDAR_CONFIG,
  COLOR_THEMES,
  CALENDAR_LOCALES,
} from "../models/calendar.models";
import { CalendarService } from "../services/calendar.service";

@Component({
  selector: "nga-inline-calendar",
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InlineCalendarComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="nga-calendar"
      [class]="'nga-theme-' + (config.theme || 'light')"
      [attr.data-color-theme]="config.colorTheme || 'blue'"
      [style]="getColorThemeStyles()"
    >
      <!-- Header with navigation and dropdowns -->
      <div class="nga-header">
        <button
          class="nga-nav-button"
          (click)="previousMonth()"
          [disabled]="isPreviousMonthDisabled()"
          type="button"
          aria-label="Previous month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-left-icon lucide-chevron-left"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div class="nga-month-year-selectors">
          <select
            class="nga-month-select"
            [ngModel]="currentMonth.month"
            (ngModelChange)="changeMonth($event)"
            aria-label="Select month"
          >
            <option
              *ngFor="let monthName of monthNames; let i = index"
              [value]="i"
            >
              {{ monthName }}
            </option>
          </select>

          <select
            class="nga-year-select"
            [ngModel]="currentMonth.year"
            (ngModelChange)="changeYear($event)"
            aria-label="Select year"
          >
            <option *ngFor="let year of yearRange" [value]="year">
              {{ year }}
            </option>
          </select>
        </div>

        <button
          class="nga-nav-button"
          (click)="nextMonth()"
          [disabled]="isNextMonthDisabled()"
          type="button"
          aria-label="Next month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-right-icon lucide-chevron-right"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <!-- Day names header -->
      <div class="nga-day-names">
        <div class="nga-day-name" *ngFor="let dayName of dayNames">
          {{ dayName }}
        </div>
      </div>

      <!-- Calendar grid -->
      <div class="nga-calendar-grid">
        <!-- Empty cells for days before the first day of month -->
        <div
          *ngFor="let _ of getFirstDayOffset()"
          class="nga-date nga-empty"
        ></div>

        <!-- Days of month -->
        <div
          *ngFor="let day of getDaysInMonth()"
          class="nga-date nga-clickable"
          [class.nga-today]="isToday(day)"
          [class.nga-selected]="isSelectedDate(day)"
          [class.nga-disabled]="isDateDisabled(day)"
          (click)="selectDate(day)"
          (keydown.enter)="selectDate(day)"
          (keydown.space)="selectDate(day)"
          tabindex="0"
          role="button"
          [attr.aria-label]="'Select date ' + day"
        >
          {{ day }}
        </div>
      </div>

      <!-- Today button - positioned at bottom right -->
      <div
        class="nga-today-button-container"
        *ngIf="config.showTodayButton !== false"
      >
        <button class="nga-today-button" (click)="goToToday()" type="button">
          {{ getCurrentLocale().todayLabel }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ["./inline-calendar.component.css"],
})
export class InlineCalendarComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  @Input() selectedDate: Date | null = null;
  @Input() config: CalendarConfig = DEFAULT_CALENDAR_CONFIG;
  @Input() locale: CalendarLocale | string = 'en-US';
  @Input() initialMonth?: number;
  @Input() initialYear?: number;

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

  constructor(private calendarService: CalendarService) {
    // Initialize with current year range
    this.updateYearRange(new Date().getFullYear());
  }

  private updateYearRange(centerYear: number): void {
    // mutate the existing array in-place to avoid breaking bindings in the select
    const start = centerYear - 10;
    const end = centerYear + 10;
    // Resize array if necessary
    this.yearRange.length = 0;
    for (let year = start; year <= end; year++) {
      this.yearRange.push(year);
    }
  }

  ngOnInit(): void {
    this.initializeCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["config"] || changes["locale"]) {
      this.initializeCalendar();
    }
    if (changes["selectedDate"] && !changes["selectedDate"].firstChange) {
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
    this.generateMonth(year, month);
  }

  private generateMonth(year: number, month: number): void {
    this.currentMonth = this.calendarService.generateCalendarMonth(
      year,
      month,
      this.config
    );

    // Mark selected date if it exists
    if (this.selectedDate) {
      this.updateSelectedDate();
    }
  }

  private updateSelectedDate(): void {
    if (!this.selectedDate) return;

    this.currentMonth.weeks.forEach((week) => {
      week.dates.forEach((date) => {
        date.isSelected = this.calendarService.isSameDate(
          date.date,
          this.selectedDate!
        );
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

    const selectedDate = new Date(
      this.currentMonth.year,
      this.currentMonth.month,
      validDay
    );
    this.selectedDate = selectedDate;

    // Call ControlValueAccessor callbacks
    this.onChange(selectedDate);
    this.onTouched();

    // Emit events
    this.dateSelected.emit(new Date(selectedDate));
    this.calendarEvent.emit({
      type: "dateSelect",
      date: new Date(selectedDate),
    });
  }

  // Method to change month via dropdown
  changeMonth(monthIndex: number): void {
    this.generateMonth(this.currentMonth.year, monthIndex);
    this.monthChanged.emit({ month: monthIndex, year: this.currentMonth.year });
    this.calendarEvent.emit({
      type: "monthChange",
      month: monthIndex,
      year: this.currentMonth.year,
    });
  }

  // Method to change year via dropdown
  changeYear(year: number | string): void {
    // Ensure we have a number (template select may pass string)
    const numericYear = typeof year === "string" ? parseInt(year, 10) : year;
    if (Number.isNaN(numericYear)) return;

    // Update year range first (mutates in-place) then update calendar
    this.updateYearRange(numericYear);
    this.generateMonth(numericYear, this.currentMonth.month);
    this.monthChanged.emit({
      month: this.currentMonth.month,
      year: numericYear,
    });
    this.calendarEvent.emit({
      type: "yearChange",
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

    this.generateMonth(prev.year, prev.month);
    this.monthChanged.emit(prev);
    this.calendarEvent.emit({
      type: "monthChange",
      month: prev.month,
      year: prev.year,
    });
  }

  nextMonth(): void {
    if (this.isNextMonthDisabled()) return;

    const next = this.calendarService.getNextMonth(
      this.currentMonth.month,
      this.currentMonth.year
    );

    this.generateMonth(next.year, next.month);
    this.monthChanged.emit(next);
    this.calendarEvent.emit({
      type: "monthChange",
      month: next.month,
      year: next.year,
    });
  }

  isPreviousMonthDisabled(): boolean {
    if (!this.config.minDate) return false;

    const firstDayOfCurrentMonth = new Date(
      this.currentMonth.year,
      this.currentMonth.month,
      1
    );
    const firstDayOfPreviousMonth = new Date(
      this.currentMonth.year,
      this.currentMonth.month - 1,
      1
    );

    return firstDayOfPreviousMonth < this.config.minDate;
  }

  isNextMonthDisabled(): boolean {
    if (!this.config.maxDate) return false;

    const lastDayOfCurrentMonth = new Date(
      this.currentMonth.year,
      this.currentMonth.month + 1,
      0
    );
    const lastDayOfNextMonth = new Date(
      this.currentMonth.year,
      this.currentMonth.month + 2,
      0
    );

    return lastDayOfNextMonth > this.config.maxDate;
  }

  goToToday(): void {
    const today = new Date();
    this.generateMonth(today.getFullYear(), today.getMonth());
    this.selectDate(today.getDate());
    this.monthChanged.emit({
      month: today.getMonth(),
      year: today.getFullYear(),
    });
    this.calendarEvent.emit({
      type: "monthChange",
      month: today.getMonth(),
      year: today.getFullYear(),
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
    const colorTheme = this.config.colorTheme || "blue";
    const colors = COLOR_THEMES[colorTheme];

    return {
      "--nga-primary": colors.primary,
      "--nga-primary-hover": colors.primaryHover,
      "--nga-primary-light": colors.primaryLight,
      "--nga-primary-dark": colors.primaryDark,
      "--nga-accent": colors.accent,
      "--nga-focus": colors.focus,
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
    
    return format
      .replace('yyyy', year.toString())
      .replace('MM', month)
      .replace('dd', day);
  }
}
