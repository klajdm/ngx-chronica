import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  CalendarDate, 
  CalendarMonth, 
  CalendarConfig, 
  CalendarEvent,
  DEFAULT_CALENDAR_CONFIG 
} from '../models/calendar.models';
import { CalendarService } from '../services/calendar.service';

@Component({
  selector: 'aic-inline-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="aic-calendar" [class]="'aic-theme-' + (config.theme || 'light')">
      <!-- Header with navigation and dropdowns -->
      <div class="aic-header">
        <button 
          class="aic-nav-button" 
          (click)="previousMonth()"
          [disabled]="isPreviousMonthDisabled()"
          type="button"
          aria-label="Previous month">
          &#8249;
        </button>
        
        <div class="aic-month-year-selectors">
          <select
            class="aic-month-select"
            [ngModel]="currentMonth.month"
            (ngModelChange)="changeMonth($event)"
            aria-label="Select month">
            <option *ngFor="let monthName of monthNames; let i = index" [value]="i">
              {{ monthName }}
            </option>
          </select>
          
          <select
            class="aic-year-select"
            [ngModel]="currentMonth.year"
            (ngModelChange)="changeYear($event)"
            aria-label="Select year">
            <option *ngFor="let year of yearRange" [value]="year">
              {{ year }}
            </option>
          </select>
        </div>
        
        <button 
          class="aic-nav-button" 
          (click)="nextMonth()"
          [disabled]="isNextMonthDisabled()"
          type="button"
          aria-label="Next month">
          &#8250;
        </button>
      </div>

      <!-- Day names header -->
      <div class="aic-day-names">
        <div 
          class="aic-day-name" 
          *ngFor="let dayName of dayNames">
          {{ dayName }}
        </div>
      </div>

      <!-- Calendar grid -->
      <div class="aic-calendar-grid">
        <!-- Empty cells for days before the first day of month -->
        <div 
          *ngFor="let _ of getFirstDayOffset()" 
          class="aic-date aic-empty">
        </div>
        
        <!-- Days of month -->
        <div 
          *ngFor="let day of getDaysInMonth()"
          class="aic-date aic-clickable"
          [class.aic-today]="isToday(day)"
          [class.aic-selected]="isSelectedDate(day)"
          [class.aic-disabled]="isDateDisabled(day)"
          (click)="selectDate(day)"
          (keydown.enter)="selectDate(day)"
          (keydown.space)="selectDate(day)"
          tabindex="0"
          role="button"
          [attr.aria-label]="'Select date ' + day">
          {{ day }}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./inline-calendar.component.css']
})
export class InlineCalendarComponent implements OnInit, OnChanges {
  @Input() selectedDate: Date | null = null;
  @Input() config: CalendarConfig = DEFAULT_CALENDAR_CONFIG;
  @Input() initialMonth?: number;
  @Input() initialYear?: number;

  @Output() dateSelected = new EventEmitter<Date>();
  @Output() monthChanged = new EventEmitter<{ month: number; year: number }>();
  @Output() calendarEvent = new EventEmitter<CalendarEvent>();

  currentMonth!: CalendarMonth;
  dayNames: string[] = [];
  monthNames: string[] = [];
  yearRange: number[] = [];

  constructor(private calendarService: CalendarService) {
    // Generate a range of years (current year ± 10 years)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      this.yearRange.push(year);
    }
  }

  ngOnInit(): void {
    this.initializeCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['selectedDate']) {
      this.initializeCalendar();
    }
  }

  private initializeCalendar(): void {
    const now = new Date();
    const month = this.initialMonth ?? now.getMonth();
    const year = this.initialYear ?? now.getFullYear();
    
    this.dayNames = this.calendarService.getDayNames(this.config);
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
    this.generateMonth(year, month);
  }

  private generateMonth(year: number, month: number): void {
    this.currentMonth = this.calendarService.generateCalendarMonth(year, month, this.config);
    
    // Mark selected date if it exists
    if (this.selectedDate) {
      this.updateSelectedDate();
    }
  }

  private updateSelectedDate(): void {
    if (!this.selectedDate) return;

    this.currentMonth.weeks.forEach(week => {
      week.dates.forEach(date => {
        date.isSelected = this.calendarService.isSameDate(date.date, this.selectedDate!);
      });
    });
  }

  // New method to handle day selection with the updated template
  selectDate(day: number): void {
    if (this.isDateDisabled(day)) return;

    const selectedDate = new Date(this.currentMonth.year, this.currentMonth.month, day);
    this.selectedDate = selectedDate;

    // Emit events
    this.dateSelected.emit(new Date(selectedDate));
    this.calendarEvent.emit({
      type: 'dateSelect',
      date: new Date(selectedDate)
    });
  }

  // Method to change month via dropdown
  changeMonth(monthIndex: number): void {
    this.generateMonth(this.currentMonth.year, monthIndex);
    this.monthChanged.emit({ month: monthIndex, year: this.currentMonth.year });
    this.calendarEvent.emit({
      type: 'monthChange',
      month: monthIndex,
      year: this.currentMonth.year
    });
  }

  // Method to change year via dropdown
  changeYear(year: number): void {
    this.generateMonth(year, this.currentMonth.month);
    this.monthChanged.emit({ month: this.currentMonth.month, year });
    this.calendarEvent.emit({
      type: 'yearChange',
      month: this.currentMonth.month,
      year
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
    const date = new Date(this.currentMonth.year, this.currentMonth.month, day);
    
    if (this.config.minDate && date < this.config.minDate) {
      return true;
    }
    
    if (this.config.maxDate && date > this.config.maxDate) {
      return true;
    }
    
    if (this.config.disabledDates) {
      return this.config.disabledDates.some(disabledDate => 
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
      type: 'monthChange',
      month: prev.month,
      year: prev.year
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
      type: 'monthChange',
      month: next.month,
      year: next.year
    });
  }

  isPreviousMonthDisabled(): boolean {
    if (!this.config.minDate) return false;
    
    const firstDayOfCurrentMonth = new Date(this.currentMonth.year, this.currentMonth.month, 1);
    const firstDayOfPreviousMonth = new Date(this.currentMonth.year, this.currentMonth.month - 1, 1);
    
    return firstDayOfPreviousMonth < this.config.minDate;
  }

  isNextMonthDisabled(): boolean {
    if (!this.config.maxDate) return false;
    
    const lastDayOfCurrentMonth = new Date(this.currentMonth.year, this.currentMonth.month + 1, 0);
    const lastDayOfNextMonth = new Date(this.currentMonth.year, this.currentMonth.month + 2, 0);
    
    return lastDayOfNextMonth > this.config.maxDate;
  }
}
