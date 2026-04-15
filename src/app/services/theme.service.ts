import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly key = 'svd_dark_mode';

  initializeTheme(): void {
    const saved = localStorage.getItem(this.key);
    const isDark = saved === 'true';
    this.applyTheme(isDark);
  }

  toggleTheme(): boolean {
    const isDark = !this.isDarkMode();
    this.applyTheme(isDark);
    localStorage.setItem(this.key, String(isDark));
    return isDark;
  }

  isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }

  private applyTheme(isDark: boolean): void {
    document.body.classList.toggle('dark-mode', isDark);
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  }
}
