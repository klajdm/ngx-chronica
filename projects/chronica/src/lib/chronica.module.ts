import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChronicaDatepickerComponent } from './components/datepicker/datepicker.component';
import { ChronicaInlineCalendarComponent } from './components/inline-calendar/inline-calendar.component';

@NgModule({
  imports: [CommonModule, ChronicaDatepickerComponent, ChronicaInlineCalendarComponent],
  exports: [ChronicaDatepickerComponent, ChronicaInlineCalendarComponent],
})
export class ChronicaModule {}
