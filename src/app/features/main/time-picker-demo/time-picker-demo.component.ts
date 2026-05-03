import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChronicaTimePickerComponent,
  TimePickerConfig,
} from '../../../../../projects/chronica/src/lib/components/time-picker/time-picker.component';
import {
  ChronicaTimeValue,
  DEFAULT_CALENDAR_CONFIG,
} from '../../../../../projects/chronica/src/lib/models/index';
import { ThemeService } from '../../../services/theme.service';
import { KeyFeaturesComponent } from '../../../components/key-features/key-features.component';
import { ConfigOptionsComponent, ConfigOption } from '../../../components/config-options/config-options.component';
import { CodePreviewComponent } from '../../../components/code-preview/code-preview.component';

@Component({
  selector: 'app-time-picker-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaTimePickerComponent, KeyFeaturesComponent, ConfigOptionsComponent, CodePreviewComponent],
  templateUrl: './time-picker-demo.component.html',
})
export class TimePickerDemoComponent {
  protected readonly options: ConfigOption[] = [
    { property: 'format24Hour', type: 'boolean', default: 'true', description: 'Use 24-hour format (true) or 12-hour with AM/PM (false)' },
    { property: 'showSeconds', type: 'boolean', default: 'false', description: 'Include seconds selection in the time picker' },
    { property: 'minuteStep', type: 'number', default: '1', description: 'Step interval for minutes (e.g., 15 for 15-min blocks)' },
    { property: 'secondStep', type: 'number', default: '1', description: 'Step interval for seconds' },
    { property: 'minTime', type: 'TimeValue', default: 'null', description: 'Minimum selectable time' },
    { property: 'maxTime', type: 'TimeValue', default: 'null', description: 'Maximum selectable time' },
    { property: 'colorTheme', type: 'string', default: "'blue'", description: 'Color theme: blue, purple, green, red, orange, teal, pink, indigo' },
    { property: 'theme', type: 'string', default: "'light'", description: 'UI theme: light or dark' },
    { property: 'placeholder', type: 'string', default: "'Select time'", description: 'Placeholder text for the time input field' },
  ];

  protected readonly features: string[] = [
    '12-hour and 24-hour format support',
    'Optional seconds selection for precision timing',
    'Customizable minute/second step intervals',
    'Min/max time restrictions for business hours',
    'Popup-based time selection interface',
    'Angular forms integration (ngModel & Reactive)',
    'Multiple color themes & dark mode support',
    'Quick actions (Now, Clear) for convenience',
    'Responsive design for mobile and desktop',
  ];

  protected readonly codeSnippets = {
    basic: `<chronica-time-picker
  [(ngModel)]="basicSelectedTime"
  [config]="{
    format24Hour: true,
    showSeconds: false,
    colorTheme: 'blue'
  }"
  placeholder="Select time"
  (timeChange)="onBasicTimeChanged($event)">
</chronica-time-picker>`,
    twelveHour: `<chronica-time-picker
  [(ngModel)]="twelveHourTime"
  [config]="{
    format24Hour: false,
    colorTheme: 'blue'
  }"
  placeholder="Select time (12-hour format)">
</chronica-time-picker>`,
    withSeconds: `<chronica-time-picker
  [(ngModel)]="timeWithSeconds"
  [config]="{
    format24Hour: true,
    showSeconds: true,
    colorTheme: 'blue'
  }"
  placeholder="Select time with seconds">
</chronica-time-picker>`,
    businessHours: `<chronica-time-picker
  [(ngModel)]="restrictedTime"
  [config]="{
    format24Hour: true,
    colorTheme: 'blue'
  }"
  [minTime]="{ hours: 9, minutes: 0 }"
  [maxTime]="{ hours: 17, minutes: 30 }">
</chronica-time-picker>`,
    formIntegration: `<chronica-time-picker
  name="meetingTime"
  [(ngModel)]="formSelectedTime"
  [config]="{
    format24Hour: false,
    colorTheme: 'blue'
  }"
  required>
</chronica-time-picker>`,
    customStep: `<chronica-time-picker
  [(ngModel)]="customStepTime"
  [config]="{
    format24Hour: true,
    showSeconds: true,
    minuteStep: 15,
    secondStep: 30,
    colorTheme: 'blue'
  }">
</chronica-time-picker>`,
    darkTheme: `<chronica-time-picker
  [(ngModel)]="darkThemeTime"
  [config]="{
    theme: 'dark',
    colorTheme: 'blue',
    format24Hour: true
  }">
</chronica-time-picker>`,
  } as const;

  private readonly _themeService = inject(ThemeService);

  // Basic time picker (24-hour format)
  basicSelectedTime: ChronicaTimeValue | null = null;
  basicConfig = computed(
    (): TimePickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      format24Hour: true,
      showSeconds: false,
    })
  );

  // 12-hour format time picker
  twelveHourTime: ChronicaTimeValue | null = null;
  twelveHourConfig = computed(
    (): TimePickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      format24Hour: false,
      showSeconds: false,
    })
  );

  // Time picker with seconds
  timeWithSeconds: ChronicaTimeValue | null = null;
  secondsConfig = computed(
    (): TimePickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      format24Hour: true,
      showSeconds: true,
    })
  );

  // Time picker with restrictions
  restrictedTime: ChronicaTimeValue | null = null;
  restrictedConfig = computed(
    (): TimePickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      format24Hour: true,
      showSeconds: false,
    })
  );
  minTime: ChronicaTimeValue = { hours: 9, minutes: 0 }; // 9:00 AM
  maxTime: ChronicaTimeValue = { hours: 17, minutes: 30 }; // 5:30 PM

  // Form integration
  formSelectedTime: ChronicaTimeValue | null = { hours: 14, minutes: 30 }; // 2:30 PM
  formConfig = computed(
    (): TimePickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      format24Hour: false,
      showSeconds: false,
    })
  );

  // Custom step intervals
  customStepTime: ChronicaTimeValue | null = null;
  customStepConfig = computed(
    (): TimePickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      format24Hour: true,
      showSeconds: true,
      minuteStep: 15, // 15-minute intervals
      secondStep: 30, // 30-second intervals
    })
  );

  // Dark theme
  darkThemeTime: ChronicaTimeValue | null = null;
  darkThemeConfig = computed(
    (): TimePickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'dark',
      colorTheme: this._themeService.currentTheme(),
      format24Hour: true,
      showSeconds: false,
    })
  );

  onBasicTimeChanged(time: ChronicaTimeValue | null): void {
    this.basicSelectedTime = time;
  }

  onTwelveHourTimeChanged(time: ChronicaTimeValue | null): void {
    this.twelveHourTime = time;
  }

  onTimeWithSecondsChanged(time: ChronicaTimeValue | null): void {
    this.timeWithSeconds = time;
  }

  onRestrictedTimeChanged(time: ChronicaTimeValue | null): void {
    this.restrictedTime = time;
  }

  onFormTimeChanged(time: ChronicaTimeValue | null): void {
    this.formSelectedTime = time;
  }

  onCustomStepTimeChanged(time: ChronicaTimeValue | null): void {
    this.customStepTime = time;
  }

  onDarkThemeTimeChanged(time: ChronicaTimeValue | null): void {
    this.darkThemeTime = time;
  }

  formatTimeDisplay(
    time: ChronicaTimeValue | null,
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

  getTimeInMinutes(time: ChronicaTimeValue | null): number {
    if (!time) return 0;
    return time.hours * 60 + time.minutes;
  }
}
