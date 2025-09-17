import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  // Output event for mobile menu toggle
  @Output() toggleMobileMenu = new EventEmitter<void>();

  public onToggleMobileMenu(): void {
    console.log('Hamburger clicked!'); // Debug log
    this.toggleMobileMenu.emit();
  }
}
