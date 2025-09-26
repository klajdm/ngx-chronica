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

  // back-to-top button visibility state
  showBackToTop = false;

  // threshold in pixels when the Back to Top button appears
  private readonly backToTopThreshold = 200;

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

  // Called when the scrollable content container scrolls
  onContentScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop ?? 0;
    this.showBackToTop = scrollTop > this.backToTopThreshold;
  }

  // Smoothly scroll the main content container to top
  scrollToTop(): void {
    // find the scrollable container in the DOM by querying for the class used in template
    const container = document.querySelector('.flex-1.overflow-auto') as HTMLElement | null;
    if (!container) {
      // fallback: scroll window
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    container.scrollTo({ top: 0, behavior: 'smooth' });
    // immediately hide the button; it will reappear if user scrolls again
    this.showBackToTop = false;
  }
}
