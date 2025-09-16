import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChronicaDateRangeComponent, DateRange } from '../../../../../projects/chronica/src/lib/components/date-range/date-range.component';
import {
  CalendarConfig,
  DEFAULT_CALENDAR_CONFIG,
} from '../../../../../projects/chronica/src/lib/models/chronica.models';

@Component({
  selector: 'app-date-range-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaDateRangeComponent],
  templateUrl: './date-range-demo.component.html',
})
export class DateRangeDemoComponent {
  // Basic date range
  basicSelectedRange: DateRange = { startDate: null, endDate: null };
  basicConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'blue',
  };

  // Themed date range
  themedSelectedRange: DateRange = { startDate: null, endDate: null };
  themedConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'purple',
  };

  // Date range restricted
  restrictedSelectedRange: DateRange = { startDate: null, endDate: null };
  restrictedConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'green',
    minDate: new Date(2024, 0, 1), // January 1, 2024
    maxDate: new Date(2024, 11, 31), // December 31, 2024
  };

  // Form integration date range
  formSelectedRange: DateRange = { 
    startDate: new Date(), 
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  };
  formConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'indigo',
  };

  // Business days only (no weekends)
  businessDaysRange: DateRange = { startDate: null, endDate: null };
  businessDaysConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'red',
    disabledDates: this.generateWeekendDates(),
  };

  // Dark theme date range
  darkThemeRange: DateRange = { startDate: null, endDate: null };
  darkThemeConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'dark',
    colorTheme: 'teal',
  };

  onBasicRangeChanged(range: DateRange): void {
    this.basicSelectedRange = range;
    console.log('Basic range selected:', range);
  }

  onThemedRangeChanged(range: DateRange): void {
    this.themedSelectedRange = range;
    console.log('Themed range selected:', range);
  }

  onRestrictedRangeChanged(range: DateRange): void {
    this.restrictedSelectedRange = range;
    console.log('Restricted range selected:', range);
  }

  onFormRangeChanged(range: DateRange): void {
    this.formSelectedRange = range;
    console.log('Form range selected:', range);
  }

  onBusinessDaysRangeChanged(range: DateRange): void {
    this.businessDaysRange = range;
    console.log('Business days range selected:', range);
  }

  onDarkThemeRangeChanged(range: DateRange): void {
    this.darkThemeRange = range;
    console.log('Dark theme range selected:', range);
  }

  getDaysDifference(range: DateRange): number {
    if (!range.startDate || !range.endDate) {
      return 0;
    }
    const timeDiff = range.endDate.getTime() - range.startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  }

  private generateWeekendDates(): Date[] {
    const weekends: Date[] = [];
    const currentYear = new Date().getFullYear();
    
    // Generate weekend dates for current year
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, month, day);
        if (date.getDay() === 0 || date.getDay() === 6) { // Sunday or Saturday
          weekends.push(date);
        }
      }
    }
    
    return weekends;
  }
}