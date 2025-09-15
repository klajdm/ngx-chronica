import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ChronicaDatepickerComponent,
  ChronicaInlineCalendarComponent,
} from "projects/chronica/src/public-api";

@Component({
  selector: "app-examples",
  standalone: true,
  imports: [
    CommonModule,
    ChronicaDatepickerComponent,
    ChronicaInlineCalendarComponent,
  ],
  template: `
    <section id="examples" class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            See it in action
          </h2>
          <p class="max-w-2xl mx-auto text-xl text-gray-600">
            Interactive examples showcasing both popup datepicker and inline
            calendar modes.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Datepicker Example -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center mb-6">
              <div
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4"
              >
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Popup Datepicker
                </h3>
                <p class="text-gray-600">Perfect for forms and input fields</p>
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Select a date</label
                >
                <chronica-datepicker
                  [selectedDate]="selectedDate1"
                  (dateSelected)="onDateSelected1($event)"
                  class="block"
                >
                  <button
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-gray-900">
                        {{
                          selectedDate1
                            ? (selectedDate1 | date : "mediumDate")
                            : "Choose a date"
                        }}
                      </span>
                      <svg
                        class="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                  </button>
                </chronica-datepicker>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">
                  Code Example
                </h4>
                <pre
                  class="text-sm text-gray-700 overflow-x-auto"
                ><code>&lt;chronica-datepicker
  [selectedDate]="selectedDate"
  (dateSelected)="onDateSelected($event)"&gt;
  &lt;button&gt;Choose a date&lt;/button&gt;
&lt;/chronica-datepicker&gt;</code></pre>
              </div>
            </div>
          </div>

          <!-- Inline Calendar Example -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center mb-6">
              <div
                class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4"
              >
                <svg
                  class="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2 4h4"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Inline Calendar
                </h3>
                <p class="text-gray-600">Always visible calendar display</p>
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <chronica-inline-calendar
                  [selectedDate]="selectedDate2"
                  (dateSelected)="onDateSelected2($event)"
                ></chronica-inline-calendar>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">
                  Code Example
                </h4>
                <pre
                  class="text-sm text-gray-700 overflow-x-auto"
                ><code>&lt;chronica-inline-calendar
  [selectedDate]="selectedDate"
  (dateSelected)="onDateSelected($event)"&gt;
&lt;/chronica-inline-calendar&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Theme Examples -->
        <div class="mt-16">
          <h3 class="text-2xl font-bold text-gray-900 text-center mb-8">
            Available Themes
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div *ngFor="let theme of themes" class="text-center">
              <div class="bg-white rounded-lg shadow-md p-4 mb-3">
                <div
                  class="w-full h-32 rounded-lg mb-3"
                  [style.background]="theme.gradient"
                ></div>
                <h4 class="font-medium text-gray-900">{{ theme.name }}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [],
})
export class ExamplesComponent {
  selectedDate1: Date | null = null;
  selectedDate2: Date | null = new Date();

  themes = [
    {
      name: "Default",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      name: "Nature",
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      name: "Purple",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      name: "Dark",
      gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
    },
    {
      name: "Ocean",
      gradient: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
    },
    {
      name: "Sunset",
      gradient: "linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)",
    },
    {
      name: "Forest",
      gradient: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
    },
    {
      name: "Minimal",
      gradient: "linear-gradient(135deg, #ddd6fe 0%, #e0e7ff 100%)",
    },
  ];

  onDateSelected1(date: Date): void {
    this.selectedDate1 = date;
  }

  onDateSelected2(date: Date): void {
    this.selectedDate2 = date;
  }
}
