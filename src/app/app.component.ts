import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  InlineCalendarComponent,
  CalendarConfig,
} from "projects/nga-inline-calendar/src/public-api";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InlineCalendarComponent,
  ],
  template: `
    <div class="demo-container">
      <header class="demo-header">
        <h1>Angular Inline Calendar Demo</h1>
        <p>
          A lightweight, customizable inline calendar component for Angular
          applications
        </p>
      </header>

      <!-- Global Color Theme Selector -->
      <div class="global-theme-selector">
        <label>
          Global Color Theme:
          <select
            [(ngModel)]="globalColorTheme"
            (change)="updateGlobalColorTheme()"
          >
            <option value="blue">Blue (Default)</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="teal">Teal</option>
            <option value="pink">Pink</option>
            <option value="indigo">Indigo</option>
          </select>
        </label>
      </div>

      <div class="demo-grid">
        <!-- Basic Calendar -->
        <div class="demo-card">
          <h2>Basic Calendar</h2>
          <nga-inline-calendar
            [selectedDate]="basicSelectedDate"
            [config]="basicConfig"
            (dateSelected)="onBasicDateSelected($event)"
          >
          </nga-inline-calendar>
          <div class="selected-date" *ngIf="basicSelectedDate">
            Selected: {{ basicSelectedDate | date : "fullDate" }}
          </div>
        </div>

        <!-- Dark Theme Calendar -->
        <div class="demo-card">
          <h2>Dark Theme</h2>
          <nga-inline-calendar
            [selectedDate]="darkSelectedDate"
            [config]="darkConfig"
            (dateSelected)="onDarkDateSelected($event)"
          >
          </nga-inline-calendar>
          <div class="selected-date" *ngIf="darkSelectedDate">
            Selected: {{ darkSelectedDate | date : "fullDate" }}
          </div>
        </div>

        <!-- Monday First Calendar -->
        <div class="demo-card">
          <h2>Monday First</h2>
          <nga-inline-calendar
            [selectedDate]="mondaySelectedDate"
            [config]="mondayConfig"
            (dateSelected)="onMondayDateSelected($event)"
          >
          </nga-inline-calendar>
          <div class="selected-date" *ngIf="mondaySelectedDate">
            Selected: {{ mondaySelectedDate | date : "fullDate" }}
          </div>
        </div>

        <!-- Restricted Calendar -->
        <div class="demo-card">
          <h2>Date Restrictions</h2>
          <p class="demo-description">
            Min: {{ restrictedConfig.minDate | date : "shortDate" }}<br />
            Max: {{ restrictedConfig.maxDate | date : "shortDate" }}
          </p>
          <nga-inline-calendar
            [selectedDate]="restrictedSelectedDate"
            [config]="restrictedConfig"
            (dateSelected)="onRestrictedDateSelected($event)"
          >
          </nga-inline-calendar>
          <div class="selected-date" *ngIf="restrictedSelectedDate">
            Selected: {{ restrictedSelectedDate | date : "fullDate" }}
          </div>
        </div>

        <!-- Reactive Forms -->
        <div class="demo-card">
          <h2>Reactive Forms</h2>
          <nga-inline-calendar
            [formControl]="reactiveFormControl"
            [config]="reactiveFormConfig"
          >
          </nga-inline-calendar>
          <div class="form-info">
            <p>
              <strong>Value:</strong>
              {{ reactiveFormControl.value | date : "shortDate" }}
            </p>
            <p><strong>Valid:</strong> {{ reactiveFormControl.valid }}</p>
            <div *ngIf="reactiveFormControl.errors?.['required']" class="error">
              Date is required
            </div>
          </div>
          <div class="form-actions">
            <button (click)="toggleReactiveDisabled()">
              {{ reactiveFormControl.disabled ? "Enable" : "Disable" }}
            </button>
            <button (click)="clearReactiveForm()">Clear</button>
          </div>
        </div>

        <!-- Template-driven Forms -->
        <div class="demo-card">
          <h2>Template-driven Forms</h2>
          <nga-inline-calendar
            [(ngModel)]="templateFormDate"
            name="templateDate"
            [config]="templateFormConfig"
          >
          </nga-inline-calendar>
          <div class="form-info">
            <p>
              <strong>Value:</strong>
              {{ templateFormDate | date : "shortDate" }}
            </p>
          </div>
          <div class="form-actions">
            <button (click)="setTemplateToday()">Set Today</button>
            <button (click)="clearTemplateForm()">Clear</button>
          </div>
        </div>

        <!-- Interactive Configuration -->
        <div class="demo-card full-width">
          <h2>Interactive Configuration</h2>
          <div class="config-controls">
            <label>
              Theme:
              <select
                [(ngModel)]="interactiveConfig.theme"
                (change)="updateInteractiveConfig()"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>

            <label>
              First Day of Week:
              <select
                [(ngModel)]="interactiveConfig.firstDayOfWeek"
                (change)="updateInteractiveConfig()"
              >
                <option [value]="0">Sunday</option>
                <option [value]="1">Monday</option>
                <option [value]="2">Tuesday</option>
                <option [value]="3">Wednesday</option>
                <option [value]="4">Thursday</option>
                <option [value]="5">Friday</option>
                <option [value]="6">Saturday</option>
              </select>
            </label>

            <label>
              <input
                type="checkbox"
                [(ngModel)]="interactiveConfig.showAdjacentMonths"
                (change)="updateInteractiveConfig()"
              />
              Show Adjacent Months
            </label>
          </div>

          <nga-inline-calendar
            [selectedDate]="interactiveSelectedDate"
            [config]="interactiveConfigCopy"
            (dateSelected)="onInteractiveDateSelected($event)"
            (monthChanged)="onMonthChanged($event)"
          >
          </nga-inline-calendar>

          <div class="selected-date" *ngIf="interactiveSelectedDate">
            Selected: {{ interactiveSelectedDate | date : "fullDate" }}
          </div>

          <div class="event-log">
            <h3>Event Log:</h3>
            <div class="log-entries">
              <div *ngFor="let event of eventLog" class="log-entry">
                {{ event }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="demo-footer">
        <p>
          <strong>Installation:</strong>
          <code>npm install nga-inline-calendar</code>
        </p>
        <p>
          <strong>Usage:</strong> Import
          <code>InlineCalendarComponent</code> and add
          <code>&lt;nga-inline-calendar&gt;</code> to your template
        </p>
      </footer>
    </div>
  `,
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  // Basic calendar
  basicSelectedDate: Date | null = new Date();
  basicConfig: CalendarConfig = {
    colorTheme: "blue",
  };

  // Dark theme calendar
  darkSelectedDate: Date | null = null;
  darkConfig: CalendarConfig = {
    theme: "dark",
    colorTheme: "blue",
  };

  // Monday first calendar
  mondaySelectedDate: Date | null = null;
  mondayConfig: CalendarConfig = {
    firstDayOfWeek: 1,
    colorTheme: "blue",
  };

  // Restricted calendar
  restrictedSelectedDate: Date | null = null;
  restrictedConfig: CalendarConfig = {
    minDate: new Date(2024, 0, 1), // January 1, 2024
    maxDate: new Date(2024, 11, 31), // December 31, 2024
    disabledDates: [
      new Date(2024, 11, 25), // Christmas
      new Date(2024, 0, 1), // New Year
    ],
    colorTheme: "blue",
  };

  // Interactive calendar
  interactiveSelectedDate: Date | null = null;
  interactiveConfig: CalendarConfig = {
    theme: "light",
    firstDayOfWeek: 0,
    showAdjacentMonths: true,
    colorTheme: "blue",
  };
  interactiveConfigCopy: CalendarConfig = { ...this.interactiveConfig };
  eventLog: string[] = [];

  // Forms integration
  reactiveFormControl = new FormControl<Date | null>(new Date(), [
    Validators.required,
  ]);
  templateFormDate: Date | null = null;
  reactiveFormConfig: CalendarConfig = {
    theme: "light",
    showTodayButton: true,
    colorTheme: "blue",
  };
  templateFormConfig: CalendarConfig = {
    theme: "dark",
    colorTheme: "blue",
  };

  // Global color theme
  globalColorTheme: string = "blue";

  onBasicDateSelected(date: Date) {
    this.basicSelectedDate = date;
    console.log("Basic calendar date selected:", date);
  }

  onDarkDateSelected(date: Date) {
    this.darkSelectedDate = date;
    console.log("Dark theme calendar date selected:", date);
  }

  onMondayDateSelected(date: Date) {
    this.mondaySelectedDate = date;
    console.log("Monday first calendar date selected:", date);
  }

  onRestrictedDateSelected(date: Date) {
    this.restrictedSelectedDate = date;
    console.log("Restricted calendar date selected:", date);
  }

  onInteractiveDateSelected(date: Date) {
    this.interactiveSelectedDate = date;
    this.addToEventLog(`Date selected: ${date.toLocaleDateString()}`);
  }

  onMonthChanged(event: { month: number; year: number }) {
    this.addToEventLog(`Month changed: ${event.month + 1}/${event.year}`);
  }

  updateInteractiveConfig() {
    this.interactiveConfigCopy = { ...this.interactiveConfig };
    this.addToEventLog("Configuration updated");
  }

  // Forms methods
  toggleReactiveDisabled() {
    if (this.reactiveFormControl.disabled) {
      this.reactiveFormControl.enable();
    } else {
      this.reactiveFormControl.disable();
    }
  }

  clearReactiveForm() {
    this.reactiveFormControl.setValue(null);
  }

  setTemplateToday() {
    this.templateFormDate = new Date();
  }

  clearTemplateForm() {
    this.templateFormDate = null;
  }

  // Global color theme method
  updateGlobalColorTheme() {
    // Update all calendar configs to use the new global color theme
    this.basicConfig = {
      ...this.basicConfig,
      colorTheme: this.globalColorTheme as any,
    };
    this.darkConfig = {
      ...this.darkConfig,
      colorTheme: this.globalColorTheme as any,
    };
    this.mondayConfig = {
      ...this.mondayConfig,
      colorTheme: this.globalColorTheme as any,
    };
    this.restrictedConfig = {
      ...this.restrictedConfig,
      colorTheme: this.globalColorTheme as any,
    };
    this.interactiveConfig = {
      ...this.interactiveConfig,
      colorTheme: this.globalColorTheme as any,
    };
    this.interactiveConfigCopy = { ...this.interactiveConfig };
    this.reactiveFormConfig = {
      ...this.reactiveFormConfig,
      colorTheme: this.globalColorTheme as any,
    };
    this.templateFormConfig = {
      ...this.templateFormConfig,
      colorTheme: this.globalColorTheme as any,
    };
  }

  private addToEventLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.eventLog.unshift(`[${timestamp}] ${message}`);

    // Keep only last 10 events
    if (this.eventLog.length > 10) {
      this.eventLog = this.eventLog.slice(0, 10);
    }
  }
}
