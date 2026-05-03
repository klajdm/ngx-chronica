import { Component } from '@angular/core';
import { LucidePackage, LucideHeart } from '@lucide/angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LucidePackage],
  templateUrl: './footer.component.html',
  styles: [],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
