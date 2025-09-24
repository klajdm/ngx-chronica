import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChronicaTimePickerComponent,
  TimeValue,
  TimePickerConfig,
} from '../../../../../projects/chronica/src/lib/components/time-picker/time-picker.component';
import { DEFAULT_CALENDAR_CONFIG } from '../../../../../projects/chronica/src/lib/models/index';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-time-picker-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaTimePickerComponent],
  templateUrl: './time-picker-demo.component.html',
})
export class TimePickerDemoComponent {
  private readonly _themeService = inject(ThemeService);

  // Basic time picker (24-hour format)
  basicSelectedTime: TimeValue | null = null;
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
  twelveHourTime: TimeValue | null = null;
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
  timeWithSeconds: TimeValue | null = null;
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
  restrictedTime: TimeValue | null = null;
  restrictedConfig = computed(
    (): TimePickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      format24Hour: true,
      showSeconds: false,
    })
  );
  minTime: TimeValue = { hours: 9, minutes: 0 }; // 9:00 AM
  maxTime: TimeValue = { hours: 17, minutes: 30 }; // 5:30 PM

  // Form integration
  formSelectedTime: TimeValue | null = { hours: 14, minutes: 30 }; // 2:30 PM
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
  customStepTime: TimeValue | null = null;
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
  darkThemeTime: TimeValue | null = null;
  darkThemeConfig = computed(
    (): TimePickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'dark',
      colorTheme: this._themeService.currentTheme(),
      format24Hour: true,
      showSeconds: false,
    })
  );

  onBasicTimeChanged(time: TimeValue | null): void {
    this.basicSelectedTime = time;
  }

  onTwelveHourTimeChanged(time: TimeValue | null): void {
    this.twelveHourTime = time;
  }

  onTimeWithSecondsChanged(time: TimeValue | null): void {
    this.timeWithSeconds = time;
  }

  onRestrictedTimeChanged(time: TimeValue | null): void {
    this.restrictedTime = time;
  }

  onFormTimeChanged(time: TimeValue | null): void {
    this.formSelectedTime = time;
  }

  onCustomStepTimeChanged(time: TimeValue | null): void {
    this.customStepTime = time;
  }

  onDarkThemeTimeChanged(time: TimeValue | null): void {
    this.darkThemeTime = time;
  }

  formatTimeDisplay(
    time: TimeValue | null,
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

  getTimeInMinutes(time: TimeValue | null): number {
    if (!time) return 0;
    return time.hours * 60 + time.minutes;
  }
}
