import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChronicaInlineCalendarComponent } from '../../../../../projects/chronica/src/public-api';

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [CommonModule, ChronicaInlineCalendarComponent],
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css'],
})
export class IntroductionComponent {
  previewSelectedDate: Date | null = null;

  onPreviewDateSelected(date: Date): void {
    this.previewSelectedDate = date;
    console.log('Intro preview date selected:', date);
  }
}
