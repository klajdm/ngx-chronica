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

@Component({
  selector: 'app-datetime-picker-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaDateTimePickerComponent, KeyFeaturesComponent],
  templateUrl: './datetime-picker-demo.component.html',
})
export class DateTimePickerDemoComponent {
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
