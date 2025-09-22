import { Component, inject, computed, effect } from '@angular/core';
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
  private readonly themeService = inject(ThemeService);

  // Default input datepicker
  defaultSelectedDate: Date | null = null;
  defaultConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
    })
  );

  // Custom trigger datepicker
  customSelectedDate: Date | null = null;
  customConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
    })
  );

  // Basic datepicker (legacy)
  basicSelectedDate: Date | null = null;
  basicConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
    })
  );

  // Themed datepicker (legacy)
  themedSelectedDate: Date | null = null;
  themedConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
    })
  );

  // Date range restricted datepicker
  restrictedSelectedDate: Date | null = null;
  restrictedConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
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
      colorTheme: this.themeService.currentTheme(),
    })
  );

  // Disabled dates datepicker
  disabledDatesSelected: Date | null = null;
  disabledDatesConfig = computed(
    (): CalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this.themeService.currentTheme(),
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
      colorTheme: this.themeService.currentTheme(),
    })
  );

  onDefaultDateSelected(date: Date): void {
    this.defaultSelectedDate = date;
    console.log('Default date selected:', date);
  }

  onCustomDateSelected(date: Date): void {
    this.customSelectedDate = date;
    console.log('Custom trigger date selected:', date);
  }

  onBasicDateSelected(date: Date): void {
    this.basicSelectedDate = date;
    console.log('Basic date selected:', date);
  }

  onThemedDateSelected(date: Date): void {
    this.themedSelectedDate = date;
    console.log('Themed date selected:', date);
  }

  onRestrictedDateSelected(date: Date): void {
    this.restrictedSelectedDate = date;
    console.log('Restricted date selected:', date);
  }

  onFormDateSelected(date: Date): void {
    this.formSelectedDate = date;
    console.log('Form date selected:', date);
  }

  onDisabledDatesSelected(date: Date): void {
    this.disabledDatesSelected = date;
    console.log('Disabled dates calendar date selected:', date);
  }

  onDarkThemeDateSelected(date: Date): void {
    this.darkThemeDate = date;
    console.log('Dark theme date selected:', date);
  }

  onMonthChanged(event: { month: number; year: number }): void {
    console.log('Month changed:', event);
  }
}
