import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { MobileMenuComponent } from 'src/app/components/mobile-menu/mobile-menu.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    RouterModule,
    FooterComponent,
    MobileMenuComponent,
  ],
  templateUrl: './main.component.html',
  styles: [],
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLElement>;

  mobileDrawerOpen = false;
  mobileDrawerVisible = false;
  showBackToTop = false;

  private readonly backToTopThreshold = 200;
  private routerSub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollContainer?.nativeElement.scrollTo({ top: 0 });
        this.showBackToTop = false;
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  toggleMobileDrawer(): void {
    if (this.mobileDrawerOpen) {
      this.closeMobileDrawer();
    } else {
      this.openMobileDrawer();
    }
  }

  openMobileDrawer(): void {
    this.mobileDrawerVisible = true;
    setTimeout(() => {
      this.mobileDrawerOpen = true;
    }, 10);
  }

  closeMobileDrawer(): void {
    this.mobileDrawerOpen = false;
    setTimeout(() => {
      this.mobileDrawerVisible = false;
    }, 300);
  }

  onContentScroll(event: Event): void {
    const target = event.target as HTMLElement;
    this.showBackToTop = (target.scrollTop ?? 0) > this.backToTopThreshold;
  }

  scrollToTop(): void {
    this.scrollContainer?.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
    this.showBackToTop = false;
  }
}
