import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import type { MenuItem } from '../models/menu-item.model';
import { AppMenuItems } from '../models/menuItems';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
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

  private updateOpenStates(url: string) {
    this.menuItems.forEach((m) => {
      if (m.children) {
        const anyChildActive = m.children.some((c) => {
          if (!c.route) return false;
          // match exact or prefix (for nested routes)
          return (
            url === c.route ||
            url.startsWith(c.route + '/') ||
            url.startsWith(c.route + '?') ||
            url.startsWith(c.route + '#')
          );
        });
        // close group if no child is active, open if child is active
        this.openGroups[m.label] = anyChildActive;
      }
    });
  }

  toggleGroup(label: string) {
    this.openGroups[label] = !this.openGroups[label];
  }

  isGroupOpen(item: MenuItem): boolean {
    if (!item.children) return false;
    return !!this.openGroups[item.label];
  }
}
