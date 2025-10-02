import { StylingGuidesComponent } from './features/main/styling-guides/styling-guides.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../app/features/main/main.component').then((m) => m.MainComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        // Homepage/Introduction
        loadComponent: () =>
          import('../app/features/main/introduction/introduction.component').then(
            (m) => m.IntroductionComponent
          ),
        title: 'Introduction | Angular Chronica',
      },
      {
        path: 'start',
        loadComponent: () =>
          import('./features/main/getting-started/getting-started.component').then(
            (m) => m.GettingStartedComponent
          ),
        title: 'Getting Started | Angular Chronica',
      },
      {
        path: 'documentation',
        loadComponent: () =>
          import('./features/main/documentation/documentation.component').then(
            (m) => m.DocumentationComponent
          ),
        title: 'Documentation | Angular Chronica',
      },
      {
        path: 'styling-guides',
        loadComponent: () =>
          import('./features/main/styling-guides/styling-guides.component').then(
            (m) => m.StylingGuidesComponent
          ),
        title: 'Styling Guides | Angular Chronica',
      },
      {
        path: 'components/datepicker',
        loadComponent: () =>
          import('./features/main/datepicker-demo/datepicker-demo.component').then(
            (m) => m.DatepickerDemoComponent
          ),
        title: 'Datepicker | Angular Chronica',
      },
      {
        path: 'components/date-range',
        loadComponent: () =>
          import('./features/main/date-range-demo/date-range-demo.component').then(
            (m) => m.DateRangeDemoComponent
          ),
        title: 'Date Range | Angular Chronica',
      },
      {
        path: 'components/time-picker',
        loadComponent: () =>
          import('./features/main/time-picker-demo/time-picker-demo.component').then(
            (m) => m.TimePickerDemoComponent
          ),
        title: 'Time Picker | Angular Chronica',
      },
      {
        path: 'components/datetime-picker',
        loadComponent: () =>
          import('./features/main/datetime-picker-demo/datetime-picker-demo.component').then(
            (m) => m.DateTimePickerDemoComponent
          ),
        title: 'DateTime Picker | Angular Chronica',
      },
      {
        path: 'components/duration-picker',
        loadComponent: () =>
          import('./features/main/duration-picker-demo/duration-picker-demo.component').then(
            (m) => m.DurationPickerDemoComponent
          ),
        title: 'Duration Picker | Angular Chronica',
      },
      {
        path: 'components/inline-calendar',
        loadComponent: () =>
          import('./features/main/inline-calendar-demo/inline-calendar-demo.component').then(
            (m) => m.InlineCalendarDemoComponent
          ),
        title: 'Inline Calendar | Angular Chronica',
      },
      {
        path: 'development/contributing',
        loadComponent: () =>
          import('./features/main/contributing/contributing.component').then(
            (m) => m.ContributingComponent
          ),
        title: 'Contributing | Angular Chronica',
      },
      {
        path: 'development/code-of-conduct',
        loadComponent: () =>
          import('./features/main/code-of-conduct/code-of-conduct.component').then(
            (m) => m.CodeOfConductComponent
          ),
        title: 'Code of Conduct | Angular Chronica',
      },
      {
        path: 'license',
        loadComponent: () =>
          import('./features/main/license/license.component').then((m) => m.LicenseComponent),
        title: 'License | Angular Chronica',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('../app/features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Not Found',
  },
];
