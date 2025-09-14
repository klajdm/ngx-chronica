# Angular Inline Calendar

A lightweight, customizable inline calendar component for Angular applications.

## Demo

🚀 **[View Live Demo](https://nga-inline-calendar.vercel.app/)**

## Features

- 🗓️ **Dual Display Modes** - Popup mode with custom triggers or always-visible inline display
- 🎨 **Customizable Themes** - Light, dark, and auto themes with 8 beautiful color schemes
- 🌈 **Color Theming** - Blue, Green, Purple, Red, Orange, Teal, Pink, and Indigo color themes
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🌍 **Internationalization** - Configurable locale and first day of week
- 🚫 **Date Restrictions** - Min/max dates and disabled date ranges
- 📝 **Forms Integration** - Full support for Angular Reactive and Template-driven forms
- ⚡ **Standalone Component** - Works with both standalone and module-based Angular apps
- 🎯 **TypeScript Support** - Full TypeScript definitions included
- ♿ **Accessibility** - ARIA compliant and keyboard navigable
- 🎛️ **Today Button** - Optional quick navigation to current date
- 🎨 **Custom Triggers** - Style popup triggers however you want with full content projection

## Installation

```bash
npm install nga-inline-calendar
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
    <nga-inline-calendar
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
    </nga-inline-calendar>
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
    <nga-inline-calendar
      [selectedDate]="selectedDate"
      [config]="calendarConfig"
      [displayMode]="'inline'"
      (dateSelected)="onDateSelected($event)"
    >
    </nga-inline-calendar>
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

The calendar accepts a `config` object with the following properties:

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
  theme?: "light" | "dark" | "auto"; // Default: 'light'
  colorTheme?:
    | "blue"
    | "green"
    | "purple"
    | "red"
    | "orange"
    | "teal"
    | "pink"
    | "indigo"; // Default: 'blue'
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
<nga-inline-calendar></nga-inline-calendar>
```

### Custom Popup Trigger

```html
<nga-inline-calendar
  [selectedDate]="date"
  (dateSelected)="onDateSelected($event)"
>
  <button class="custom-trigger">
    📅 {{ date ? (date | date : 'shortDate') : 'Pick a date' }}
  </button>
</nga-inline-calendar>
```

### Basic Inline Usage

```html
<nga-inline-calendar [displayMode]="'inline'"></nga-inline-calendar>
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
<nga-inline-calendar [formControl]="dateControl">
  <input
    type="text"
    [value]="dateControl.value | date : 'shortDate'"
    placeholder="Select date"
    readonly
  />
</nga-inline-calendar>

<!-- Inline mode -->
<nga-inline-calendar
  [formControl]="dateControl"
  [displayMode]="'inline'"
></nga-inline-calendar>
```

#### Template-driven Forms

```html
<!-- Popup mode -->
<nga-inline-calendar [(ngModel)]="selectedDate" name="calendarDate">
  <div class="form-field">
    <label>Birth Date:</label>
    <span class="date-value">
      {{ selectedDate ? (selectedDate | date : 'mediumDate') : 'Not selected' }}
    </span>
  </div>
</nga-inline-calendar>

<!-- Inline mode -->
<nga-inline-calendar
  [(ngModel)]="selectedDate"
  name="calendarDate"
  [displayMode]="'inline'"
></nga-inline-calendar>
```

### Monday as First Day of Week

```typescript
calendarConfig = {
  firstDayOfWeek: 1, // Monday
};
```

## Styling

The component comes with built-in CSS that uses CSS custom properties for theming. The color theme is automatically applied, but you can override specific colors if needed:

```css
nga-inline-calendar {
  /* Color theme variables (automatically set by colorTheme config) */
  --nga-primary: #3b82f6;
  --nga-primary-hover: #2563eb;
  --nga-primary-light: #dbeafe;
  --nga-primary-dark: #1d4ed8;
  --nga-accent: #60a5fa;
  --nga-focus: rgba(59, 130, 246, 0.2);
}
```

### Custom Trigger Styling

For popup mode, you can style the trigger content however you like:

```css
.date-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
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

MIT License - see LICENSE file for details.
