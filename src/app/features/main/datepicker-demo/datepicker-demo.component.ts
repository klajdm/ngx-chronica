import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChronicaDatepickerComponent } from '../../../../../projects/chronica/src/lib/components/datepicker/datepicker.component';
import {
  ChronicaCalendarConfig,
  DEFAULT_CALENDAR_CONFIG,
} from '../../../../../projects/chronica/src/lib/models/index';
import { ThemeService } from '../../../services/theme.service';
import { KeyFeaturesComponent } from '../../../components/key-features/key-features.component';
import { ConfigOptionsComponent, ConfigOption } from '../../../components/config-options/config-options.component';
import { CodePreviewComponent } from '../../../components/code-preview/code-preview.component';
import { LucideCalendar, LucideCircleCheck, LucideCircleX } from '@lucide/angular';

@Component({
  selector: 'app-datepicker-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaDatepickerComponent, KeyFeaturesComponent, ConfigOptionsComponent, CodePreviewComponent, LucideCalendar, LucideCircleCheck, LucideCircleX],
  templateUrl: './datepicker-demo.component.html',
})
export class DatepickerDemoComponent {
  protected readonly options: ConfigOption[] = [
    { property: 'selectedDate', type: 'Date | null', default: 'null', description: 'Currently selected date' },
    { property: 'hideInput', type: 'boolean', default: 'false', description: 'Hide the default input and use custom trigger' },
    { property: 'placeholder', type: 'string', default: "'Select date'", description: 'Placeholder text for the input' },
    { property: 'config.theme', type: "'light' | 'dark'", default: "'light'", description: 'Light or dark theme' },
    { property: 'config.colorTheme', type: 'string', default: "'blue'", description: 'Color theme: blue, green, purple, red, orange, teal, pink, indigo' },
    { property: 'config.minDate', type: 'Date', default: 'undefined', description: 'Minimum selectable date' },
    { property: 'config.maxDate', type: 'Date', default: 'undefined', description: 'Maximum selectable date' },
    { property: 'config.disabledDates', type: 'Date[]', default: '[]', description: 'Array of disabled dates' },
    { property: 'config.showTodayButton', type: 'boolean', default: 'true', description: 'Show "Today" button in calendar' },
    { property: 'config.firstDayOfWeek', type: 'number', default: '0', description: 'First day of week (0 = Sunday, 1 = Monday)' },
  ];

  protected readonly features: string[] = [
    'Built-in styled input or custom trigger elements',
    'Multiple color themes & dark mode support',
    'Date range restrictions & disabled dates',
    'Popup calendar with month/year navigation',
    'Today button for quick date selection',
    'Angular forms integration (ngModel & Reactive)',
    'Focus states without hover effects',
    'Customizable placeholder text',
    'Configurable first day of week',
  ];

  protected readonly codeSnippets = {
    basic: `<chronica-datepicker
  [selectedDate]="defaultSelectedDate"
  [config]="{
    theme: 'light',
    colorTheme: 'blue'
  }"
  [placeholder]="'Choose a date'"
  (dateSelected)="onDefaultDateSelected($event)">
</chronica-datepicker>`,
    customTrigger: `<chronica-datepicker
  [selectedDate]="customSelectedDate"
  [config]="{
    theme: 'light',
    colorTheme: 'blue'
  }"
  [hideInput]="true"
  (dateSelected)="onCustomDateSelected($event)">
  <div class="custom-trigger">
    <svg>...</svg>
    {{ customSelectedDate ?
        (customSelectedDate | date: 'mediumDate') :
        'Select appointment date' }}
  </div>
</chronica-datepicker>`,
    restrictions: `// Date range restriction
restrictedConfig = {
  theme: 'light',
  colorTheme: 'blue',
  minDate: new Date(2024, 0, 1),
  maxDate: new Date(2024, 11, 31)
};

// Disabled specific dates
disabledDatesConfig = {
  theme: 'light',
  colorTheme: 'blue',
  disabledDates: [
    new Date(2024, 11, 25), // Christmas
    new Date(2024, 0, 1),   // New Year
    new Date(2024, 6, 4)    // July 4th
  ]
};`,
    formIntegration: `<chronica-datepicker
  [(ngModel)]="formSelectedDate"
  [config]="{
    theme: 'light',
    colorTheme: 'blue'
  }"
  name="appointmentDate"
  required>
</chronica-datepicker>`,
    darkTheme: `<chronica-datepicker
  [selectedDate]="darkThemeDate"
  [config]="{
    theme: 'dark',
    colorTheme: 'blue'
  }">
</chronica-datepicker>`,
    popupPosition: `<!-- Always open below the input -->
<chronica-datepicker
  [(ngModel)]="date"
  [popupPosition]="'bottom'">
</chronica-datepicker>

<!-- Always open above the input -->
<chronica-datepicker
  [(ngModel)]="date"
  [popupPosition]="'top'">
</chronica-datepicker>

<!-- Auto-detect (default) -->
<chronica-datepicker
  [(ngModel)]="date"
  [popupPosition]="'auto'">
</chronica-datepicker>`,
  } as const;

  private readonly _themeService = inject(ThemeService);

  // Default input datepicker
  defaultSelectedDate: Date | null = null;
  defaultConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Custom trigger datepicker
  customSelectedDate: Date | null = null;
  customConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Date range restricted datepicker
  restrictedSelectedDate: Date | null = null;
  restrictedConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      minDate: new Date(2024, 0, 1), // January 1, 2024
      maxDate: new Date(2024, 11, 31), // December 31, 2024
    })
  );

  // Form integration datepicker
  formSelectedDate: Date | null = new Date();
  formConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Disabled dates datepicker
  disabledDatesSelected: Date | null = null;
  disabledDatesConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      disabledDates: [
        new Date(2024, 11, 25), // Christmas
        new Date(2024, 0, 1), // New Year
        new Date(2024, 6, 4), // July 4th
      ],
    })
  );

  // Dark theme datepicker
  darkThemeDate: Date | null = null;
  darkThemeConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'dark',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Popup position datepicker
  popupPositionDate: Date | null = null;
  popupTopConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  onPopupPositionDateSelected(date: Date): void {
    this.popupPositionDate = date;
  }

  onDefaultDateSelected(date: Date): void {
    this.defaultSelectedDate = date;
  }

  onCustomDateSelected(date: Date): void {
    this.customSelectedDate = date;
  }

  onRestrictedDateSelected(date: Date): void {
    this.restrictedSelectedDate = date;
  }

  onFormDateSelected(date: Date): void {
    this.formSelectedDate = date;
  }

  onDisabledDatesSelected(date: Date): void {
    this.disabledDatesSelected = date;
  }

  onDarkThemeDateSelected(date: Date): void {
    this.darkThemeDate = date;
  }
}
