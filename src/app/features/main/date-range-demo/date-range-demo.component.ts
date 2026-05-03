import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChronicaDateRangeComponent } from '../../../../../projects/chronica/src/lib/components/date-range/date-range.component';
import {
  ChronicaCalendarConfig,
  ChronicaDateRange,
  DEFAULT_CALENDAR_CONFIG,
} from '../../../../../projects/chronica/src/lib/models/index';
import { ThemeService } from '../../../services/theme.service';
import { KeyFeaturesComponent } from '../../../components/key-features/key-features.component';
import {
  ConfigOptionsComponent,
  ConfigOption,
} from '../../../components/config-options/config-options.component';
import { CodePreviewComponent } from '../../../components/code-preview/code-preview.component';

@Component({
  selector: 'app-date-range-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChronicaDateRangeComponent,
    KeyFeaturesComponent,
    ConfigOptionsComponent,
    CodePreviewComponent,
  ],
  templateUrl: './date-range-demo.component.html',
})
export class DateRangeDemoComponent {
  protected readonly options: ConfigOption[] = [
    {
      property: 'theme',
      type: "'light' | 'dark'",
      default: "'light'",
      description: 'Visual theme mode',
    },
    {
      property: 'colorTheme',
      type: 'string',
      default: "'blue'",
      description: 'Color theme: blue, purple, green, red, orange, teal, pink, indigo',
    },
    { property: 'minDate', type: 'Date', default: 'null', description: 'Minimum selectable date' },
    { property: 'maxDate', type: 'Date', default: 'null', description: 'Maximum selectable date' },
    {
      property: 'disabledDates',
      type: 'Date[]',
      default: '[]',
      description: 'Array of disabled dates',
    },
    {
      property: 'showPresets',
      type: 'boolean',
      default: 'false',
      description: 'Show quick select presets',
    },
    {
      property: 'presets',
      type: 'PresetRange[]',
      default: '[]',
      description: 'Custom preset ranges',
    },
    {
      property: 'showTime',
      type: 'boolean',
      default: 'false',
      description: 'Include time selection',
    },
    {
      property: 'format',
      type: 'string',
      default: "'MM/dd/yyyy'",
      description: 'Date display format',
    },
    {
      property: 'closeOnSelect',
      type: 'boolean',
      default: 'true',
      description: 'Close popup after range selection',
    },
  ];

  protected readonly features: string[] = [
    'Date range selection with visual feedback',
    'Quick select presets for common ranges',
    'Hover preview for range selection',
    'Min/max date restrictions',
    'Business day filtering (exclude weekends)',
    'Angular forms integration (ngModel & Reactive)',
    'Multiple color themes & dark mode support',
    'Range highlighting with start/end markers',
    'Customizable date format & localization',
  ];

  protected readonly codeSnippets = {
    basic: `<chronica-date-range
  [(ngModel)]="basicSelectedRange"
  [config]="{
    theme: 'light',
    colorTheme: 'blue'
  }"
  placeholder="Select date range"
  (dateRangeChange)="onBasicRangeChanged($event)">
</chronica-date-range>`,
    restrictions: `<chronica-date-range
  [(ngModel)]="restrictedSelectedRange"
  [config]="{
    theme: 'light',
    colorTheme: 'blue'
  }"
  [minDate]="new Date(2024, 0, 1)"
  [maxDate]="new Date(2024, 11, 31)">
</chronica-date-range>`,
    formIntegration: `<chronica-date-range
  name="projectDuration"
  [(ngModel)]="formSelectedRange"
  [config]="{
    theme: 'light',
    colorTheme: 'blue'
  }"
  required>
</chronica-date-range>`,
    businessDays: `<chronica-date-range
  [(ngModel)]="businessDaysRange"
  [config]="{
    theme: 'light',
    colorTheme: 'blue',
    disabledDates: this.generateWeekendDates()
  }">
</chronica-date-range>`,
    quickPresets: `<!-- Quick select buttons (This Week / Today / This Month)
     are built into the component - no extra config needed -->
<chronica-date-range
  [(ngModel)]="presetRange"
  [config]="{
    theme: 'light',
    colorTheme: 'blue'
  }"
  placeholder="Select or use presets"
  (dateRangeChange)="onPresetRangeChanged($event)">
</chronica-date-range>`,
    darkTheme: `<chronica-date-range
  [(ngModel)]="darkThemeRange"
  [config]="{
    theme: 'dark',
    colorTheme: 'blue'
  }">
</chronica-date-range>`,
  } as const;

  private readonly _themeService = inject(ThemeService);

  // Basic date range
  basicSelectedRange: ChronicaDateRange = { startDate: null, endDate: null };
  basicConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Date range restricted
  restrictedSelectedRange: ChronicaDateRange = { startDate: null, endDate: null };
  restrictedConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );
  restrictedMinDate = new Date(2024, 0, 1); // January 1, 2024
  restrictedMaxDate = new Date(2024, 11, 31); // December 31, 2024

  // Form integration date range
  formSelectedRange: ChronicaDateRange = {
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  };
  formConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Business days only (no weekends)
  businessDaysRange: ChronicaDateRange = { startDate: null, endDate: null };
  businessDaysConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      disabledDates: this.generateWeekendDates(),
    })
  );

  // Quick select presets
  presetRange: ChronicaDateRange = { startDate: null, endDate: null };
  presetConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Dark theme date range
  darkThemeRange: ChronicaDateRange = { startDate: null, endDate: null };
  darkThemeConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'dark',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  onBasicRangeChanged(range: ChronicaDateRange): void {
    this.basicSelectedRange = range;
  }

  onRestrictedRangeChanged(range: ChronicaDateRange): void {
    this.restrictedSelectedRange = range;
  }

  onFormRangeChanged(range: ChronicaDateRange): void {
    this.formSelectedRange = range;
  }

  onBusinessDaysRangeChanged(range: ChronicaDateRange): void {
    this.businessDaysRange = range;
  }

  onPresetRangeChanged(range: ChronicaDateRange): void {
    this.presetRange = range;
  }

  onDarkThemeRangeChanged(range: ChronicaDateRange): void {
    this.darkThemeRange = range;
  }

  getDaysDifference(range: ChronicaDateRange): number {
    if (!range.startDate || !range.endDate) {
      return 0;
    }
    const timeDiff = range.endDate.getTime() - range.startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  }

  getBusinessDaysCount(range: ChronicaDateRange): number {
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

  getPresetName(range: ChronicaDateRange): string {
    if (!range.startDate || !range.endDate) {
      return 'Custom selection';
    }

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

  private getLastNDays(days: number): ChronicaDateRange {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);
    return { startDate, endDate };
  }

  private getCurrentMonth(): ChronicaDateRange {
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
