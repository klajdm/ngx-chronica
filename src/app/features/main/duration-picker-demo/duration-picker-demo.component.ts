import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChronicaDurationPickerComponent,
  DurationValue,
  DurationPickerConfig,
} from '../../../../../projects/chronica/src/public-api';
import { DEFAULT_CALENDAR_CONFIG } from '../../../../../projects/chronica/src/lib/models/chronica.models';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-duration-picker-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaDurationPickerComponent],
  templateUrl: './duration-picker-demo.component.html',
})
export class DurationPickerDemoComponent {
  private readonly _themeService = inject(ThemeService);

  // Demo 1: Basic duration picker (hours and minutes)
  basicDuration: DurationValue | null = null;
  basicConfig = computed(
    (): DurationPickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      showHours: true,
      showMinutes: true,
      allowZero: true,
    })
  );

  // Demo 2: With seconds
  precisionDuration: DurationValue | null = { hours: 2, minutes: 30, seconds: 45 };
  precisionConfig = computed(
    (): DurationPickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      allowZero: true,
    })
  );

  // Demo 3: Days, hours, minutes for project planning
  projectDuration: DurationValue | null = null;
  projectConfig = computed(
    (): DurationPickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      showDays: true,
      showHours: true,
      showMinutes: true,
      maxDays: 365,
      allowZero: true,
    })
  );

  // Demo 4: Form integration
  formDuration: DurationValue | null = { hours: 8 };
  formConfig = computed(
    (): DurationPickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      showHours: true,
      showMinutes: true,
      maxHours: 24,
      allowZero: false,
    })
  );

  // Demo 5: Custom intervals (15-minute steps)
  intervalDuration: DurationValue | null = null;
  intervalConfig = computed(
    (): DurationPickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      showHours: true,
      showMinutes: true,
      stepMinutes: 15,
      allowZero: true,
    })
  );

  // Demo 6: Time tracking with restrictions
  trackingDuration: DurationValue | null = null;
  trackingConfig = computed(
    (): DurationPickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
      showHours: true,
      showMinutes: true,
      maxHours: 12,
      maxMinutes: 59,
      allowZero: false,
    })
  );

  // Demo 7: Dark theme
  darkDuration: DurationValue | null = { hours: 1, minutes: 30 };
  darkConfig = computed(
    (): DurationPickerConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'dark',
      colorTheme: this._themeService.currentTheme(),
      showHours: true,
      showMinutes: true,
      allowZero: true,
    })
  );

  onDurationChange(duration: DurationValue | null, demo: string): void {
    console.log(`${demo} duration changed:`, duration);
  }

  // Utility method to format duration for display
  formatDuration(duration: DurationValue | null): string {
    if (!duration) return 'No duration selected';

    const parts: string[] = [];

    if (duration.days && duration.days > 0) {
      parts.push(`${duration.days} ${duration.days === 1 ? 'day' : 'days'}`);
    }

    if (duration.hours !== undefined && duration.hours >= 0) {
      parts.push(`${duration.hours} ${duration.hours === 1 ? 'hour' : 'hours'}`);
    }

    if (duration.minutes !== undefined && duration.minutes >= 0) {
      parts.push(`${duration.minutes} ${duration.minutes === 1 ? 'minute' : 'minutes'}`);
    }

    if (duration.seconds !== undefined && duration.seconds >= 0) {
      parts.push(`${duration.seconds} ${duration.seconds === 1 ? 'second' : 'seconds'}`);
    }

    return parts.length > 0 ? parts.join(' ') : '0 minutes';
  }

  // Calculate total minutes for display
  getTotalMinutes(duration: DurationValue | null): number {
    if (!duration) return 0;

    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = duration;
    return days * 24 * 60 + hours * 60 + minutes + Math.round(seconds / 60);
  }

  // Calculate total seconds for display
  getTotalSeconds(duration: DurationValue | null): number {
    if (!duration) return 0;

    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = duration;
    return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
  }
}
