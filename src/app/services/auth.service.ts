import { Injectable } from '@angular/core';

export type UserRole = 'admin' | 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'svd_logged_in';
  private readonly roleKey = 'svd_role';
  private readonly users = [
    { email: 'admin@svd.local', password: 'admin123', role: 'admin' as const },
    { email: 'user@svd.local', password: 'user123', role: 'user' as const }
  ];

  isLoggedIn(): boolean {
    return localStorage.getItem(this.key) === 'true';
  }

  login(email: string, password: string): boolean {
    const matchedUser = this.users.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password
    );

    if (!matchedUser) {
      return false;
    }

    localStorage.setItem(this.key, 'true');
    localStorage.setItem(this.roleKey, matchedUser.role);
    return true;
  }

  getRole(): UserRole {
    const role = localStorage.getItem(this.roleKey);
    if (role === 'admin' || role === 'user') {
      return role;
    }
    return 'admin';
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  logout(): void {
    localStorage.removeItem(this.key);
    localStorage.removeItem(this.roleKey);
  }
}
