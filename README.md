
# ngx-chronica

A monorepo for a lightweight, customizable inline calendar and datepicker component for Angular, plus a documentation/demo website.

## Demo

🚀 **[View Live Demo](https://ngx-chronica.vercel.app/)**

## Features

- 🗓️ **Dual Display Modes**: Popup or always-visible inline calendar
- 🎨 **Customizable Themes**: Light, dark, and 8 color schemes
- � **Internationalization**: Locale and first day of week
- 🚫 **Date Restrictions**: Min/max, disabled, and highlighted dates
- � **Forms Integration**: Reactive and template-driven forms
- ⚡ **Standalone & Module Support**: Use as standalone or in NgModule
- ♿ **Accessibility**: ARIA and keyboard navigation
- 💅 **Prettier Formatting**: Auto-format on save with Prettier
- 🧩 **Sidebar Navigation**: Modern docs website with sidebar menu


## Quick Start

Install the library:

```bash
npm install ngx-chronica
```

### Usage in Your Angular App

**Popup Mode (default):**

```typescript
import { Component } from '@angular/core';
import { InlineCalendarComponent } from 'nga-inline-calendar';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [InlineCalendarComponent],
  template: `
    <chronica-datepicker
      [selectedDate]="selectedDate"
      [config]="calendarConfig"
      (dateSelected)="onDateSelected($event)"
      (monthChanged)="onMonthChanged($event)"
    >
      <div class="date-trigger">
        <span class="date-display">
          {{ selectedDate ? (selectedDate | date : 'EEEE, MMMM d, y') : 'Select a date' }}
        </span>
      </div>
    </chronica-datepicker>
  `,
})
export class ExampleComponent {
  selectedDate: Date | null = new Date();
  calendarConfig = {
    theme: 'light',
    colorTheme: 'blue',
    firstDayOfWeek: 1,
    showAdjacentMonths: true,
    showTodayButton: true,
  };
  onDateSelected(date: Date) { this.selectedDate = date; }
  onMonthChanged(event: { month: number; year: number }) { /* ... */ }
}
```

**Inline Mode:**

```typescript
@Component({
  template: `
    <chronica-datepicker
      [selectedDate]="selectedDate"
      [config]="calendarConfig"
      [displayMode]="'inline'"
      (dateSelected)="onDateSelected($event)"
    ></chronica-datepicker>
  `,
})
export class InlineExampleComponent {
  selectedDate: Date | null = new Date();
  calendarConfig = { theme: 'light' };
  onDateSelected(date: Date) { this.selectedDate = date; }
}
```

**Module-based Usage:**

```typescript
import { NgModule } from '@angular/core';
import { InlineCalendarModule } from 'nga-inline-calendar';

@NgModule({
  imports: [InlineCalendarModule],
})
export class AppModule {}
```

## Usage

### Display Modes

The calendar supports two display modes:

- **Popup Mode** (default): Calendar appears in a popup when trigger is clicked
- **Inline Mode**: Calendar is always visible inline with your content

### Popup Mode (Default)

```typescript
import { Component } from "@angular/core";
import { InlineCalendarComponent } from "nga-inline-calendar";

@Component({
  selector: "app-example",
  standalone: true,
  imports: [InlineCalendarComponent],
  template: `
    <!-- Popup with custom trigger -->
    <chronica-datepicker
      [selectedDate]="selectedDate"
      [config]="calendarConfig"
      (dateSelected)="onDateSelected($event)"
      (monthChanged)="onMonthChanged($event)"
    >
      <div class="date-trigger">
        <span class="date-display">
          {{
            selectedDate
              ? (selectedDate | date : "EEEE, MMMM d, y")
              : "Select a date"
          }}
        </span>
        <svg
          class="calendar-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>
    </chronica-datepicker>
  `,
})
export class ExampleComponent {
  selectedDate: Date | null = new Date();

  calendarConfig = {
    theme: "light",
    colorTheme: "blue", // Available: blue, green, purple, red, orange, teal, pink, indigo
    firstDayOfWeek: 1, // Monday
    showAdjacentMonths: true,
    showTodayButton: true,
  };

  onDateSelected(date: Date) {
    console.log("Selected date:", date);
    this.selectedDate = date;
  }

  onMonthChanged(event: { month: number; year: number }) {
    console.log("Month changed:", event);
  }
}
```

### Inline Mode

```typescript
@Component({
  template: `
    <!-- Always visible inline calendar -->
    <chronica-datepicker
      [selectedDate]="selectedDate"
      [config]="calendarConfig"
      [displayMode]="'inline'"
      (dateSelected)="onDateSelected($event)"
    >
    </chronica-datepicker>
  `,
})
export class InlineExampleComponent {
  // Same component logic as above
}
```

### Module-based Usage

```typescript
import { NgModule } from "@angular/core";
import { InlineCalendarModule } from "nga-inline-calendar";

@NgModule({
  imports: [InlineCalendarModule],
  // ... other module configuration
})
export class AppModule {}
```


## Configuration Options

The calendar accepts a `config` object with these options:

```typescript
interface CalendarConfig {
  locale?: string; // Default: 'en-US'
  firstDayOfWeek?: number; // 0 = Sunday, 1 = Monday, etc. Default: 0
  showWeekNumbers?: boolean; // Default: false
  showAdjacentMonths?: boolean; // Default: true
  showTodayButton?: boolean; // Show/hide Today button. Default: true
  minDate?: Date; // Minimum selectable date
  maxDate?: Date; // Maximum selectable date
  disabledDates?: Date[]; // Array of disabled dates
  highlightedDates?: Date[]; // Array of highlighted dates
  theme?: 'light' | 'dark' | 'auto'; // Default: 'light'
  colorTheme?: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal' | 'pink' | 'indigo';
}
```

## Input Properties

| Property       | Type                  | Default                   | Description                     |
| -------------- | --------------------- | ------------------------- | ------------------------------- |
| `selectedDate` | `Date \| null`        | `null`                    | Currently selected date         |
| `config`       | `CalendarConfig`      | `DEFAULT_CALENDAR_CONFIG` | Calendar configuration          |
| `displayMode`  | `'popup' \| 'inline'` | `'popup'`                 | Display mode of the calendar    |
| `initialMonth` | `number`              | Current month             | Initial month to display (0-11) |
| `initialYear`  | `number`              | Current year              | Initial year to display         |

## Output Events

| Event           | Type                              | Description                           |
| --------------- | --------------------------------- | ------------------------------------- |
| `dateSelected`  | `Date`                            | Emitted when a date is selected       |
| `monthChanged`  | `{ month: number; year: number }` | Emitted when month navigation occurs  |
| `calendarEvent` | `CalendarEvent`                   | Emitted for all calendar interactions |

## Examples

### Basic Popup Usage

```html
<!-- Simple popup with default trigger -->
<chronica-datepicker></chronica-datepicker>
```

### Custom Popup Trigger

```html
<chronica-datepicker
  [selectedDate]="date"
  (dateSelected)="onDateSelected($event)"
>
  <button class="custom-trigger">
    📅 {{ date ? (date | date : 'shortDate') : 'Pick a date' }}
  </button>
</chronica-datepicker>
```

### Basic Inline Usage

```html
<chronica-datepicker [displayMode]="'inline'"></chronica-datepicker>
```

### With Date Restrictions

```typescript
calendarConfig = {
  minDate: new Date(2024, 0, 1), // January 1, 2024
  maxDate: new Date(2024, 11, 31), // December 31, 2024
  disabledDates: [
    new Date(2024, 11, 25), // Christmas
    new Date(2024, 0, 1), // New Year
  ],
};
```

### Dark Theme

```typescript
calendarConfig = {
  theme: "dark",
};
```

### Color Themes

```typescript
// Available color themes: blue, green, purple, red, orange, teal, pink, indigo
calendarConfig = {
  colorTheme: "purple",
};
```

### Forms Integration

#### Reactive Forms

```typescript
import { FormControl } from "@angular/forms";

export class MyComponent {
  dateControl = new FormControl<Date | null>(new Date());
}
```

```html
<!-- Popup mode -->
<chronica-datepicker [formControl]="dateControl">
  <input
    type="text"
    [value]="dateControl.value | date : 'shortDate'"
    placeholder="Select date"
    readonly
  />
</chronica-datepicker>

<!-- Inline mode -->
<chronica-datepicker
  [formControl]="dateControl"
  [displayMode]="'inline'"
></chronica-datepicker>
```

#### Template-driven Forms

```html
<!-- Popup mode -->
<chronica-datepicker [(ngModel)]="selectedDate" name="calendarDate">
  <div class="form-field">
    <label>Birth Date:</label>
    <span class="date-value">
      {{ selectedDate ? (selectedDate | date : 'mediumDate') : 'Not selected' }}
    </span>
  </div>
</chronica-datepicker>

<!-- Inline mode -->
<chronica-datepicker
  [(ngModel)]="selectedDate"
  name="calendarDate"
  [displayMode]="'inline'"
></chronica-datepicker>
```

### Monday as First Day of Week

```typescript
calendarConfig = {
  firstDayOfWeek: 1, // Monday
};
```


## Styling

The component uses built-in CSS custom properties for theming. You can override theme variables as needed:

```css
chronica-datepicker {
  --nga-primary: #3b82f6;
  --nga-primary-hover: #2563eb;
  --nga-primary-light: #dbeafe;
  --nga-primary-dark: #1d4ed8;
  --nga-accent: #60a5fa;
  --nga-focus: rgba(59, 130, 246, 0.2);
}
```

For popup mode, style the trigger as you like:

```css
.date-trigger {
  @apply flex items-center gap-2 px-3 py-2 border border-gray-300 rounded bg-white cursor-pointer transition-colors;
}
.date-trigger:hover {
  border-color: var(--nga-primary);
}
.calendar-icon {
  color: #6b7280;
}
```

### Available Color Themes

The component includes 8 predefined color themes:

| Theme    | Primary Color | Description         |
| -------- | ------------- | ------------------- |
| `blue`   | #3b82f6       | Default blue theme  |
| `green`  | #10b981       | Emerald green theme |
| `purple` | #8b5cf6       | Violet purple theme |
| `red`    | #ef4444       | Bright red theme    |
| `orange` | #f97316       | Orange theme        |
| `teal`   | #14b8a6       | Teal theme          |
| `pink`   | #ec4899       | Pink theme          |
| `indigo` | #6366f1       | Indigo theme        |

Each theme includes coordinated colors for primary, hover, accent, and focus states.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Angular Version Compatibility

- Angular 15+
- Angular 16+
- Angular 17+
- Angular 18+
- Angular 19+
- Angular 20+

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.


## License

MIT License – see [LICENSE](./LICENSE) file for details.
