import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import type { MenuItem } from './menu-item.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Introduction',
      route: '/',
    },
    {
      label: 'Getting Started',
      route: '/start',
    },
    {
      label: 'Components',
      children: [
        {
          label: 'Datepicker',
          route: '/components/datepicker',
        },
        {
          label: 'Inline calendar',
          route: '/components/inline-calendar',
        },
      ],
    },
    {
      label: 'License',
      route: '/license',
    },
  ];
}
