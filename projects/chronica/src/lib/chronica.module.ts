import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChronicaDatepickerComponent } from './components/datepicker/datepicker.component';
import { ChronicaInlineCalendarComponent } from './components/inline-calendar/inline-calendar.component';
import { ChronicaDateRangeComponent } from './components/date-range/date-range.component';
import { ChronicaTimePickerComponent } from './components/time-picker/time-picker.component';
import { ChronicaDurationPickerComponent } from './components/duration-picker/duration-picker.component';
import { ChronicaDateTimePickerComponent } from './components/datetime-picker/datetime-picker.component';

@NgModule({
  imports: [
    CommonModule,
    ChronicaDatepickerComponent,
    ChronicaDateTimePickerComponent,
    ChronicaInlineCalendarComponent,
    ChronicaDateRangeComponent,
    ChronicaTimePickerComponent,
    ChronicaDurationPickerComponent,
  ],
  exports: [
    ChronicaDatepickerComponent,
    ChronicaDateTimePickerComponent,
    ChronicaInlineCalendarComponent,
    ChronicaDateRangeComponent,
    ChronicaTimePickerComponent,
    ChronicaDurationPickerComponent,
  ],
})
export class ChronicaModule {}
