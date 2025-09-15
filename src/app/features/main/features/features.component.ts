import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="features" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need in a calendar component
          </h2>
          <p class="max-w-2xl mx-auto text-xl text-gray-600">
            Built with modern Angular practices and designed for flexibility and ease of use.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Dual Mode Display -->
          <div class="text-center p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Dual Mode Display</h3>
            <p class="text-gray-600">
              Use as a popup datepicker or inline calendar component. Perfect flexibility for any use case.
            </p>
          </div>

          <!-- Zero Dependencies -->
          <div class="text-center p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Zero Dependencies</h3>
            <p class="text-gray-600">
              Lightweight and fast with no external dependencies. Only requires Angular core.
            </p>
          </div>

          <!-- 8 Beautiful Themes -->
          <div class="text-center p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">8 Beautiful Themes</h3>
            <p class="text-gray-600">
              Choose from 8 carefully crafted themes or customize with CSS variables.
            </p>
          </div>

          <!-- TypeScript First -->
          <div class="text-center p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">TypeScript First</h3>
            <p class="text-gray-600">
              Built with TypeScript for full type safety and excellent developer experience.
            </p>
          </div>

          <!-- Angular 15-19+ -->
          <div class="text-center p-6 rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3l6.364 9H5.636L12 3z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Angular 15-19+</h3>
            <p class="text-gray-600">
              Compatible with Angular 15 through 19+ with standalone component support.
            </p>
          </div>

          <!-- Customizable -->
          <div class="text-center p-6 rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Highly Customizable</h3>
            <p class="text-gray-600">
              Extensive configuration options and CSS custom properties for complete control.
            </p>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-20 pt-16 border-t border-gray-200">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div class="text-3xl font-bold text-gray-900 mb-2">8</div>
              <div class="text-sm text-gray-600 uppercase tracking-wider">Themes</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-gray-900 mb-2">0</div>
              <div class="text-sm text-gray-600 uppercase tracking-wider">Dependencies</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-gray-900 mb-2">2</div>
              <div class="text-sm text-gray-600 uppercase tracking-wider">Display Modes</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-gray-900 mb-2">5+</div>
              <div class="text-sm text-gray-600 uppercase tracking-wider">Angular Versions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class FeaturesComponent {
}
