import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  label: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  imports: [RouterModule, CommonModule],
})
export class MobileMenuComponent {
  // Output event to close the mobile menu
  @Output() closeMenu = new EventEmitter<void>();

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
          label: 'Date Range',
          route: '/components/date-range',
        },
        {
          label: 'Time Picker',
          route: '/components/time-picker',
        },
        {
          label: 'Duration Picker',
          route: '/components/duration-picker',
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

  // track open/closed state for groups by label
  openGroups: Record<string, boolean> = {};

  constructor() {
    // initialize groups as closed
    this.menuItems.forEach((m) => {
      if (m.children) this.openGroups[m.label] = false;
    });
  }

  toggleGroup(label: string) {
    this.openGroups[label] = !this.openGroups[label];
  }

  isGroupOpen(item: MenuItem): boolean {
    if (!item.children) return false;
    return !!this.openGroups[item.label];
  }

  onMenuItemClick() {
    // Close the mobile menu when a menu item is clicked
    this.closeMenu.emit();
  }

  onCloseClick() {
    this.closeMenu.emit();
  }
}
