# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-04-28

### Added

- **DateTimePicker**: `layout: 'tabs'` mode renders a tab strip (Date / Time) with `role="tablist"` / `role="tabpanel"` ARIA semantics
- **DateTimePicker**: `showSeparateInputs: true` config option renders side-by-side date and time trigger buttons
- **DateTimePicker**: `requireBoth` config option - when `false`, the form value is emitted even when only date or time is set (default remains `true`)
- **InlineCalendar**: multi-view navigation - clicking the month/year header cycles through Month → Months (12-month grid) → Year (decade grid)
- **InlineCalendar**: `isPreviousMonthDisabled()` / `isNextMonthDisabled()` - navigation arrows are now disabled when `minDate`/`maxDate` would be exceeded
- **DatePicker / DateTimePicker**: `popupPosition: 'top' | 'bottom' | 'auto'` input is now fully implemented via `getPositions()` helper
- **CalendarUtils**: `generateDecadeGrid(centerYear)` static method for decade-view year grids
- Colorblind-safe weekend indicator: small dot rendered below weekend date numbers via `::after` pseudo-element
- `:focus-visible` outline styles and `:focus:not(:focus-visible) { outline: none }` across all components (mouse clicks no longer show focus rings)
- `prefers-reduced-motion` support - `--chronica-transition`, `--chronica-transition-fast`, `--chronica-transition-slow` all set to `none` when user requests reduced motion
- `prefers-contrast: more` high-contrast variable overrides in both light and dark themes

### Fixed

- **DateRange**: `selectThisWeek()` now respects `config.firstDayOfWeek` (was hardcoded to Sunday)
- **DateRange**: `isInRange()` now uses `>=` / `<=` so start and end dates are included in the range highlight
- **DateTimePicker**: `initializeComponent()` no longer resets value to current date/time on every config change
- **DateTimePicker**: `formatDate()` now uses `locale.dateFormat` string replacement instead of `Intl.DateTimeFormat` (aligns with DatePicker and DateRange)
- **CalendarUtils**: `getDayNames()` no longer mutates the source array (`splice` replaced with immutable `slice`)
- **CalendarUtils**: `createCalendarDate()` now caches `stripTime(date)` to avoid three redundant calls
- **CalendarUtils**: removed duplicate `isSameDay` static method (was identical to `isSameDate`); `isToday` updated to call `isSameDate`
- **CalendarUtils**: removed duplicate instance `formatDate(date, locale: string)` method
- **TimePicker**: `resetToCurrentTime()` now clamps to `minTime`/`maxTime` constraints
- **TimePicker**: `formattedTime` getter now delegates to `ChronicaTimeUtils.formatTime()` instead of duplicating the formatting logic
- **DurationPicker**: `DurationPickerConfig` now extends `ChronicaBaseConfig` instead of `ChronicaCalendarConfig` (removed irrelevant `minDate`, `maxDate`, `disabledDates`)
- **chronica.module.ts**: removed circular import via `../public-api`; now imports `ChronicaDateTimePickerComponent` directly from its component file
- **All popup components**: `backdropClick()` subscription is now cleaned up via `Subject` + `takeUntil` to prevent callbacks firing on destroyed views
- Removed 4 redundant `cdr.detectChanges()` calls from event handlers in `DatePicker` and `DateRange` (Angular handles zone-triggered re-renders automatically)

### Changed

- `InlineCalendar.selectDate(date: any)` parameter type tightened to `ChronicaDate`
- `TimePicker`: unified `format24Hour` / `timeFormat` config duality via `isFormat24Hour` getter; both config keys now work correctly
- Library `package.json` description updated to list all 6 component names

### Documentation

- README: WCAG claim updated from "WCAG 2.1 AA compliant" to "WCAG 2.1 AA targeted" with feature list
- README: Added Angular 20.x to the version compatibility table
- README: Removed inaccurate "Virtual Scrolling" performance claim (time/duration pickers use CSS overflow)
- README: Added "What's New in v1.2.0" section documenting all new features

## [1.1.4] - 2026-04-10

### Fixed

- Updated repository URLs and package configuration
- Bumped version to 1.1.4

## [1.1.0] - 2026-03-01

### Added

- Initial public release with 6 picker components
- 8 color themes (blue, green, purple, red, orange, teal, pink, indigo)
- Light and dark mode support
- 11 built-in locales
- Angular CDK Overlay-based popups
- ControlValueAccessor support for all components
