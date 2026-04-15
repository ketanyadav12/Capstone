import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { VillageDataService } from '../services/village-data.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  isSidebarOpen = false;

  newVillage = {
    name: '',
    lat: 22.5,
    lng: 78.5,
    employment: 50,
    water: 50,
    literacy: 50
  };

  navItems = [
    { label: 'Dashboard', icon: 'fa-solid fa-chart-line', link: '/dashboard' },
    { label: 'Agriculture', icon: 'fa-solid fa-seedling', link: '/agriculture' },
    { label: 'Health', icon: 'fa-solid fa-heart-pulse', link: '/health' },
    { label: 'Education', icon: 'fa-solid fa-graduation-cap', link: '/education' },
    { label: 'Water Resources', icon: 'fa-solid fa-droplet', link: '/water' },
    { label: 'Village Map', icon: 'fa-solid fa-map-location-dot', link: '/map' }
  ];

  constructor(
    private readonly themeService: ThemeService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly villageDataService: VillageDataService
  ) {}

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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAddDataModalOpen = false;

  openAddDataModal(): void {
    this.isAddDataModalOpen = true;
  }

  closeAddDataModal(): void {
    this.isAddDataModalOpen = false;
  }

  saveVillage(): void {
    if (this.newVillage.name.trim()) {
      this.villageDataService.addVillage(this.newVillage);
      this.closeAddDataModal();
      this.newVillage = { name: '', lat: 22.5, lng: 78.5, employment: 50, water: 50, literacy: 50 }; // reset
    }
  }
}
