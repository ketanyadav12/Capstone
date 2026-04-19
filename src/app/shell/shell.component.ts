import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { TranslationService } from '../services/translation.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  isSidebarOpen = false;
  selectedLanguage = 'en';
  readonly languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'bn', label: 'Bengali' },
    { code: 'kn', label: 'Kannada' },
    { code: 'ml', label: 'Malayalam' },
    { code: 'mr', label: 'Marathi' },
    { code: 'or', label: 'Odia' },
    { code: 'pa', label: 'Punjabi' },
    { code: 'te', label: 'Telugu' }
  ];

  navItems = [
    { label: 'NAV.DASHBOARD', icon: 'fa-solid fa-chart-line', link: '/dashboard' },
    { label: 'NAV.AGRICULTURE', icon: 'fa-solid fa-seedling', link: '/agriculture' },
    { label: 'NAV.HEALTH', icon: 'fa-solid fa-heart-pulse', link: '/health' },
    { label: 'NAV.EDUCATION', icon: 'fa-solid fa-graduation-cap', link: '/education' },
    { label: 'NAV.WATER', icon: 'fa-solid fa-droplet', link: '/water' },
    { label: 'NAV.MAP', icon: 'fa-solid fa-map-location-dot', link: '/map' }
  ];

  constructor(
    private readonly themeService: ThemeService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly translationService: TranslationService
  ) {
    this.selectedLanguage = this.translationService.getCurrentLanguage();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebarOnMobile(): void {
    this.isSidebarOpen = false;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  get currentRoleLabel(): string {
    return this.authService.getRole() === 'admin' ? 'Admin' : 'User';
  }

  changeLanguage(): void {
    this.translationService.useLanguage(this.selectedLanguage);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
