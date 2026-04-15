import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'svd_logged_in';

  isLoggedIn(): boolean {
    return localStorage.getItem(this.key) === 'true';
  }

  login(): void {
    localStorage.setItem(this.key, 'true');
  }

  logout(): void {
    localStorage.removeItem(this.key);
  }
}
