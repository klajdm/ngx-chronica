import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-key-features',
  standalone: true,
  imports: [],
  templateUrl: './key-features.component.html',
})
export class KeyFeaturesComponent {
  readonly features = input.required<string[]>();
  readonly color = input<'blue' | 'green'>('blue');
  readonly compact = input<boolean>(false);

  protected readonly leftColumn = computed(() => {
    const all = this.features();
    return all.slice(0, Math.ceil(all.length / 2));
  });

  protected readonly rightColumn = computed(() => {
    const all = this.features();
    return all.slice(Math.ceil(all.length / 2));
  });
}
