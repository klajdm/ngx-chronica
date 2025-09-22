import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChronicaDateRangeComponent,
  DateRange,
} from '../../../../../projects/chronica/src/lib/components/date-range/date-range.component';
import {
  CalendarConfig,
  DEFAULT_CALENDAR_CONFIG,
} from '../../../../../projects/chronica/src/lib/models/chronica.models';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-date-range-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaDateRangeComponent],
  templateUrl: './date-range-demo.component.html',
})
export class DateRangeDemoComponent {
  private readonly themeService = inject(ThemeService);

  // Basic date range
  basicSelectedRange: DateRange = { startDate: null, endDate: null };
  basicConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
    })
  );

  // Date range restricted
  restrictedSelectedRange: DateRange = { startDate: null, endDate: null };
  restrictedConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
    })
  );
  restrictedMinDate = new Date(2024, 0, 1); // January 1, 2024
  restrictedMaxDate = new Date(2024, 11, 31); // December 31, 2024

  // Form integration date range
  formSelectedRange: DateRange = {
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  };
  formConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
    })
  );

  // Business days only (no weekends)
  businessDaysRange: DateRange = { startDate: null, endDate: null };
  businessDaysConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
      disabledDates: this.generateWeekendDates(),
    })
  );

  // Quick select presets
  presetRange: DateRange = { startDate: null, endDate: null };
  presetConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
    })
  );

  // Dark theme date range
  darkThemeRange: DateRange = { startDate: null, endDate: null };
  darkThemeConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'dark',
      colorTheme: this.themeService.currentTheme(),
    })
  );

  onBasicRangeChanged(range: DateRange): void {
    this.basicSelectedRange = range;
    console.log('Basic range selected:', range);
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

  onPresetRangeChanged(range: DateRange): void {
    this.presetRange = range;
    console.log('Preset range selected:', range);
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

  getBusinessDaysCount(range: DateRange): number {
    if (!range.startDate || !range.endDate) {
      return 0;
    }

    let count = 0;
    const current = new Date(range.startDate);
    const end = new Date(range.endDate);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Not Sunday (0) or Saturday (6)
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  getPresetName(range: DateRange): string {
    if (!range.startDate || !range.endDate) {
      return 'Custom selection';
    }

    const today = new Date();
    const startDate = new Date(range.startDate);
    const endDate = new Date(range.endDate);

    // Check if it matches common presets
    const last7Days = this.getLastNDays(7);
    if (
      this.datesEqual(startDate, last7Days.startDate!) &&
      this.datesEqual(endDate, last7Days.endDate!)
    ) {
      return 'Last 7 days';
    }

    const last30Days = this.getLastNDays(30);
    if (
      this.datesEqual(startDate, last30Days.startDate!) &&
      this.datesEqual(endDate, last30Days.endDate!)
    ) {
      return 'Last 30 days';
    }

    const currentMonth = this.getCurrentMonth();
    if (
      this.datesEqual(startDate, currentMonth.startDate!) &&
      this.datesEqual(endDate, currentMonth.endDate!)
    ) {
      return 'This month';
    }

    return 'Custom selection';
  }

  private getLastNDays(days: number): DateRange {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);
    return { startDate, endDate };
  }

  private getCurrentMonth(): DateRange {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate, endDate };
  }

  private datesEqual(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private generateWeekendDates(): Date[] {
    const weekends: Date[] = [];
    const currentYear = new Date().getFullYear();

    // Generate weekend dates for current year
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, month, day);
        if (date.getDay() === 0 || date.getDay() === 6) {
          // Sunday or Saturday
          weekends.push(date);
        }
      }
    }

    return weekends;
  }
}
