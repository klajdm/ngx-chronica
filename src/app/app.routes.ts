import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/features/main/main.component').then(
        (m) => m.MainComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        // Homepage/Introduction
        loadComponent: () =>
          import('../app/features/main/introduction/introduction.component').then(
            (m) => m.IntroductionComponent
          ),
        title: 'Introduction',
      },
      {
        path: 'start',
        loadComponent: () =>
          import('./features/main/getting-started/getting-started.component').then(
            (m) => m.GettingStartedComponent
          ),
        title: 'Getting Started',
      },
      {
        path: 'components/datepicker',
        loadComponent: () =>
          import('./features/main/datepicker-demo/datepicker-demo.component').then(
            (m) => m.DatepickerDemoComponent
          ),
        title: 'Datepicker',
      },
      {
        path: 'components/inline-calendar',
        loadComponent: () =>
          import('./features/main/inline-calendar-demo/inline-calendar-demo.component').then(
            (m) => m.InlineCalendarDemoComponent
          ),
        title: 'Inline Calendar',
      },
      {
        path: 'license',
        loadComponent: () =>
          import('./features/main/license/license.component').then(
            (m) => m.LicenseComponent
          ),
        title: 'License',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('../app/features/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: 'Not Found',
  },
];
