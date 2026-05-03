import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChronicaDateTimePickerComponent } from '../../../../../projects/chronica/src/lib/components/datetime-picker/datetime-picker.component';
import {
  ChronicaDateTimeValue as DateTimeValue,
  ChronicaDateTimeConfig as DateTimePickerConfig,
  DEFAULT_DATETIME_CONFIG,
} from '../../../../../projects/chronica/src/lib/models/index';
import { ThemeService } from '../../../services/theme.service';
import { KeyFeaturesComponent } from '../../../components/key-features/key-features.component';
import { ConfigOptionsComponent, ConfigOption } from '../../../components/config-options/config-options.component';
import { CodePreviewComponent } from '../../../components/code-preview/code-preview.component';

@Component({
  selector: 'app-datetime-picker-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaDateTimePickerComponent, KeyFeaturesComponent, ConfigOptionsComponent, CodePreviewComponent],
  templateUrl: './datetime-picker-demo.component.html',
})
export class DateTimePickerDemoComponent {
  protected readonly options: ConfigOption[] = [
    { property: 'dateTimeValue', type: 'DateTimeValue | null', default: 'null', description: 'Currently selected date and time' },
    { property: 'enableTimePicker', type: 'boolean', default: 'true', description: 'Enable/disable time selection (date-only mode)' },
    { property: 'format24Hour', type: 'boolean', default: 'true', description: 'Use 24-hour format or 12-hour with AM/PM' },
    { property: 'showSeconds', type: 'boolean', default: 'false', description: 'Show seconds in time selection' },
    { property: 'hideInput', type: 'boolean', default: 'false', description: 'Hide the default input and use custom trigger' },
    { property: 'placeholder', type: 'string', default: "'Select date and time'", description: 'Placeholder text for the input' },
    { property: 'config.theme', type: "'light' | 'dark'", default: "'light'", description: 'Light or dark theme' },
    { property: 'config.colorTheme', type: 'string', default: "'blue'", description: 'Color theme: blue, green, purple, red, orange, teal, pink, indigo' },
    { property: 'config.minDate', type: 'Date', default: 'undefined', description: 'Minimum selectable date' },
    { property: 'config.maxDate', type: 'Date', default: 'undefined', description: 'Maximum selectable date' },
    { property: 'minuteStep', type: 'number', default: '1', description: 'Minute selection step interval' },
    { property: 'secondStep', type: 'number', default: '1', description: 'Second selection step interval' },
    { property: 'config.layout', type: "'inline' | 'tabs'", default: "'inline'", description: 'Display calendar and time picker side-by-side or in separate tabs' },
    { property: 'config.showSeparateInputs', type: 'boolean', default: 'false', description: 'Render separate date and time trigger buttons side by side' },
    { property: 'config.requireBoth', type: 'boolean', default: 'true', description: 'When false, emit form value even when only date or time is selected' },
  ];

  protected readonly features: string[] = [
    'Combined date and time selection in one interface',
    '24-hour and 12-hour time format support',
    'Optional seconds precision for exact timing',
    'Date-only mode with time picker disabled',
    'Built-in input or custom trigger elements',
    'Date range restrictions and validation',
    'Multiple color themes & dark mode',
    'Angular forms integration (ngModel & Reactive)',
    'Responsive design for mobile and desktop',
    'Keyboard navigation and accessibility',
    'Tabs layout with ARIA tablist/tabpanel',
    'Separate inputs and partial-value (requireBoth) modes',
  ];

  protected readonly codeSnippets = {
    basic: `<chronica-datetime-picker
  [dateTimeValue]="basicSelectedDateTime"
  [config]="{
    theme: 'light',
    colorTheme: 'blue',
    format24Hour: true,
    showSeconds: false
  }"
  [placeholder]="'Select date and time'"
  (dateTimeChange)="onBasicDateTimeChanged($event)">
</chronica-datetime-picker>`,
    twelveHour: `<chronica-datetime-picker
  [dateTimeValue]="twelveHourDateTime"
  [config]="{
    theme: 'light',
    colorTheme: 'blue',
    format24Hour: false,
    showSeconds: false
  }"
  (dateTimeChange)="onTwelveHourDateTimeChanged($event)">
</chronica-datetime-picker>`,
    withSeconds: `<chronica-datetime-picker
  [dateTimeValue]="dateTimeWithSeconds"
  [config]="{
    theme: 'light',
    colorTheme: 'blue',
    format24Hour: true,
    showSeconds: true
  }"
  (dateTimeChange)="onDateTimeWithSecondsChanged($event)">
</chronica-datetime-picker>`,
    customTrigger: `<chronica-datetime-picker
  [dateTimeValue]="customTriggerDateTime"
  [config]="config"
  [hideInput]="true"
  (dateTimeChange)="onCustomTriggerDateTimeChanged($event)">
  <div class="custom-trigger">
    <svg>...</svg>
    {{ customTriggerDateTime ?
        formatDateTimeDisplay(customTriggerDateTime) :
        'Schedule Meeting' }}
  </div>
</chronica-datetime-picker>`,
    restrictions: `restrictedConfig = {
  theme: 'light',
  colorTheme: 'blue',
  format24Hour: true,
  showSeconds: false,
  minDate: new Date(2024, 0, 1),   // January 1, 2024
  maxDate: new Date(2024, 11, 31)  // December 31, 2024
};`,
    formIntegration: `<chronica-datetime-picker
  [(ngModel)]="formSelectedDateTime"
  [config]="{
    theme: 'light',
    colorTheme: 'blue',
    format24Hour: false
  }"
  name="appointmentDateTime"
  required>
</chronica-datetime-picker>`,
    tabsLayout: `<chronica-datetime-picker
  [(ngModel)]="tabsDateTime"
  [config]="{
    layout: 'tabs',
    theme: 'light',
    colorTheme: 'blue'
  }"
  (dateTimeChange)="onTabsDateTimeChanged($event)">
</chronica-datetime-picker>`,
    separateInputs: `<chronica-datetime-picker
  [(ngModel)]="separateInputsDateTime"
  [config]="{
    showSeparateInputs: true,
    theme: 'light',
    colorTheme: 'blue'
  }"
  (dateTimeChange)="onSeparateInputsDateTimeChanged($event)">
</chronica-datetime-picker>`,
    partialSelection: `<chronica-datetime-picker
  [(ngModel)]="partialDateTime"
  [config]="{
    requireBoth: false,
    theme: 'light',
    colorTheme: 'blue'
  }"
  (dateTimeChange)="onPartialDateTimeChanged($event)">
</chronica-datetime-picker>`,
    darkTheme: `<chronica-datetime-picker
  [dateTimeValue]="darkThemeDateTime"
  [config]="{
    theme: 'dark',
    colorTheme: 'blue'
  }">
</chronica-datetime-picker>`,
  } as const;

  private readonly _themeService = inject(ThemeService);

  // Basic datetime picker (24-hour format)
  basicSelectedDateTime: DateTimeValue | null = null;
  basicConfig = computed(
    (): DateTimePickerConfig => ({
      ...DEFAULT_DATETIME_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // 12-hour format datetime picker
  twelveHourDateTime: DateTimeValue | null = null;
  twelveHourConfig = computed(
    (): DateTimePickerConfig => ({
      ...DEFAULT_DATETIME_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      timeConfig: { timeFormat: '12h', showSeconds: false },
    })
  );

  // DateTime picker with seconds
  dateTimeWithSeconds: DateTimeValue | null = null;
  secondsConfig = computed(
    (): DateTimePickerConfig => ({
      ...DEFAULT_DATETIME_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      timeConfig: { timeFormat: '24h', showSeconds: true },
    })
  );

  // Custom trigger element
  customTriggerDateTime: DateTimeValue | null = null;
  customTriggerConfig = computed(
    (): DateTimePickerConfig => ({
      ...DEFAULT_DATETIME_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // DateTime picker with restrictions
  restrictedDateTime: DateTimeValue | null = null;
  restrictedConfig = computed(
    (): DateTimePickerConfig => ({
      ...DEFAULT_DATETIME_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      calendarConfig: { minDate: new Date(2024, 0, 1), maxDate: new Date(2024, 11, 31) },
    })
  );

  // Form integration
  formSelectedDateTime: DateTimeValue | null = {
    date: new Date(),
    time: { hours: 14, minutes: 30 },
  };
  formConfig = computed(
    (): DateTimePickerConfig => ({
      ...DEFAULT_DATETIME_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      timeConfig: { timeFormat: '12h', showSeconds: false },
    })
  );

  // Dark theme
  darkThemeDateTime: DateTimeValue | null = null;
  darkThemeConfig = computed(
    (): DateTimePickerConfig => ({
      ...DEFAULT_DATETIME_CONFIG,
      theme: 'dark',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Tabs layout
  tabsDateTime: DateTimeValue | null = null;
  tabsConfig = computed(
    (): DateTimePickerConfig => ({
      ...DEFAULT_DATETIME_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      layout: 'tabs',
    })
  );

  // Separate inputs
  separateInputsDateTime: DateTimeValue | null = null;
  separateInputsConfig = computed(
    (): DateTimePickerConfig => ({
      ...DEFAULT_DATETIME_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      showSeparateInputs: true,
    })
  );

  // requireBoth: false (allow partial value)
  partialDateTime: DateTimeValue | null = null;
  partialConfig = computed(
    (): DateTimePickerConfig => ({
      ...DEFAULT_DATETIME_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      requireBoth: false,
    })
  );

  onTabsDateTimeChanged(dateTime: DateTimeValue): void {
    this.tabsDateTime = dateTime;
  }

  onSeparateInputsDateTimeChanged(dateTime: DateTimeValue): void {
    this.separateInputsDateTime = dateTime;
  }

  onPartialDateTimeChanged(dateTime: DateTimeValue): void {
    this.partialDateTime = dateTime;
  }

  onBasicDateTimeChanged(dateTime: DateTimeValue): void {
    this.basicSelectedDateTime = dateTime;
  }

  onTwelveHourDateTimeChanged(dateTime: DateTimeValue): void {
    this.twelveHourDateTime = dateTime;
  }

  onDateTimeWithSecondsChanged(dateTime: DateTimeValue): void {
    this.dateTimeWithSeconds = dateTime;
  }

  onCustomTriggerDateTimeChanged(dateTime: DateTimeValue): void {
    this.customTriggerDateTime = dateTime;
  }

  onRestrictedDateTimeChanged(dateTime: DateTimeValue): void {
    this.restrictedDateTime = dateTime;
  }

  onFormDateTimeChanged(dateTime: DateTimeValue): void {
    this.formSelectedDateTime = dateTime;
  }

  onDarkThemeDateTimeChanged(dateTime: DateTimeValue): void {
    this.darkThemeDateTime = dateTime;
  }

  formatDateTimeDisplay(dateTime: DateTimeValue | null): string {
    if (!dateTime) return 'No date & time selected';

    const datePart = dateTime.date
      ? new Intl.DateTimeFormat('en-US').format(dateTime.date)
      : 'No date';

    const timePart = dateTime.time ? this.formatTimeDisplay(dateTime.time, true) : 'No time';

    return `${datePart} ${timePart}`;
  }

  formatTimeDisplay(
    time: { hours: number; minutes: number; seconds?: number } | null,
    format24Hour: boolean = true,
    showSeconds: boolean = false
  ): string {
    if (!time) return 'No time selected';

    const { hours, minutes, seconds } = time;

    if (format24Hour) {
      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return showSeconds ? `${timeStr}:${(seconds || 0).toString().padStart(2, '0')}` : timeStr;
    } else {
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const period = hours < 12 ? 'AM' : 'PM';
      const timeStr = `${displayHour}:${minutes.toString().padStart(2, '0')}`;
      const fullTimeStr = showSeconds
        ? `${timeStr}:${(seconds || 0).toString().padStart(2, '0')}`
        : timeStr;
      return `${fullTimeStr} ${period}`;
    }
  }

  getDateTimeInMinutes(dateTime: DateTimeValue | null): number {
    if (!dateTime?.time) return 0;
    return dateTime.time.hours * 60 + dateTime.time.minutes;
  }

  isValidAppointmentTime(dateTime: DateTimeValue | null): boolean {
    if (!dateTime?.date || !dateTime?.time) return false;

    const appointmentDate = dateTime.date;
    const now = new Date();

    // Check if appointment is in the past
    if (appointmentDate < now) return false;

    // Check if it's during business hours (9 AM - 5 PM)
    const hours = dateTime.time.hours;
    return hours >= 9 && hours < 17;
  }
}
