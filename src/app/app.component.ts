import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './features/main/main.component';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MainComponent,
  ],
  template: `
    <div class="min-h-screen bg-white">
      <app-header></app-header>
      <app-main></app-main>
      <app-footer></app-footer>
    </div>
  `,
  styles: []
})
export class AppComponent {
}
