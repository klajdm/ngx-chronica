import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChronicaDatepickerComponent } from '../../../../../projects/chronica/src/lib/components/datepicker/datepicker.component';
import {
  CalendarConfig,
  DEFAULT_CALENDAR_CONFIG,
} from '../../../../../projects/chronica/src/lib/models/chronica.models';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [CommonModule, ChronicaDatepickerComponent],
  templateUrl: './getting-started.component.html',
})
export class GettingStartedComponent {
  // Example datepicker
  exampleSelectedDate: Date | null = new Date(2025, 8, 15); // September 15, 2025
  exampleConfig: CalendarConfig = {
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: 'blue',
  };

  onExampleDateSelected(date: Date): void {
    this.exampleSelectedDate = date;
  }
}
