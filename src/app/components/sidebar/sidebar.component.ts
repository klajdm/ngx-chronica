import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <div class="p-6">
        <nav class="space-y-2">
          <div class="mb-6">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Components</h3>
            <ul class="space-y-1">
              <li>
                <a href="#datepicker" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900">
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Datepicker
                </a>
              </li>
              <li>
                <a href="#inline-calendar" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900">
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2 4h4"></path>
                  </svg>
                  Inline Calendar
                </a>
              </li>
            </ul>
          </div>

          <div class="mb-6">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Themes</h3>
            <ul class="space-y-1">
              <li>
                <button class="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900">
                  <div class="w-3 h-3 mr-3 bg-blue-500 rounded-full"></div>
                  Default
                </button>
              </li>
              <li>
                <button class="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900">
                  <div class="w-3 h-3 mr-3 bg-green-500 rounded-full"></div>
                  Nature
                </button>
              </li>
              <li>
                <button class="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900">
                  <div class="w-3 h-3 mr-3 bg-purple-500 rounded-full"></div>
                  Purple
                </button>
              </li>
              <li>
                <button class="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900">
                  <div class="w-3 h-3 mr-3 bg-gray-800 rounded-full"></div>
                  Dark
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Links</h3>
            <ul class="space-y-1">
              <li>
                <a href="https://github.com/klajdm/ngx-chronica" target="_blank" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900">
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
                  </svg>
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.npmjs.com/package/ngx-chronica" target="_blank" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900">
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
                  </svg>
                  npm
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent {
}
