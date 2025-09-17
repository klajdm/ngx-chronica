import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChronicaDatepickerComponent } from '../../../../../projects/chronica/src/lib/components/datepicker/datepicker.component';
import {
  CalendarConfig,
  DEFAULT_CALENDAR_CONFIG,
} from '../../../../../projects/chronica/src/lib/models/chronica.models';

@Component({
  selector: 'app-datepicker-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaDatepickerComponent],
  templateUrl: './datepicker-demo.component.html',
})
export class DatepickerDemoComponent {
  // Default input datepicker
  defaultSelectedDate: Date | null = null;
  defaultConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'blue',
  };

  // Custom trigger datepicker
  customSelectedDate: Date | null = null;
  customConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'purple',
  };

  // Green themed datepicker
  greenSelectedDate: Date | null = null;
  greenConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'green',
  };

  // Red themed datepicker
  redSelectedDate: Date | null = null;
  redConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'red',
  };

  // Basic datepicker (legacy)
  basicSelectedDate: Date | null = null;
  basicConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'blue',
  };

  // Themed datepicker (legacy)
  themedSelectedDate: Date | null = null;
  themedConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'purple',
  };

  // Date range restricted datepicker
  restrictedSelectedDate: Date | null = null;
  restrictedConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'orange',
    minDate: new Date(2024, 0, 1), // January 1, 2024
    maxDate: new Date(2024, 11, 31), // December 31, 2024
  };

  // Form integration datepicker
  formSelectedDate: Date | null = new Date();
  formConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'indigo',
  };

  // Disabled dates datepicker
  disabledDatesSelected: Date | null = null;
  disabledDatesConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'red',
    disabledDates: [
      new Date(2024, 11, 25), // Christmas
      new Date(2024, 0, 1), // New Year
      new Date(2024, 6, 4), // July 4th
    ],
  };

  // Dark theme datepicker
  darkThemeDate: Date | null = null;
  darkThemeConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'dark',
    colorTheme: 'teal',
  };

  onDefaultDateSelected(date: Date): void {
    this.defaultSelectedDate = date;
    console.log('Default date selected:', date);
  }

  onCustomDateSelected(date: Date): void {
    this.customSelectedDate = date;
    console.log('Custom trigger date selected:', date);
  }

  onGreenDateSelected(date: Date): void {
    this.greenSelectedDate = date;
    console.log('Green themed date selected:', date);
  }

  onRedDateSelected(date: Date): void {
    this.redSelectedDate = date;
    console.log('Red themed date selected:', date);
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
