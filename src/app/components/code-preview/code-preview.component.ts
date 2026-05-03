import { Component, input } from '@angular/core';

@Component({
  selector: 'app-code-preview',
  standalone: true,
  imports: [],
  template: `
    <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
      <pre class="text-gray-200 text-sm"><code [textContent]="code()"></code></pre>
    </div>
  `,
})
export class CodePreviewComponent {
  readonly code = input.required<string>();
}
