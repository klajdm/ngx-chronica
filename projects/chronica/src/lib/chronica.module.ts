import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChronicaDatepickerComponent } from './components/datepicker/datepicker.component';
import { ChronicaInlineCalendarComponent } from './components/inline-calendar/inline-calendar.component';
import { ChronicaDateRangeComponent } from './components/date-range/date-range.component';
import { ChronicaTimePickerComponent } from './components/time-picker/time-picker.component';

@NgModule({
  imports: [CommonModule, ChronicaDatepickerComponent, ChronicaInlineCalendarComponent, ChronicaDateRangeComponent, ChronicaTimePickerComponent],
  exports: [ChronicaDatepickerComponent, ChronicaInlineCalendarComponent, ChronicaDateRangeComponent, ChronicaTimePickerComponent],
})
export class ChronicaModule {}
