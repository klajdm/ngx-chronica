import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChronicaInlineCalendarComponent } from '../../../../../projects/chronica/src/lib/components/inline-calendar/inline-calendar.component';
import {
  CalendarConfig,
  DEFAULT_CALENDAR_CONFIG,
} from '../../../../../projects/chronica/src/lib/models/chronica.models';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-inline-calendar-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaInlineCalendarComponent],
  templateUrl: './inline-calendar-demo.component.html',
})
export class InlineCalendarDemoComponent {
  private readonly themeService = inject(ThemeService);

  // Basic inline calendar
  basicSelectedDate: Date | null = null;
  basicConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
    })
  );

  // Compact inline calendar
  compactSelectedDate: Date | null = null;
  compactConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
      showTodayButton: false,
    })
  );

  // Date range restricted inline calendar
  restrictedSelectedDate: Date | null = null;
  restrictedConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
      minDate: new Date(2024, 0, 1),
      maxDate: new Date(2024, 11, 31),
    })
  );

  // Weekend disabled calendar
  weekendDisabledSelected: Date | null = null;
  weekendDisabledConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
      disabledDates: this.generateWeekendDates(),
    })
  );

  // Pre-selected date calendar
  preSelectedDate: Date | null = new Date();
  preSelectedConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
    })
  );

  onBasicDateSelected(date: Date): void {
    this.basicSelectedDate = date;
    console.log('Basic inline calendar date selected:', date);
  }

  onCompactDateSelected(date: Date): void {
    this.compactSelectedDate = date;
    console.log('Compact inline calendar date selected:', date);
  }

  onRestrictedDateSelected(date: Date): void {
    this.restrictedSelectedDate = date;
    console.log('Restricted inline calendar date selected:', date);
  }

  onWeekendDisabledSelected(date: Date): void {
    this.weekendDisabledSelected = date;
    console.log('Weekend disabled calendar date selected:', date);
  }

  onPreSelectedDateSelected(date: Date): void {
    this.preSelectedDate = date;
    console.log('Pre-selected calendar date selected:', date);
  }

  onMonthChanged(event: { month: number; year: number }): void {
    console.log('Month changed:', event);
  }

  private generateWeekendDates(): Date[] {
    const weekendDates: Date[] = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Generate weekend dates for current month
    for (let day = 1; day <= 31; day++) {
      const date = new Date(currentYear, currentMonth, day);
      if (date.getMonth() === currentMonth && (date.getDay() === 0 || date.getDay() === 6)) {
        weekendDates.push(new Date(date));
      }
    }

    return weekendDates;
  }
}
