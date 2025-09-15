import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero/hero.component';
import { FeaturesComponent } from './features/features.component';
import { ExamplesComponent } from './examples/examples.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, HeroComponent, FeaturesComponent, ExamplesComponent],
  template: `
    <main>
      <app-hero></app-hero>
      <app-features></app-features>
      <app-examples></app-examples>
    </main>
  `,
  styles: []
})
export class MainComponent {
}
