import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { MobileMenuComponent } from 'src/app/components/mobile-menu/mobile-menu.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    RouterModule,
    FooterComponent,
    MobileMenuComponent,
  ],
  templateUrl: './main.component.html',
  styles: [],
})
export class MainComponent {
  // mobile drawer state (controlled by component, not DOM)
  mobileDrawerOpen = false;
  mobileDrawerVisible = false;

  // Toggle the mobile drawer
  toggleMobileDrawer(): void {
    console.log('Toggle mobile drawer called, current state:', this.mobileDrawerOpen);
    if (this.mobileDrawerOpen) {
      this.closeMobileDrawer();
    } else {
      this.openMobileDrawer();
    }
  }

  // Open the mobile drawer
  openMobileDrawer(): void {
    this.mobileDrawerVisible = true;
    // Small delay to ensure the element is rendered before starting animation
    setTimeout(() => {
      this.mobileDrawerOpen = true;
    }, 10);
  }

  // Close the mobile drawer
  closeMobileDrawer(): void {
    this.mobileDrawerOpen = false;
    // Hide after animation completes
    setTimeout(() => {
      this.mobileDrawerVisible = false;
    }, 300);
  }
}
