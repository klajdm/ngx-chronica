---
applyTo: '**'
---

# NGX-Chronica Development Guidelines

This is a monorepo containing two main projects:

1. **NGX-Chronica Library** (`projects/chronica/`) - Angular date picker component library
2. **Documentation Website** (`src/`) - Angular 19 standalone application for demos and docs

## Project Overview

### Library Architecture (`projects/chronica/`)

- **Type**: Angular library (npm package)
- **Target**: Angular 15+ applications
- **Output**: Distributable npm package with standalone components
- **Purpose**: Lightweight, accessible date picker components

### Website Architecture (`src/`)

- **Type**: Angular 19 standalone application
- **Purpose**: Documentation, demos, and marketing site
- **Deployment**: Vercel hosting
- **Features**: Responsive design, component demos, interactive examples

## Core Development Principles

### 1. Angular 19 Best Practices

#### Standalone Components (Preferred)

```typescript
// ✅ Good - Standalone component
@Component({
  selector: 'chronica-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css',
})
export class DatepickerComponent implements OnInit, OnDestroy {
  // Component logic
}
```

#### Control Flow Syntax (Angular 17+)

```html
<!-- ✅ Good - New control flow -->
@if (showCalendar) {
<div class="calendar">
  @for (day of days; track day.id) {
  <button [class.selected]="day.selected">{{ day.label }}</button>
  }
</div>
}

<!-- ❌ Avoid - Legacy structural directives for new code -->
<div *ngIf="showCalendar" class="calendar">
  <button *ngFor="let day of days; trackBy: trackByDay">{{ day.label }}</button>
</div>
```

#### Signals (Angular 16+)

```typescript
// ✅ Good - Use signals for reactive state
export class DatepickerComponent {
  selectedDate = signal<Date | null>(null);
  isOpen = signal(false);

  // Computed values
  formattedDate = computed(() => {
    const date = this.selectedDate();
    return date ? this.formatDate(date) : 'Select date';
  });

  // Effects for side effects
  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.positionPopup();
      }
    });
  }
}
```

#### Dependency Injection with inject()

```typescript
// ✅ Good - Modern injection
export class DatepickerComponent {
  private cdr = inject(ChangeDetectorRef);
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);

  constructor() {
    // Constructor kept minimal
  }
}
```

### 2. TypeScript Excellence

#### Strict Type Safety

```typescript
// ✅ Good - Comprehensive typing
interface CalendarConfig {
  readonly locale: string;
  readonly theme: 'light' | 'dark' | 'auto';
  readonly colorTheme: ColorTheme;
  readonly firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  readonly minDate?: Date;
  readonly maxDate?: Date;
  readonly disabledDates?: readonly Date[];
}

type ColorTheme = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal' | 'pink' | 'indigo';

// ✅ Good - Generic constraints
interface DateRange<T extends Date = Date> {
  startDate: T | null;
  endDate: T | null;
}
```

#### Utility Types and Advanced Patterns

```typescript
// ✅ Good - Utility types for API consistency
export type CalendarEventType = 'dateSelected' | 'monthChanged' | 'yearChanged' | 'popupToggled';

export interface CalendarEvent<T = unknown> {
  type: CalendarEventType;
  payload: T;
  timestamp: number;
}

// ✅ Good - Branded types for domain safety
export type DateString = string & { readonly __brand: 'DateString' };
export type ISODateString = string & { readonly __brand: 'ISODateString' };

// ✅ Good - Template literal types
export type CSSColorValue = `#${string}` | `rgb(${string})` | `hsl(${string})`;
```

#### Error Handling Patterns

```typescript
// ✅ Good - Result pattern for error handling
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export class DateValidationService {
  validateDateRange(start: Date, end: Date): Result<DateRange, ValidationError> {
    if (start > end) {
      return {
        success: false,
        error: new ValidationError('Start date must be before end date'),
      };
    }

    return {
      success: true,
      data: { startDate: start, endDate: end },
    };
  }
}
```

### 3. Component Design Patterns

#### Input/Output Naming Conventions

```typescript
// ✅ Good - Clear, consistent naming
export class DatepickerComponent {
  // Inputs use present tense, descriptive names
  @Input() selectedDate: Date | null = null;
  @Input() config: CalendarConfig = DEFAULT_CONFIG;
  @Input() placeholder: string = 'Select date';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;

  // Outputs use past tense events
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() monthChanged = new EventEmitter<MonthChangeEvent>();
  @Output() calendarOpened = new EventEmitter<void>();
  @Output() calendarClosed = new EventEmitter<void>();
}
```

#### Accessibility First

```typescript
// ✅ Good - ARIA and keyboard support built-in
export class DatepickerComponent {
  @HostBinding('attr.role') role = 'application';
  @HostBinding('attr.aria-label') ariaLabel = 'Date picker';

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        this.togglePopup();
        event.preventDefault();
        break;
      case 'Escape':
        this.closePopup();
        break;
      case 'ArrowDown':
        this.navigateToNextWeek();
        event.preventDefault();
        break;
      // More keyboard navigation...
    }
  }
}
```

#### Performance Optimization

```typescript
// ✅ Good - OnPush + TrackBy + Lazy loading
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class CalendarGridComponent {
  @Input() days: readonly CalendarDay[] = [];

  trackByDay = (index: number, day: CalendarDay): string => day.id;

  // ✅ Good - Memoization for expensive operations
  private readonly dateFormatter = memoize((date: Date, locale: string) =>
    new Intl.DateTimeFormat(locale).format(date)
  );
}
```

### 4. CSS/Styling Standards

#### CSS Custom Properties for Theming

```css
/* ✅ Good - Systematic theming approach */
.chronica-datepicker {
  /* Core theme variables */
  --chronica-primary: var(--chronica-primary-500);
  --chronica-primary-50: #eff6ff;
  --chronica-primary-500: #3b82f6;
  --chronica-primary-600: #2563eb;
  --chronica-primary-900: #1e3a8a;

  /* Semantic color tokens */
  --chronica-text-primary: var(--chronica-gray-900);
  --chronica-text-secondary: var(--chronica-gray-600);
  --chronica-text-disabled: var(--chronica-gray-400);

  /* Component-specific tokens */
  --chronica-focus-ring: 0 0 0 3px var(--chronica-primary-100);
  --chronica-border-radius: 0.5rem;
  --chronica-transition: all 150ms ease;
}
```

#### Modern CSS Features

```css
/* ✅ Good - Container queries for responsive components */
.chronica-calendar {
  container-type: inline-size;
}

@container (max-width: 320px) {
  .chronica-date {
    font-size: 0.875rem;
    padding: 0.25rem;
  }
}

/* ✅ Good - Logical properties */
.chronica-popup {
  inset-inline-start: 0;
  margin-block-start: 0.5rem;
  padding-inline: 1rem;
  border-start-start-radius: var(--chronica-border-radius);
}

/* ✅ Good - Modern layout */
.chronica-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.125rem;
  place-items: center;
}
```

### 5. Testing Strategies

#### Component Testing

```typescript
// ✅ Good - Comprehensive component testing
describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerComponent], // Standalone component
      providers: [{ provide: DateService, useClass: MockDateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
  });

  describe('Date Selection', () => {
    it('should emit dateSelected when valid date is selected', fakeAsync(() => {
      // Arrange
      const selectedDate = new Date(2024, 0, 15);
      spyOn(component.dateSelected, 'emit');

      // Act
      component.selectDate(selectedDate);
      tick();

      // Assert
      expect(component.dateSelected.emit).toHaveBeenCalledWith(selectedDate);
      expect(component.selectedDate()).toBe(selectedDate);
    }));
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.detectChanges();
      const element = fixture.nativeElement;

      expect(element.getAttribute('role')).toBe('application');
      expect(element.getAttribute('aria-label')).toBeTruthy();
    });

    it('should handle keyboard navigation', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onKeyDown(event);

      expect(component.focusedDate()).toEqual(/* expected date */);
    });
  });
});
```

#### E2E Testing Patterns

```typescript
// ✅ Good - Page object model
export class DatepickerPageObject {
  constructor(private page: Page) {}

  async openDatepicker() {
    await this.page.click('[data-testid="datepicker-trigger"]');
    await this.page.waitForSelector('[data-testid="datepicker-popup"]');
  }

  async selectDate(date: number) {
    await this.page.click(`[data-testid="calendar-day-${date}"]`);
  }

  async getSelectedDate(): Promise<string> {
    return this.page.textContent('[data-testid="selected-date"]');
  }
}
```

### 6. Library-Specific Guidelines

#### Public API Design

```typescript
// ✅ Good - Clean, minimal public API
export interface PublicAPI {
  // Core components
  DatepickerComponent: typeof DatepickerComponent;
  DateRangeComponent: typeof DateRangeComponent;
  InlineCalendarComponent: typeof InlineCalendarComponent;

  // Configuration
  CalendarConfig: typeof CalendarConfig;
  DEFAULT_CONFIG: CalendarConfig;

  // Utilities (minimal)
  createCalendarConfig: (overrides?: Partial<CalendarConfig>) => CalendarConfig;
}

// ❌ Avoid - Exposing internal utilities
// Don't export: DateUtils, InternalCalendarService, etc.
```

#### Version Compatibility

```typescript
// ✅ Good - Angular version compatibility matrix
const ANGULAR_VERSION_SUPPORT = {
  '15.0.0': '1.0.0', // First supported version
  '16.0.0': '1.1.0', // Signals support
  '17.0.0': '1.2.0', // Control flow syntax
  '18.0.0': '1.3.0', // Material 3 design tokens
  '19.0.0': '1.4.0', // Latest features
} as const;
```

### 7. Documentation Website Guidelines

#### Route Structure

```typescript
// ✅ Good - Logical route hierarchy
const routes: Routes = [
  { path: '', redirectTo: '/getting-started', pathMatch: 'full' },
  { path: 'getting-started', component: GettingStartedComponent },
  {
    path: 'components',
    children: [
      { path: 'datepicker', component: DatepickerDocsComponent },
      { path: 'date-range', component: DateRangeDocsComponent },
      { path: 'inline-calendar', component: InlineCalendarDocsComponent },
    ],
  },
  {
    path: 'examples',
    children: [
      { path: 'basic', component: BasicExamplesComponent },
      { path: 'advanced', component: AdvancedExamplesComponent },
      { path: 'theming', component: ThemingExamplesComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
```

#### SEO and Performance

```typescript
// ✅ Good - Meta tags and structured data
@Component({
  template: `
    <h1>{{ pageTitle() }}</h1>
    <meta-tags
      [title]="pageTitle()"
      [description]="pageDescription()"
      [keywords]="pageKeywords()"
    />
  `,
})
export class DocsPageComponent {
  pageTitle = signal('Angular Date Picker Component | NGX-Chronica');
  pageDescription = signal('Lightweight, accessible Angular date picker...');

  constructor() {
    // ✅ Good - Preload critical routes
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.preloadCriticalRoutes();
      });
  }
}
```

### 8. Build and Deployment

#### Library Build Configuration

```json
{
  "projects": {
    "chronica": {
      "projectType": "library",
      "root": "projects/chronica",
      "sourceRoot": "projects/chronica/src",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          "options": {
            "project": "projects/chronica/ng-package.json"
          }
        }
      }
    }
  }
}
```

#### Package.json Best Practices

```json
{
  "name": "ngx-chronica",
  "version": "1.0.1",
  "peerDependencies": {
    "@angular/common": ">=15.0.0",
    "@angular/core": ">=15.0.0"
  },
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "esm2022": "./esm2022/ngx-chronica.mjs",
      "esm": "./esm2022/ngx-chronica.mjs",
      "default": "./bundles/ngx-chronica.umd.js"
    }
  },
  "sideEffects": false
}
```

### 9. Code Quality Standards

#### ESLint Configuration

```json
{
  "extends": [
    "@angular-eslint/recommended",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@angular-eslint/component-class-suffix": "error",
    "@angular-eslint/directive-class-suffix": "error"
  }
}
```

#### Commit Conventions

```
feat(datepicker): add keyboard navigation support
fix(date-range): resolve timezone calculation bug
docs(getting-started): update installation instructions
test(calendar): add comprehensive accessibility tests
perf(popup): optimize positioning calculations
style(components): apply consistent spacing tokens
refactor(core): extract date utilities to separate service
ci(github): add automated dependency updates
```

### 10. Security Considerations

#### Input Sanitization

```typescript
// ✅ Good - Always sanitize and validate inputs
export class DatepickerComponent {
  @Input()
  set selectedDate(value: Date | string | null) {
    this._selectedDate.set(this.sanitizeDate(value));
  }

  private sanitizeDate(value: Date | string | null): Date | null {
    if (!value) return null;

    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      console.warn('Invalid date provided to datepicker');
      return null;
    }

    return date;
  }
}
```

#### Content Security Policy

```typescript
// ✅ Good - CSP-compatible inline styles
export class DatepickerComponent {
  // Avoid inline styles, use CSS classes
  @HostBinding('class') hostClass = 'chronica-datepicker';

  // Use Renderer2 for dynamic styles
  private updateTheme(theme: ColorTheme): void {
    this.renderer.addClass(this.elementRef.nativeElement, `chronica-theme-${theme}`);
  }
}
```

## File Organization

```
ngx-chronica/
├── projects/chronica/          # Library source
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/     # Standalone components
│   │   │   ├── models/         # TypeScript interfaces
│   │   │   ├── services/       # Injectable services
│   │   │   └── utils/          # Pure utility functions
│   │   └── public-api.ts       # Public API exports
│   ├── README.md               # Library documentation
│   └── package.json            # Library package config
├── src/                        # Documentation website
│   ├── app/
│   │   ├── components/         # Website components
│   │   ├── features/           # Feature modules
│   │   │   ├── examples/       # Interactive examples
│   │   │   ├── docs/           # Documentation pages
│   │   │   └── getting-started/
│   │   └── shared/             # Shared utilities
│   └── assets/                 # Static assets
├── .github/
│   ├── workflows/              # CI/CD pipelines
│   └── instructions/           # AI assistant guidelines
└── docs/                       # Additional documentation
```

## Common Patterns to Follow

1. **Prefer composition over inheritance**
2. **Use TypeScript strict mode**
3. **Implement comprehensive error boundaries**
4. **Follow reactive programming patterns**
5. **Maintain backward compatibility**
6. **Write self-documenting code**
7. **Optimize for tree-shaking**
8. **Design for accessibility first**
9. **Use semantic versioning strictly**
10. **Maintain comprehensive test coverage (>90%)**

Always consider the developer experience, performance implications, and long-term maintainability when making architectural decisions.
