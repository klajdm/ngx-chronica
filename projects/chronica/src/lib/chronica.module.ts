import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChronicaDatepickerComponent } from './components/datepicker/datepicker.component';
import { ChronicaInlineCalendarComponent } from './components/inline-calendar/inline-calendar.component';
import { ChronicaDateRangeComponent } from './components/date-range/date-range.component';

@NgModule({
  imports: [CommonModule, ChronicaDatepickerComponent, ChronicaInlineCalendarComponent, ChronicaDateRangeComponent],
  exports: [ChronicaDatepickerComponent, ChronicaInlineCalendarComponent, ChronicaDateRangeComponent],
})
export class ChronicaModule {}
