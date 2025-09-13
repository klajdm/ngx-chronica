import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InlineCalendarComponent } from "./components/inline-calendar.component";

@NgModule({
  imports: [CommonModule, InlineCalendarComponent],
  exports: [InlineCalendarComponent],
})
export class AngularInlineCalendarModule {}
