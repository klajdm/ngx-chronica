<div align="center">
   <img src="./assets/logo.png" alt="ngx-chronica logo" width="120" height="120" />
   <h1>🗓️ NGX-Chronica</h1>
   <p><strong>Complete Date & Time Picker Suite for Angular</strong></p>
   
  <p>
    <a href="https://www.npmjs.com/package/ngx-chronica"><img src="https://img.shields.io/npm/v/ngx-chronica.svg" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/ngx-chronica"><img src="https://img.shields.io/npm/dm/ngx-chronica.svg" alt="npm downloads"></a>
    <a href="https://github.com/klajdm/ngx-chronica/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/ngx-chronica.svg" alt="license"></a>
    <a href="https://angular.io"><img src="https://img.shields.io/badge/Angular-15%2B-red.svg" alt="Angular 15+"></a>
  </p>
  <p>
    <a href="https://ngx-chronica.vercel.app">📚 Documentation</a> •
    <a href="https://ngx-chronica.vercel.app/start">🚀 Quick Start</a> •
    <a href="https://github.com/klajdm/ngx-chronica">💻 GitHub</a>
  </p>
</div>

---

A comprehensive, lightweight Angular library providing **6 specialized date and time picker components** with excellent TypeScript support, internationalization, and seamless form integration.

## ✨ Why NGX-Chronica?

The Angular ecosystem lacks robust, production-ready **Date & Time Picker** components. NGX-Chronica fills these critical gaps with a complete suite of date/time components that are:

- ✅ **Production-Ready** - Battle-tested components with comprehensive validation
- ✅ **Zero Dependencies** - No Moment.js or other heavy libraries
- ✅ **Fully Typed** - Complete TypeScript definitions for excellent IDE support
- ✅ **Accessible** - WCAG compliant with keyboard navigation and ARIA support
- ✅ **Themeable** - 8 color themes + light/dark mode out of the box

## 📦 Components

| Component          | Description                      | Use Case                            |
| ------------------ | -------------------------------- | ----------------------------------- |
| **DatePicker**     | Single date selection with popup | Forms, filters, date inputs         |
| **DateRange**      | Start/end date selection         | Booking systems, reports, analytics |
| **InlineCalendar** | Always-visible calendar          | Dashboards, embedded calendars      |
| **TimePicker**     | Time selection (12h/24h)         | Appointments, schedules             |
| **DateTimePicker** | Combined date + time             | Event scheduling, timestamps        |
| **DurationPicker** | Time span selection              | Task estimation, timers             |

## 🎯 Key Features

- 🗓️ **6 Specialized Components** - Complete date/time selection toolkit
- 🎨 **8 Color Themes** - Blue, Green, Purple, Red, Orange, Teal, Pink, Indigo
- 🌍 **11 Built-in Locales** - EN, ES, FR, DE, IT, PT, ZH, JA, KO, RU + custom locales
- 📱 **Responsive Design** - Mobile-friendly with touch support
- 🚫 **Smart Validation** - Min/max dates, disabled dates, time restrictions
- 📝 **Form Integration** - Full `ControlValueAccessor` support
- ⚡ **Standalone Components** - Works with standalone or NgModule apps
- ♿ **Accessibility** - Keyboard navigation, ARIA labels, screen reader support
- 🎯 **TypeScript First** - Comprehensive type definitions included
- 🎨 **Customizable** - CSS custom properties for easy theming

## 📥 Installation

```bash
npm install ngx-chronica
```

## 🚀 Quick Start

### 1️⃣ DatePicker - Single Date Selection

```typescript
import { Component } from '@angular/core';
import { ChronicaDatepickerComponent } from 'ngx-chronica';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ChronicaDatepickerComponent],
  template: `
    <chronica-datepicker
      [(ngModel)]="selectedDate"
      [config]="{ colorTheme: 'blue', theme: 'light' }"
      (dateSelected)="onDateSelected($event)"
    />
  `,
})
export class ExampleComponent {
  selectedDate: Date | null = new Date();

  onDateSelected(date: Date) {
    console.log('Selected:', date);
  }
}
```

### 2️⃣ TimePicker - Time Selection

```typescript
import { ChronicaTimePickerComponent } from 'ngx-chronica';

@Component({
  template: `
    <chronica-time-picker
      [(ngModel)]="selectedTime"
      [config]="{ format24Hour: false, showSeconds: true }"
    />
  `,
})
export class TimeExample {
  selectedTime = { hours: 14, minutes: 30, seconds: 0 };
}
```

### 3️⃣ DateTimePicker - Date + Time

```typescript
import { ChronicaDateTimePickerComponent } from 'ngx-chronica';

@Component({
  template: `
    <chronica-datetime-picker [(ngModel)]="dateTime" [config]="{ colorTheme: 'purple' }" />
  `,
})
export class DateTimeExample {
  dateTime = { date: new Date(), time: { hours: 14, minutes: 30 } };
}
```

### 4️⃣ DateRange - Range Selection

```typescript
import { ChronicaDateRangeComponent } from 'ngx-chronica';

@Component({
  template: `
    <chronica-date-range [(ngModel)]="dateRange" (dateRangeChange)="onRangeChange($event)" />
  `,
})
export class RangeExample {
  dateRange = { startDate: new Date(), endDate: null };
}
```

### 5️⃣ DurationPicker - Time Spans

```typescript
import { ChronicaDurationPickerComponent } from 'ngx-chronica';

@Component({
  template: `
    <chronica-duration-picker
      [(ngModel)]="duration"
      [config]="{ showDays: true, showHours: true, showMinutes: true }"
    />
  `,
})
export class DurationExample {
  duration = { hours: 2, minutes: 30 };
}
```

### 6️⃣ InlineCalendar - Always Visible

```typescript
import { ChronicaInlineCalendarComponent } from 'ngx-chronica';

@Component({
  template: `
    <chronica-inline-calendar [(ngModel)]="selectedDate" [config]="{ colorTheme: 'teal' }" />
  `,
})
export class InlineExample {
  selectedDate: Date | null = new Date();
}
```

## ⚙️ Configuration

### Calendar Config

```typescript
interface ChronicaCalendarConfig {
  theme?: 'light' | 'dark' | 'auto';
  colorTheme?: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal' | 'pink' | 'indigo';
  locale?: ChronicaLocale | string; // 'en-US', 'es-ES', 'fr-FR', etc.
  firstDayOfWeek?: number; // 0 = Sunday, 1 = Monday
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  showTodayButton?: boolean;
  showNavigation?: boolean;
  showYearSelector?: boolean;
  showMonthSelector?: boolean;
}
```

### Time Config

```typescript
interface ChronicaTimeConfig {
  timeFormat?: '12h' | '24h';
  showSeconds?: boolean;
  minuteStep?: number; // e.g., 15 for 15-minute intervals
  secondStep?: number;
  minTime?: ChronicaTimeValue;
  maxTime?: ChronicaTimeValue;
  showNowButton?: boolean;
}
```

### DateTime Config

```typescript
interface ChronicaDateTimeConfig {
  calendarConfig?: Partial<ChronicaCalendarConfig>;
  timeConfig?: Partial<ChronicaTimeConfig>;
  layout?: 'inline' | 'popup' | 'tabs' | 'compact';
  requireBoth?: boolean; // Both date and time required
  allowClear?: boolean;
}
```

### Duration Config

```typescript
interface DurationPickerConfig {
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  stepDays?: number;
  stepHours?: number;
  stepMinutes?: number;
  stepSeconds?: number;
  minDuration?: ChronicaDurationValue;
  maxDuration?: ChronicaDurationValue;
  allowZero?: boolean;
}
```

## 🌍 Internationalization

NGX-Chronica includes **11 built-in locales**:

```typescript
// Built-in locales
'en-US' | 'en-GB' | 'es-ES' | 'fr-FR' | 'de-DE' | 'it-IT' |
'pt-BR' | 'zh-CN' | 'ja-JP' | 'ko-KR' | 'ru-RU'

// Usage
<chronica-datepicker
  [locale]="'es-ES'"
  [config]="{ firstDayOfWeek: 1 }"
/>

// Custom locale
const customLocale: ChronicaLocale = {
  monthNames: ['Enero', 'Febrero', ...],
  dayNames: ['Domingo', 'Lunes', ...],
  dayNamesShort: ['Dom', 'Lun', ...],
  todayLabel: 'Hoy',
  weekStartsOn: 1,
  dateFormat: 'dd/MM/yyyy'
};
```

## 💡 Common Use Cases

### Date Restrictions

```typescript
// Restrict to current year only
const config = {
  minDate: new Date(2025, 0, 1),
  maxDate: new Date(2025, 11, 31),
  disabledDates: [
    new Date(2025, 11, 25), // Christmas
    new Date(2025, 0, 1), // New Year
  ],
};
```

### Business Hours Time Picker

```typescript
// 9 AM to 5 PM, 15-minute intervals
const timeConfig = {
  minTime: { hours: 9, minutes: 0 },
  maxTime: { hours: 17, minutes: 0 },
  minuteStep: 15,
  timeFormat: '12h' as const,
};
```

### Booking System Duration

```typescript
// 30-minute to 8-hour appointments
const durationConfig = {
  showHours: true,
  showMinutes: true,
  stepMinutes: 30,
  minDuration: { hours: 0, minutes: 30 },
  maxDuration: { hours: 8, minutes: 0 },
};
```

### Weekend Blocker

```typescript
// Disable all weekends
const weekends = [];
const start = new Date(2025, 0, 1);
const end = new Date(2025, 11, 31);

for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  if (d.getDay() === 0 || d.getDay() === 6) {
    weekends.push(new Date(d));
  }
}

const config = { disabledDates: weekends };
```

## 📝 Forms Integration

All components implement `ControlValueAccessor` for seamless form integration.

### Reactive Forms

```typescript
import { FormBuilder, Validators } from '@angular/forms';

export class BookingForm {
  fb = inject(FormBuilder);

  bookingForm = this.fb.group({
    checkIn: [new Date(), Validators.required],
    checkOut: [null, Validators.required],
    appointmentTime: [{ hours: 9, minutes: 0 }],
    duration: [{ hours: 1, minutes: 0 }],
  });
}
```

```html
<form [formGroup]="bookingForm">
  <chronica-datepicker formControlName="checkIn" />
  <chronica-datepicker formControlName="checkOut" />
  <chronica-time-picker formControlName="appointmentTime" />
  <chronica-duration-picker formControlName="duration" />
</form>
```

### Template-driven Forms

```html
<form #f="ngForm">
  <chronica-datepicker [(ngModel)]="selectedDate" name="date" required />
  <chronica-time-picker [(ngModel)]="selectedTime" name="time" />
</form>
```

## 🎨 Theming & Styling

### Color Themes

8 beautiful pre-built themes:

| Theme    | Primary | Best For              |
| -------- | ------- | --------------------- |
| `blue`   | #3b82f6 | Professional, default |
| `green`  | #10b981 | Success, eco-friendly |
| `purple` | #8b5cf6 | Creative, modern      |
| `red`    | #ef4444 | Urgent, important     |
| `orange` | #f97316 | Energetic, warm       |
| `teal`   | #14b8a6 | Calm, medical         |
| `pink`   | #ec4899 | Playful, feminine     |
| `indigo` | #6366f1 | Tech, corporate       |

### Custom Styling

Override CSS custom properties:

```css
chronica-datepicker {
  --chronica-primary: #your-color;
  --chronica-primary-hover: #your-hover-color;
  --chronica-border-radius: 8px;
  --chronica-font-family: 'Your Font', sans-serif;
}
```

### Dark Mode

```typescript
// Auto-detect system preference
config = { theme: 'auto' };

// Force dark mode
config = { theme: 'dark' };

// Force light mode
config = { theme: 'light' };
```

## 🔧 Module Usage (Optional)

For non-standalone apps, import the module:

```typescript
import { NgModule } from '@angular/core';
import { ChronicaModule } from 'ngx-chronica';

@NgModule({
  imports: [ChronicaModule],
  // ...
})
export class AppModule {}
```

## ⚡ Angular Compatibility

| Angular Version | NGX-Chronica Version |
| --------------- | -------------------- |
| 15.x            | ✅ Supported         |
| 16.x            | ✅ Supported         |
| 17.x            | ✅ Supported         |
| 18.x            | ✅ Supported         |
| 19.x            | ✅ Supported         |

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](https://github.com/klajdm/ngx-chronica/blob/main/CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](https://github.com/klajdm/ngx-chronica/blob/main/LICENSE) file for details.

## 🔗 Links

- 📚 [Full Documentation](https://ngx-chronica.vercel.app)
- 🐛 [Report Issues](https://github.com/klajdm/ngx-chronica/issues)
- 💬 [Discussions](https://github.com/klajdm/ngx-chronica/discussions)
- 📦 [npm Package](https://www.npmjs.com/package/ngx-chronica)

## ⭐ Show Your Support

If you find NGX-Chronica useful, please consider giving it a star on [GitHub](https://github.com/klajdm/ngx-chronica)!

---

<div align="center">
  <p>Made with ❤️ for the Angular community</p>
  <p>
    <a href="https://ngx-chronica.vercel.app">Documentation</a> •
    <a href="https://github.com/klajdm/ngx-chronica">GitHub</a> •
    <a href="https://www.npmjs.com/package/ngx-chronica">npm</a>
  </p>
</div>
