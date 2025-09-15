import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeroComponent } from "./hero/hero.component";
import { FeaturesComponent } from "./features/features.component";
import { ExamplesComponent } from "./examples/examples.component";
import { SidebarComponent } from "src/app/components/sidebar/sidebar.component";
import { HeaderComponent } from "src/app/components/header/header.component";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "src/app/components/footer/footer.component";

@Component({
  selector: "app-main",
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    FeaturesComponent,
    ExamplesComponent,
    SidebarComponent,
    HeaderComponent,
    RouterModule,
    FooterComponent,
  ],
  templateUrl: "./main.component.html",
  styles: [],
})
export class MainComponent {}
