import { Component, EventEmitter, Output, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService, ColorTheme } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly themeService = inject(ThemeService);

  // Output event for mobile menu toggle
  @Output() toggleMobileMenu = new EventEmitter<void>();

  // Theme selector dropdown state
  public readonly isThemeDropdownOpen = signal(false);

  // Expose theme service properties to template
  public readonly currentTheme = this.themeService.currentTheme;
  public readonly currentThemeOption = this.themeService.currentThemeOption;
  public readonly themeOptions = this.themeService.themeOptions;

  public onToggleMobileMenu(): void {
    this.toggleMobileMenu.emit();
  }

  public toggleThemeDropdown(): void {
    this.isThemeDropdownOpen.update((isOpen) => !isOpen);
  }

  public selectTheme(theme: ColorTheme): void {
    this.themeService.setTheme(theme);
    this.isThemeDropdownOpen.set(false);
  }

  public closeThemeDropdown(): void {
    this.isThemeDropdownOpen.set(false);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const themeSelector = target.closest('.theme-selector');

    if (!themeSelector && this.isThemeDropdownOpen()) {
      this.closeThemeDropdown();
    }
  }
}
