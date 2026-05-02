import { Component, input } from '@angular/core';

export interface ConfigOption {
  property: string;
  type: string;
  default: string;
  description: string;
}

@Component({
  selector: 'app-config-options',
  standalone: true,
  imports: [],
  templateUrl: './config-options.component.html',
})
export class ConfigOptionsComponent {
  readonly options = input.required<ConfigOption[]>();
}
