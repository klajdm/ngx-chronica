import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  ChronicaCalendarConfig,
  ChronicaInlineCalendarComponent,
  DEFAULT_CALENDAR_CONFIG,
} from '../../../../../projects/chronica/src/public-api';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [ChronicaInlineCalendarComponent, DatePipe],
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css'],
})
export class IntroductionComponent {
  private readonly _themeService = inject(ThemeService);

  readonly features: { label: string; description: string }[] = [
    { label: '6 Specialized Components', description: 'DatePicker, Date Range, Inline Calendar, Time Picker, DateTime Picker, and Duration Picker.' },
    { label: '8 Beautiful Themes', description: 'Light and dark mode with Blue, Green, Purple, Red, Orange, Teal, Pink, or Indigo.' },
    { label: 'Seamless Form Integration', description: 'Full ControlValueAccessor for Reactive and Template-driven forms.' },
    { label: 'Internationalization', description: '11 built-in locales (EN-US, EN-GB, ES, FR, DE, IT, PT, ZH, JA, KO, RU) plus custom support.' },
    { label: 'Smart Validation', description: 'Min/max constraints, disabled dates, time restrictions, and business day filtering.' },
    { label: 'Accessibility', description: 'WCAG 2.1 AA targeted with keyboard navigation and screen reader support.' },
    { label: 'Standalone Components', description: 'Modern Angular with zero setup for standalone or NgModule apps.' },
    { label: 'TypeScript First', description: 'Comprehensive type definitions and strict mode compliance.' },
    { label: 'Mobile Responsive', description: 'Touch-friendly with optimized layouts and gesture support.' },
    { label: 'Highly Customizable', description: 'Extensive options, CSS variables, and flexible APIs.' },
  ];

  previewSelectedDate: Date | null = null;

  previewBasicConfig = computed(
    (): ChronicaCalendarConfig => ({
      ...DEFAULT_CALENDAR_CONFIG,
      theme: 'light',
      colorTheme: this._themeService.currentTheme(),
    })
  );

  onPreviewDateSelected(date: Date): void {
    this.previewSelectedDate = date;
  }
}
