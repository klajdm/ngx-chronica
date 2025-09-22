import { MenuItem } from './menu-item.model';

export class AppMenuItems {
  static get items(): MenuItem[] {
    return [
      { label: 'Introduction', route: '/' },
      { label: 'Getting Started', route: '/start' },
      {
        label: 'Components',
        children: [
          { label: 'Datepicker', route: '/components/datepicker' },
          { label: 'Date Range', route: '/components/date-range' },
          { label: 'Time Picker', route: '/components/time-picker' },
          { label: 'DateTime Picker', route: '/components/datetime-picker' },
          { label: 'Duration Picker', route: '/components/duration-picker' },
          { label: 'Inline Calendar', route: '/components/inline-calendar' },
        ],
      },
      { label: 'License', route: '/license' },
    ];
  }
}
