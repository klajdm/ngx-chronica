import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChronicaDatepickerComponent } from "./components/datepicker/datepicker.component";

@NgModule({
  imports: [CommonModule, ChronicaDatepickerComponent],
  exports: [ChronicaDatepickerComponent],
})
export class ChronicaModule {}
