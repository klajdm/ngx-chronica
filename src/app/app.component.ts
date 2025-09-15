import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./app.component.html",
  styles: [],
})
export class AppComponent {}
