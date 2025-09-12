import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  template: `
    <div class="aic-calendar" [class]="'aic-theme-' + (config.theme || 'light')">
      <!-- Header -->
      <div class="aic-header">
        <button 
          class="aic-nav-button" 
          (click)="previousMonth()"
          [disabled]="isPreviousMonthDisabled()"
          type="button">
          &#8249;
        </button>
        
        <div class="aic-month-year">
          <span class="aic-month">{{ currentMonth.name }}</span>
          <span class="aic-year">{{ currentMonth.year }}</span>
        </div>
        
        <button 
          class="aic-nav-button" 
          (click)="nextMonth()"
          [disabled]="isNextMonthDisabled()"
          type="button">
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
        <div 
          class="aic-week" 
          *ngFor="let week of currentMonth.weeks">
          <div 
            class="aic-date"
            *ngFor="let date of week.dates"
            [class.aic-today]="date.isToday"
            [class.aic-selected]="date.isSelected"
            [class.aic-disabled]="date.isDisabled"
            [class.aic-other-month]="!date.isInCurrentMonth"
            [class.aic-weekend]="date.isWeekend"
            [class.aic-clickable]="!date.isDisabled"
            (click)="selectDate(date)">
            <span class="aic-date-number">{{ date.day }}</span>
          </div>
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

  constructor(private calendarService: CalendarService) {}

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

  selectDate(date: CalendarDate): void {
    if (date.isDisabled) return;

    // Clear previous selection
    this.currentMonth.weeks.forEach(week => {
      week.dates.forEach(d => d.isSelected = false);
    });

    // Set new selection
    date.isSelected = true;
    this.selectedDate = new Date(date.date);

    // Emit events
    this.dateSelected.emit(new Date(date.date));
    this.calendarEvent.emit({
      type: 'dateSelect',
      date: new Date(date.date)
    });
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
