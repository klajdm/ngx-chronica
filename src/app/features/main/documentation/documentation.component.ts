import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucidePin,
  LucideCalendarDays,
  LucideBarChart2,
  LucideClock,
  LucideFileText,
  LucideHospital,
  LucideGraduationCap,
  LucideChevronDown,
} from '@lucide/angular';

interface FeatureCard {
  title: string;
  description: string;
  items: string[];
}

interface FeatureSection {
  title: string;
  features: { title: string; description: string }[];
}

interface DisplayMode {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

interface ApiProperty {
  property: string;
  type: string;
  default?: string;
  description: string;
}

interface ApiOutput {
  event: string;
  type: string;
  description: string;
}

interface ComponentApi {
  name: string;
  inputs: ApiProperty[];
  outputs: ApiOutput[];
}

interface ConfigInterface {
  name: string;
  properties: ApiProperty[];
}

interface TypeDefinition {
  name: string;
  code: string;
}

interface UseCase {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
}

@Component({
  selector: 'app-documentation',
  imports: [
    CommonModule,
    LucidePin,
    LucideCalendarDays,
    LucideBarChart2,
    LucideClock,
    LucideFileText,
    LucideHospital,
    LucideGraduationCap,
    LucideChevronDown,
  ],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css'],
})
export class DocumentationComponent {
  coreFeatures: FeatureCard[] = [
    {
      title: '6 Specialized Components',
      description:
        'Complete toolkit covering all date/time selection scenarios: Datepicker, Date Range, Inline Calendar, Time Picker, DateTime Picker, and Duration Picker.',
      items: [
        'Single date selection',
        'Date range selection',
        'Time selection (12h/24h)',
        'Combined date + time',
        'Duration/time span selection',
        'Always-visible calendar',
      ],
    },
    {
      title: 'Full Forms Integration',
      description:
        'Seamless integration with Angular forms through ControlValueAccessor implementation.',
      items: [
        'Reactive Forms support',
        'Template-driven Forms support',
        'Two-way binding with [(ngModel)]',
        'Form validation support',
        'Disabled state handling',
        'Touch/dirty state tracking',
      ],
    },
    {
      title: 'Advanced Theming',
      description:
        '8 built-in color themes with light/dark mode support and CSS custom properties.',
      items: [
        '8 color themes (Blue, Green, Purple, Red, etc.)',
        'Light/Dark mode auto-detection',
        'CSS custom properties for customization',
        'Consistent design system',
        'Easy theme switching',
      ],
    },
    {
      title: 'Internationalization',
      description: '11 built-in locales with support for custom locales.',
      items: [
        '11 built-in locales (EN-US, EN-GB, ES, FR, DE, IT, PT, ZH, JA, KO, RU)',
        'Custom locale support',
        'Configurable first day of week',
        'Localized month/day names',
        'Date format customization',
      ],
    },
  ];

  dateTimeFeatures: FeatureSection[] = [
    {
      title: 'Smart Date Restrictions',
      features: [
        { title: 'Min/Max Dates', description: 'Set minimum and maximum selectable dates' },
        { title: 'Disabled Dates', description: 'Disable specific dates or date ranges' },
        { title: 'Highlighted Dates', description: 'Highlight important dates visually' },
      ],
    },
    {
      title: 'Time Selection Options',
      features: [
        { title: '12h/24h Format', description: 'Support for both time formats with AM/PM' },
        { title: 'Step Intervals', description: 'Customizable minute/second step intervals' },
        { title: 'Time Restrictions', description: 'Min/max time limits for business hours' },
      ],
    },
    {
      title: 'Calendar Display Options',
      features: [
        { title: 'Week Numbers', description: 'Optional week number display' },
        { title: 'Adjacent Months', description: 'Show/hide dates from adjacent months' },
        { title: 'Today Button', description: 'Quick navigation to current date' },
      ],
    },
  ];

  displayModes: DisplayMode[] = [
    {
      icon: 'chevronDown',
      title: 'Popup Mode',
      description:
        'Calendar appears in an overlay popup when triggered, perfect for forms and space-constrained layouts.',
      features: [
        'Angular CDK Overlay positioning',
        'Custom trigger elements',
        'Backdrop click to close',
        'Keyboard navigation (Escape to close)',
        'Smart positioning (auto-flip)',
      ],
    },
    {
      icon: 'pin',
      title: 'Inline Mode',
      description:
        'Calendar is always visible inline with your content, ideal for dashboards and dedicated date selection pages.',
      features: [
        'Always visible',
        'No trigger required',
        'Embeddable in any layout',
        'Perfect for dashboards',
        'Customizable size',
      ],
    },
  ];

  componentApis: ComponentApi[] = [
    {
      name: 'Datepicker Component',
      inputs: [
        {
          property: 'selectedDate',
          type: 'Date | null',
          default: 'null',
          description: 'Currently selected date',
        },
        {
          property: 'config',
          type: 'ChronicaCalendarConfig',
          default: 'DEFAULT_CALENDAR_CONFIG',
          description: 'Configuration object for calendar behavior',
        },
        {
          property: 'locale',
          type: 'ChronicaLocale | string',
          default: "'en-US'",
          description: 'Locale for internationalization',
        },
        {
          property: 'initialMonth',
          type: 'number',
          default: '-',
          description: 'Initial month to display (0-11)',
        },
        {
          property: 'initialYear',
          type: 'number',
          default: '-',
          description: 'Initial year to display',
        },
        {
          property: 'popupPosition',
          type: "'bottom' | 'top' | 'auto'",
          default: "'auto'",
          description: 'Position of the popup calendar',
        },
        {
          property: 'hideInput',
          type: 'boolean',
          default: 'false',
          description: 'Hide the input field (custom trigger)',
        },
        {
          property: 'placeholder',
          type: 'string',
          default: "'Select date'",
          description: 'Placeholder text for input',
        },
      ],
      outputs: [
        {
          event: 'dateSelected',
          type: 'EventEmitter<Date>',
          description: 'Emitted when a date is selected',
        },
        {
          event: 'monthChanged',
          type: 'EventEmitter<{month: number; year: number}>',
          description: 'Emitted when month/year changes',
        },
        {
          event: 'calendarEvent',
          type: 'EventEmitter<ChronicaEvent>',
          description: 'Emitted for calendar-related events',
        },
      ],
    },
    {
      name: 'Date Range Component',
      inputs: [
        {
          property: 'config',
          type: 'ChronicaCalendarConfig',
          default: 'DEFAULT_CALENDAR_CONFIG',
          description: 'Configuration object',
        },
        {
          property: 'locale',
          type: 'ChronicaLocale | string',
          default: "'en-US'",
          description: 'Locale for internationalization',
        },
        {
          property: 'placeholder',
          type: 'string',
          default: "'Select date range'",
          description: 'Placeholder text',
        },
        {
          property: 'minDate',
          type: 'Date | null',
          default: 'null',
          description: 'Minimum selectable date',
        },
        {
          property: 'maxDate',
          type: 'Date | null',
          default: 'null',
          description: 'Maximum selectable date',
        },
        {
          property: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disable the component',
        },
        {
          property: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Mark as required field',
        },
      ],
      outputs: [
        {
          event: 'dateRangeChange',
          type: 'EventEmitter<ChronicaDateRange>',
          description: 'Emitted when date range changes',
        },
        {
          event: 'calendarEvent',
          type: 'EventEmitter<ChronicaEvent>',
          description: 'Emitted for calendar events',
        },
      ],
    },
    {
      name: 'Time Picker Component',
      inputs: [
        {
          property: 'config',
          type: 'TimePickerConfig',
          default: 'DEFAULT_TIME_CONFIG',
          description: 'Configuration object',
        },
        {
          property: 'locale',
          type: 'ChronicaLocale | string',
          default: "'en-US'",
          description: 'Locale for internationalization',
        },
        {
          property: 'placeholder',
          type: 'string',
          default: "'Select time'",
          description: 'Placeholder text',
        },
        {
          property: 'minTime',
          type: 'ChronicaTimeValue | null',
          default: 'null',
          description: 'Minimum selectable time',
        },
        {
          property: 'maxTime',
          type: 'ChronicaTimeValue | null',
          default: 'null',
          description: 'Maximum selectable time',
        },
        {
          property: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disable the component',
        },
        {
          property: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Mark as required field',
        },
      ],
      outputs: [
        {
          event: 'timeChange',
          type: 'EventEmitter<ChronicaTimeValue | null>',
          description: 'Emitted when time changes',
        },
      ],
    },
    {
      name: 'Duration Picker Component',
      inputs: [
        {
          property: 'config',
          type: 'DurationPickerConfig',
          default: '-',
          description: 'Configuration object',
        },
        {
          property: 'locale',
          type: 'ChronicaLocale | string',
          default: "'en-US'",
          description: 'Locale for internationalization',
        },
        {
          property: 'placeholder',
          type: 'string',
          default: "'Select duration'",
          description: 'Placeholder text',
        },
        {
          property: 'minDuration',
          type: 'ChronicaDurationValue | null',
          default: 'null',
          description: 'Minimum duration',
        },
        {
          property: 'maxDuration',
          type: 'ChronicaDurationValue | null',
          default: 'null',
          description: 'Maximum duration',
        },
        {
          property: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disable the component',
        },
        {
          property: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Mark as required field',
        },
      ],
      outputs: [
        {
          event: 'durationChange',
          type: 'EventEmitter<ChronicaDurationValue | null>',
          description: 'Emitted when duration changes',
        },
      ],
    },
  ];

  configInterfaces: ConfigInterface[] = [
    {
      name: 'ChronicaCalendarConfig',
      properties: [
        {
          property: 'theme',
          type: "'light' | 'dark' | 'auto'",
          description: 'Visual theme mode',
        },
        {
          property: 'colorTheme',
          type: "'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal' | 'pink' | 'indigo'",
          description: 'Color theme for primary colors',
        },
        {
          property: 'minDate',
          type: 'Date',
          description: 'Minimum selectable date',
        },
        {
          property: 'maxDate',
          type: 'Date',
          description: 'Maximum selectable date',
        },
        {
          property: 'disabledDates',
          type: 'Date[]',
          description: 'Array of disabled dates',
        },
        {
          property: 'firstDayOfWeek',
          type: 'number',
          description: 'First day of week (0=Sunday, 1=Monday)',
        },
        {
          property: 'showTodayButton',
          type: 'boolean',
          description: 'Show today button',
        },
        {
          property: 'showNavigation',
          type: 'boolean',
          description: 'Show navigation arrows',
        },
        {
          property: 'closeAfterSelection',
          type: 'boolean',
          description: 'Close popup after date selection',
        },
      ],
    },
    {
      name: 'TimePickerConfig',
      properties: [
        {
          property: 'format24Hour',
          type: 'boolean',
          description: 'Use 24-hour format (true) or 12-hour with AM/PM (false)',
        },
        {
          property: 'showSeconds',
          type: 'boolean',
          description: 'Show seconds selector',
        },
        {
          property: 'minuteStep',
          type: 'number',
          description: 'Minute step increment (e.g., 15 for 15-minute intervals)',
        },
        {
          property: 'secondStep',
          type: 'number',
          description: 'Second step increment',
        },
      ],
    },
    {
      name: 'DurationPickerConfig',
      properties: [
        {
          property: 'showDays',
          type: 'boolean',
          description: 'Show days selector',
        },
        {
          property: 'showHours',
          type: 'boolean',
          description: 'Show hours selector',
        },
        {
          property: 'showMinutes',
          type: 'boolean',
          description: 'Show minutes selector',
        },
        {
          property: 'showSeconds',
          type: 'boolean',
          description: 'Show seconds selector',
        },
        {
          property: 'stepDays',
          type: 'number',
          description: 'Day step increment',
        },
        {
          property: 'stepHours',
          type: 'number',
          description: 'Hour step increment',
        },
        {
          property: 'stepMinutes',
          type: 'number',
          description: 'Minute step increment',
        },
        {
          property: 'allowZero',
          type: 'boolean',
          description: 'Allow zero duration',
        },
      ],
    },
  ];

  typeDefinitions: TypeDefinition[] = [
    {
      name: 'ChronicaTimeValue',
      code: `<span class="text-purple-400">interface</span> <span class="text-blue-300">ChronicaTimeValue</span> {
  <span class="text-cyan-300">hours</span>: <span class="text-blue-300">number</span>;      <span class="text-gray-500">// 0-23</span>
  <span class="text-cyan-300">minutes</span>: <span class="text-blue-300">number</span>;    <span class="text-gray-500">// 0-59</span>
  <span class="text-cyan-300">seconds</span>?: <span class="text-blue-300">number</span>;   <span class="text-gray-500">// 0-59 (optional)</span>
  <span class="text-cyan-300">period</span>?: <span class="text-green-400">'AM'</span> | <span class="text-green-400">'PM'</span>; <span class="text-gray-500">// For 12h format</span>
}`,
    },
    {
      name: 'ChronicaDurationValue',
      code: `<span class="text-purple-400">interface</span> <span class="text-blue-300">ChronicaDurationValue</span> {
  <span class="text-cyan-300">days</span>?: <span class="text-blue-300">number</span>;
  <span class="text-cyan-300">hours</span>?: <span class="text-blue-300">number</span>;
  <span class="text-cyan-300">minutes</span>?: <span class="text-blue-300">number</span>;
  <span class="text-cyan-300">seconds</span>?: <span class="text-blue-300">number</span>;
}`,
    },
    {
      name: 'ChronicaDateRange',
      code: `<span class="text-purple-400">interface</span> <span class="text-blue-300">ChronicaDateRange</span> {
  <span class="text-cyan-300">startDate</span>: <span class="text-blue-300">Date</span> | <span class="text-orange-400">null</span>;
  <span class="text-cyan-300">endDate</span>: <span class="text-blue-300">Date</span> | <span class="text-orange-400">null</span>;
}`,
    },
    {
      name: 'ChronicaDateTimeValue',
      code: `<span class="text-purple-400">interface</span> <span class="text-blue-300">ChronicaDateTimeValue</span> {
  <span class="text-cyan-300">date</span>: <span class="text-blue-300">Date</span> | <span class="text-orange-400">null</span>;
  <span class="text-cyan-300">time</span>: <span class="text-blue-300">ChronicaTimeValue</span> | <span class="text-orange-400">null</span>;
}`,
    },
  ];

  useCases: UseCase[] = [
    {
      icon: 'calendarDays',
      title: 'Booking Systems',
      description:
        'Date range selection for hotel reservations, appointment scheduling, and event booking',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: 'barChart2',
      title: 'Analytics Dashboards',
      description: 'Date range filters for reports, data visualization, and time-based analytics',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      icon: 'clock',
      title: 'Scheduling Apps',
      description: 'Time selection for meetings, appointments, and calendar events',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: 'fileText',
      title: 'Task Management',
      description: 'Due dates, duration estimation, and time tracking for project management',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      icon: 'hospital',
      title: 'Healthcare Systems',
      description: 'Patient appointment scheduling with time slots and duration selection',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      icon: 'graduationCap',
      title: 'Education Platforms',
      description: 'Class scheduling, exam dates, and academic calendar management',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
    },
  ];
}
