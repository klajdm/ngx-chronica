import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChronicaDatepickerComponent } from '../../../../../projects/chronica/src/lib/components/datepicker/datepicker.component';
import {
  CalendarConfig,
  DEFAULT_CALENDAR_CONFIG,
} from '../../../../../projects/chronica/src/lib/models/chronica.models';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-datepicker-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaDatepickerComponent],
  templateUrl: './datepicker-demo.component.html',
})
export class DatepickerDemoComponent {
  private readonly _themeService = inject(ThemeService);

  // Default input datepicker
  defaultSelectedDate: Date | null = null;
  defaultConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Custom trigger datepicker
  customSelectedDate: Date | null = null;
  customConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Date range restricted datepicker
  restrictedSelectedDate: Date | null = null;
  restrictedConfig = computed(
    (): CalendarConfig => ({
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
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  // Disabled dates datepicker
  disabledDatesSelected: Date | null = null;
  disabledDatesConfig = computed(
    (): CalendarConfig => ({
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
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'dark',
      colorTheme: this._themeService.currentTheme(),
    })
  );

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
