# Angular Inline Calendar

A lightweight, customizable inline calendar component for Angular applications.

## Project Structure

This repository contains:

- **Library**: `projects/nga-inline-calendar/` - The actual npm package
- **Demo App**: `src/` - Development demo application

## Features

- 🗓️ **Inline Calendar Display** - Clean, compact calendar that fits inline with your content
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

## Installation

```bash
npm install nga-inline-calendar
```

## Usage

### Standalone Component (Angular 14+)

```typescript
import { Component } from "@angular/core";
import { InlineCalendarComponent } from "nga-inline-calendar";

@Component({
  selector: "app-example",
  standalone: true,
  imports: [InlineCalendarComponent],
  template: `
    <nga-inline-calendar
      [selectedDate]="selectedDate"
      [config]="calendarConfig"
      (dateSelected)="onDateSelected($event)"
      (monthChanged)="onMonthChanged($event)"
    >
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

### Module-based Usage

```typescript
import { NgModule } from "@angular/core";
import { AngularInlineCalendarModule } from "nga-inline-calendar";

@NgModule({
  imports: [AngularInlineCalendarModule],
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

| Property       | Type             | Default                   | Description                     |
| -------------- | ---------------- | ------------------------- | ------------------------------- |
| `selectedDate` | `Date \| null`   | `null`                    | Currently selected date         |
| `config`       | `CalendarConfig` | `DEFAULT_CALENDAR_CONFIG` | Calendar configuration          |
| `initialMonth` | `number`         | Current month             | Initial month to display (0-11) |
| `initialYear`  | `number`         | Current year              | Initial year to display         |

## Output Events

| Event           | Type                              | Description                           |
| --------------- | --------------------------------- | ------------------------------------- |
| `dateSelected`  | `Date`                            | Emitted when a date is selected       |
| `monthChanged`  | `{ month: number; year: number }` | Emitted when month navigation occurs  |
| `calendarEvent` | `CalendarEvent`                   | Emitted for all calendar interactions |

## Examples

### Basic Usage

```html
<nga-inline-calendar></nga-inline-calendar>
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
<nga-inline-calendar [formControl]="dateControl"></nga-inline-calendar>
```

#### Template-driven Forms

```html
<nga-inline-calendar
  [(ngModel)]="selectedDate"
  name="calendarDate"
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

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## License

MIT License - see LICENSE file for details.

## Changelog

### v1.1.0

- ✨ **Color Theming System** - Added 8 beautiful color themes (blue, green, purple, red, orange, teal, pink, indigo)
- 🎨 **CSS Custom Properties** - Modern theming system using CSS variables
- 📝 **Forms Integration** - Full support for Angular Reactive and Template-driven forms
- 🎛️ **Today Button** - Added optional quick navigation to current date
- 🔧 **Enhanced Configuration** - New `colorTheme` and `showTodayButton` options
- 🌐 **Angular 18/19 Support** - Updated peer dependencies for latest Angular versions
- ♿ **Improved Accessibility** - Better focus management and ARIA compliance
- 🐛 **Dark Mode Fixes** - Fixed color theming in dark mode

### v1.0.0

- Initial release
- Basic inline calendar functionality
- Theme support (light/dark)
- Date restrictions
- Internationalization support
