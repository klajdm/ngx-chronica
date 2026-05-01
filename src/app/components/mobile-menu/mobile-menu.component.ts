import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppMenuItems } from '../models/menuItems';

interface MenuItem {
  label: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  imports: [RouterModule],
})
export class MobileMenuComponent implements OnInit, OnDestroy {
  // Output event to close the mobile menu
  @Output() closeMenu = new EventEmitter<void>();

  menuItems: MenuItem[] = AppMenuItems.items;

  // track open/closed state for groups by label
  openGroups: Record<string, boolean> = {};

  private routerSub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // initialize groups as closed
    this.menuItems.forEach((m) => {
      if (m.children) this.openGroups[m.label] = false;
    });

    // open group if current url matches a child
    this.updateOpenStates(this.router.url);

    this.routerSub = this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.updateOpenStates(ev.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  toggleGroup(label: string) {
    this.openGroups[label] = !this.openGroups[label];
  }

  isGroupOpen(item: MenuItem): boolean {
    if (!item.children) return false;
    return !!this.openGroups[item.label];
  }

  private updateOpenStates(url: string) {
    this.menuItems.forEach((m) => {
      if (m.children) {
        const anyChildActive = m.children.some((c) => {
          if (!c.route) return false;
          return (
            url === c.route ||
            url.startsWith(c.route + '/') ||
            url.startsWith(c.route + '?') ||
            url.startsWith(c.route + '#')
          );
        });
        this.openGroups[m.label] = anyChildActive;
      }
    });
  }

  onMenuItemClick() {
    // Close the mobile menu when a menu item is clicked
    this.closeMenu.emit();
  }

  onCloseClick() {
    this.closeMenu.emit();
  }
}
