import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChronicaInlineCalendarComponent } from '../../../../../projects/chronica/src/lib/components/inline-calendar/inline-calendar.component';
import {
  ChronicaCalendarConfig,
  DEFAULT_CALENDAR_CONFIG,
} from '../../../../../projects/chronica/src/lib/models/index';
import { ThemeService } from '../../../services/theme.service';
import { KeyFeaturesComponent } from '../../../components/key-features/key-features.component';
import { ConfigOptionsComponent, ConfigOption } from '../../../components/config-options/config-options.component';
import { CodePreviewComponent } from '../../../components/code-preview/code-preview.component';

@Component({
  selector: 'app-inline-calendar-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaInlineCalendarComponent, KeyFeaturesComponent, ConfigOptionsComponent, CodePreviewComponent],
  templateUrl: './inline-calendar-demo.component.html',
})
export class InlineCalendarDemoComponent {
  protected readonly options: ConfigOption[] = [
    { property: 'selectedDate', type: 'Date | null', default: 'null', description: 'Currently selected date' },
    { property: 'theme', type: "'light' | 'dark'", default: "'light'", description: 'Visual theme mode' },
    { property: 'colorTheme', type: 'string', default: "'blue'", description: 'Color theme: blue, purple, green, red, orange, teal, pink, indigo' },
    { property: 'minDate', type: 'Date', default: 'null', description: 'Minimum selectable date' },
    { property: 'maxDate', type: 'Date', default: 'null', description: 'Maximum selectable date' },
    { property: 'disabledDates', type: 'Date[]', default: '[]', description: 'Array of disabled dates' },
    { property: 'showTodayButton', type: 'boolean', default: 'true', description: 'Show "Today" button for quick selection' },
    { property: 'showWeekNumbers', type: 'boolean', default: 'false', description: 'Display week numbers in calendar' },
    { property: 'firstDayOfWeek', type: 'number', default: '0', description: 'First day of week (0=Sunday, 1=Monday)' },
  ];

  protected readonly features: string[] = [
    'Always visible calendar',
    'No popup required',
    'Compact design',
    'Easy integration',
  ];

  protected readonly codeSnippets = {
    basic: `<chronica-inline-calendar
  [selectedDate]="basicSelectedDate"
  [config]="{
    theme: 'light',
    colorTheme: 'blue'
  }"
  (dateSelected)="onBasicDateSelected($event)"
  (monthChanged)="onMonthChanged($event)">
</chronica-inline-calendar>`,
    compact: `<chronica-inline-calendar
  [selectedDate]="compactSelectedDate"
  [config]="{
    theme: 'light',
    colorTheme: 'blue',
    showTodayButton: false
  }"
  (dateSelected)="onCompactDateSelected($event)">
</chronica-inline-calendar>`,
    dateRestrictions: `<chronica-inline-calendar
  [selectedDate]="restrictedSelectedDate"
  [config]="{
    theme: 'light',
    colorTheme: 'blue',
    minDate: new Date(2024, 0, 1),
    maxDate: new Date(2024, 11, 31)
  }"
  (dateSelected)="onRestrictedDateSelected($event)">
</chronica-inline-calendar>`,
    weekendDisabled: `<chronica-inline-calendar
  [selectedDate]="weekendDisabledSelected"
  [config]="{
    theme: 'light',
    colorTheme: 'blue',
    disabledDates: this.generateWeekendDates()
  }"
  (dateSelected)="onWeekendDisabledSelected($event)">
</chronica-inline-calendar>`,
    preSelected: `<chronica-inline-calendar
  [selectedDate]="preSelectedDate"
  [config]="{
    theme: 'light',
    colorTheme: 'blue'
  }"
  (dateSelected)="onPreSelectedDateSelected($event)">
</chronica-inline-calendar>

// Component initialization
preSelectedDate: Date | null = new Date();`,
    darkMode: `<chronica-inline-calendar
  [selectedDate]="darkModeSelectedDate"
  [config]="{
    theme: 'dark',
    colorTheme: 'blue'
  }"
  (dateSelected)="onDarkModeSelected($event)">
</chronica-inline-calendar>`,
    multiView: `<chronica-inline-calendar
  [selectedDate]="decadeViewSelectedDate"
  [config]="{
    theme: 'light',
    colorTheme: 'blue',
    minDate: new Date(2020, 0, 1),
    maxDate: new Date(2029, 11, 31)
  }"
  (dateSelected)="onDecadeViewDateSelected($event)">
</chronica-inline-calendar>

<!-- Click the month/year header to cycle:
     Month view → Months grid → Year grid -->`,
  } as const;

  private readonly _themeService = inject(ThemeService);

  // Basic inline calendar
  basicSelectedDate: Date | null = null;
  basicConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Compact inline calendar
  compactSelectedDate: Date | null = null;
  compactConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      showTodayButton: false,
    })
  );

  // Date range restricted inline calendar
  restrictedSelectedDate: Date | null = null;
  restrictedConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      minDate: new Date(2024, 0, 1),
      maxDate: new Date(2024, 11, 31),
    })
  );

  // Weekend disabled calendar
  weekendDisabledSelected: Date | null = null;
  weekendDisabledConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      disabledDates: this.generateWeekendDates(),
    })
  );

  // Pre-selected date calendar
  preSelectedDate: Date | null = new Date();
  preSelectedConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Dark mode calendar
  darkModeSelectedDate: Date | null = null;
  darkModeConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'dark',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Decade view calendar (min/max spanning multiple years to showcase nav guards + decade view)
  decadeViewSelectedDate: Date | null = null;
  decadeViewConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2029, 11, 31),
    })
  );

  onDecadeViewDateSelected(date: Date): void {
    this.decadeViewSelectedDate = date;
  }

  onBasicDateSelected(date: Date): void {
    this.basicSelectedDate = date;
  }

  onCompactDateSelected(date: Date): void {
    this.compactSelectedDate = date;
  }

  onRestrictedDateSelected(date: Date): void {
    this.restrictedSelectedDate = date;
  }

  onWeekendDisabledSelected(date: Date): void {
    this.weekendDisabledSelected = date;
  }

  onPreSelectedDateSelected(date: Date): void {
    this.preSelectedDate = date;
  }

  onDarkModeSelected(date: Date): void {
    this.darkModeSelectedDate = date;
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
