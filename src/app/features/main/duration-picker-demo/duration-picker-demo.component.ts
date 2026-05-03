import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChronicaDurationPickerComponent,
  ChronicaDurationValue,
  DurationPickerConfig,
} from '../../../../../projects/chronica/src/public-api';
import { DEFAULT_CALENDAR_CONFIG } from '../../../../../projects/chronica/src/lib/models/index';
import { ThemeService } from '../../../services/theme.service';
import { KeyFeaturesComponent } from '../../../components/key-features/key-features.component';
import { ConfigOptionsComponent, ConfigOption } from '../../../components/config-options/config-options.component';
import { CodePreviewComponent } from '../../../components/code-preview/code-preview.component';
import { LucideCircleCheck, LucideCircleX } from '@lucide/angular';

@Component({
  selector: 'app-duration-picker-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaDurationPickerComponent, KeyFeaturesComponent, ConfigOptionsComponent, CodePreviewComponent, LucideCircleCheck, LucideCircleX],
  templateUrl: './duration-picker-demo.component.html',
})
export class DurationPickerDemoComponent {
  protected readonly options: ConfigOption[] = [
    { property: 'showDays', type: 'boolean', default: 'false', description: 'Show days selector for long durations' },
    { property: 'showHours', type: 'boolean', default: 'true', description: 'Show hours selector' },
    { property: 'showMinutes', type: 'boolean', default: 'true', description: 'Show minutes selector' },
    { property: 'showSeconds', type: 'boolean', default: 'false', description: 'Show seconds selector for precision' },
    { property: 'maxDays', type: 'number', default: '365', description: 'Maximum selectable days' },
    { property: 'maxHours', type: 'number', default: '23', description: 'Maximum selectable hours' },
    { property: 'stepMinutes', type: 'number', default: '1', description: 'Step interval for minutes (e.g., 15 for 15-min blocks)' },
    { property: 'allowZero', type: 'boolean', default: 'true', description: 'Allow zero duration selection' },
    { property: 'colorTheme', type: 'string', default: "'blue'", description: 'Color theme: blue, purple, green, red, orange, teal, pink, indigo' },
    { property: 'theme', type: 'string', default: "'light'", description: 'UI theme: light or dark' },
  ];

  protected readonly features: string[] = [
    'Multi-unit duration selection (days, hours, minutes, seconds)',
    'Quick preset buttons for common durations',
    'Customizable step intervals for precise control',
    'Duration limits and validation support',
    'Real-time duration summary and conversion',
    'Angular forms integration (ngModel & Reactive)',
    'Multiple color themes & dark mode support',
    'Popup-based selection interface',
    'Project planning and time tracking ready',
    'Responsive design for mobile and desktop',
  ];

  protected readonly codeSnippets = {
    basic: `<chronica-duration-picker
  [(ngModel)]="basicDuration"
  [config]="{
    colorTheme: 'blue',
    showHours: true,
    showMinutes: true,
    allowZero: true
  }"
  placeholder="Select duration"
  (durationChange)="onDurationChange($event)">
</chronica-duration-picker>`,
    withSeconds: `<chronica-duration-picker
  [(ngModel)]="precisionDuration"
  [config]="{
    colorTheme: 'blue',
    showHours: true,
    showMinutes: true,
    showSeconds: true
  }">
</chronica-duration-picker>`,
    projectPlanning: `<chronica-duration-picker
  [(ngModel)]="projectDuration"
  [config]="{
    colorTheme: 'blue',
    showDays: true,
    showHours: true,
    showMinutes: true,
    maxDays: 30,
    allowZero: false
  }">
</chronica-duration-picker>`,
    formIntegration: `<chronica-duration-picker
  name="workDuration"
  [(ngModel)]="formDuration"
  [config]="{
    colorTheme: 'blue',
    showHours: true,
    showMinutes: true,
    allowZero: false
  }"
  required>
</chronica-duration-picker>`,
    customIntervals: `<chronica-duration-picker
  [(ngModel)]="intervalDuration"
  [config]="{
    colorTheme: 'blue',
    showHours: true,
    showMinutes: true,
    stepHours: 1,
    stepMinutes: 15
  }">
</chronica-duration-picker>`,
    timeTracking: `<chronica-duration-picker
  [(ngModel)]="trackingDuration"
  [config]="{
    colorTheme: 'blue',
    showHours: true,
    showMinutes: true,
    maxHours: 12,
    allowZero: false
  }"
  [maxDuration]="{ hours: 8, minutes: 0 }">
</chronica-duration-picker>`,
    darkTheme: `<chronica-duration-picker
  [(ngModel)]="darkDuration"
  [config]="{
    colorTheme: 'blue',
    theme: 'dark',
    showHours: true,
    showMinutes: true
  }">
</chronica-duration-picker>`,
  } as const;

  private readonly _themeService = inject(ThemeService);

  // Demo 1: Basic duration picker (hours and minutes)
  basicDuration: ChronicaDurationValue | null = null;
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
  precisionDuration: ChronicaDurationValue | null = { hours: 2, minutes: 30, seconds: 45 };
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
  projectDuration: ChronicaDurationValue | null = null;
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
  formDuration: ChronicaDurationValue | null = { hours: 8 };
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
  intervalDuration: ChronicaDurationValue | null = null;
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
  trackingDuration: ChronicaDurationValue | null = null;
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
  darkDuration: ChronicaDurationValue | null = { hours: 1, minutes: 30 };
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

  onDurationChange(duration: ChronicaDurationValue | null, demo: string): void {
    console.log(`${demo} duration changed:`, duration);
  }

  // Utility method to format duration for display
  formatDuration(duration: ChronicaDurationValue | null): string {
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
  getTotalMinutes(duration: ChronicaDurationValue | null): number {
    if (!duration) return 0;

    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = duration;
    return days * 24 * 60 + hours * 60 + minutes + Math.round(seconds / 60);
  }

  // Calculate total seconds for display
  getTotalSeconds(duration: ChronicaDurationValue | null): number {
    if (!duration) return 0;

    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = duration;
    return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
  }
}
