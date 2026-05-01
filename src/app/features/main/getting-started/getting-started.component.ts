import { Component, inject, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChronicaDatepickerComponent } from '../../../../../projects/chronica/src/lib/components/datepicker/datepicker.component';
import {
  ChronicaCalendarConfig,
  DEFAULT_CALENDAR_CONFIG,
} from '../../../../../projects/chronica/src/lib/models/index';
import { ThemeService } from '../../../services/theme.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [ChronicaDatepickerComponent, DatePipe, RouterModule],
  templateUrl: './getting-started.component.html',
})
export class GettingStartedComponent {
  private readonly _themeService = inject(ThemeService);

  // Example datepicker
  exampleSelectedDate: Date | null = new Date(2025, 8, 15); // September 15, 2025
  exampleConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  onExampleDateSelected(date: Date): void {
    this.exampleSelectedDate = date;
  }

  readonly copiedKey = signal<string | null>(null);

  copyCode(text: string, key: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedKey.set(key);
      setTimeout(() => this.copiedKey.set(null), 2000);
    });
  }
}
