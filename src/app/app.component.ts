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
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  // Basic calendar
  basicSelectedDate: Date | null = new Date();
  basicConfig: CalendarConfig = {
    colorTheme: "blue",
  };

  // Inline calendar
  inlineSelectedDate: Date | null = null;
  inlineConfig: CalendarConfig = {
    colorTheme: "blue",
  };

  // Dark theme calendar
  darkSelectedDate: Date | null = null;
  darkConfig: CalendarConfig = {
    theme: "dark",
    colorTheme: "blue",
  };

  // Restricted calendar
  restrictedSelectedDate: Date | null = null;
  restrictedConfig: CalendarConfig = {
    minDate: new Date(2024, 0, 1), // January 1, 2024
    maxDate: new Date(2024, 11, 31), // December 31, 2024
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

  onInlineeDateSelected(date: Date) {
    this.inlineSelectedDate = date;
    console.log("Inline calendar date selected:", date);
  }

  onDarkDateSelected(date: Date) {
    this.darkSelectedDate = date;
    console.log("Dark theme calendar date selected:", date);
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
    this.inlineConfig = {
      ...this.inlineConfig,
      colorTheme: this.globalColorTheme as any,
    };
    this.darkConfig = {
      ...this.darkConfig,
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
