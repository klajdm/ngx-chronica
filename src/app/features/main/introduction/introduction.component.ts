import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChronicaInlineCalendarComponent } from '../../../../../projects/chronica/src/public-api';
import { ThemeService } from '../../../services/theme.service';
import { ChronicaCalendarConfig, DEFAULT_CALENDAR_CONFIG } from '../../../../../dist/chronica';

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [CommonModule, ChronicaInlineCalendarComponent],
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css'],
})
export class IntroductionComponent {
  private readonly _themeService = inject(ThemeService);

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
