import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChronicaInlineCalendarComponent } from '../../../../../projects/chronica/src/lib/components/inline-calendar/inline-calendar.component';
import { ChronicaDatepickerComponent } from '../../../../../projects/chronica/src/lib/components/datepicker/datepicker.component';
import {
  ChronicaCalendarConfig,
  ChronicaLocale,
  DEFAULT_CALENDAR_CONFIG,
  CHRONICA_LOCALES,
} from '../../../../../projects/chronica/src/lib/models/index';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-locales-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ChronicaInlineCalendarComponent, ChronicaDatepickerComponent],
  templateUrl: './locales-demo.component.html',
})
export class LocalesDemoComponent {
  private readonly _themeService = inject(ThemeService);

  readonly localesMap = CHRONICA_LOCALES;

  readonly localeInfo: { code: string; name: string; format: string; weekStart: string }[] = [
    { code: 'en-US', name: 'English (US)', format: 'MM/dd/yyyy', weekStart: 'Sunday' },
    { code: 'en-GB', name: 'English (UK)', format: 'dd/MM/yyyy', weekStart: 'Monday' },
    { code: 'es-ES', name: 'Spanish', format: 'dd/MM/yyyy', weekStart: 'Monday' },
    { code: 'fr-FR', name: 'French', format: 'dd/MM/yyyy', weekStart: 'Monday' },
    { code: 'de-DE', name: 'German', format: 'dd.MM.yyyy', weekStart: 'Monday' },
    { code: 'it-IT', name: 'Italian', format: 'dd/MM/yyyy', weekStart: 'Monday' },
    { code: 'pt-BR', name: 'Portuguese (BR)', format: 'dd/MM/yyyy', weekStart: 'Sunday' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', format: 'yyyy/MM/dd', weekStart: 'Monday' },
    { code: 'ja-JP', name: 'Japanese', format: 'yyyy/MM/dd', weekStart: 'Sunday' },
    { code: 'ko-KR', name: 'Korean', format: 'yyyy. MM. dd.', weekStart: 'Sunday' },
    { code: 'ru-RU', name: 'Russian', format: 'dd.MM.yyyy', weekStart: 'Monday' },
  ];

  selectedLocaleCode = signal('en-US');
  switcherDate: Date | null = new Date();
  formatDemoDate: Date | null = new Date();

  switcherConfig = computed((): ChronicaCalendarConfig => ({
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: this._themeService.currentTheme(),
  }));

  formatConfig = computed((): ChronicaCalendarConfig => ({
    ...DEFAULT_CALENDAR_CONFIG,
    theme: 'light',
    colorTheme: this._themeService.currentTheme(),
  }));

  setLocale(code: string): void {
    this.selectedLocaleCode.set(code);
  }

  getLocale(code: string): ChronicaLocale {
    return CHRONICA_LOCALES[code];
  }

  getLocaleName(code: string): string {
    return this.localeInfo.find((l) => l.code === code)?.name ?? code;
  }

  onSwitcherDateSelected(date: Date): void {
    this.switcherDate = date;
  }

  onFormatDateSelected(date: Date): void {
    this.formatDemoDate = date;
  }
}
