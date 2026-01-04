import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'user_data';

  // Usando signals para reatividade
  isAuthenticated = signal<boolean>(this.hasToken());
  currentUser = signal<any>(this.getUserData());

  constructor(private router: Router) {
    // Mock: Login sempre autenticado para desenvolvimento
    this.mockLogin();
  }

  private mockLogin(): void {
    // Simula login automático para desenvolvimento
    // Login está "lockado" - sempre autenticado
    if (!this.hasToken()) {
      const mockToken = 'mock-token-' + Date.now();
      const mockUser = { username: 'usuario_mock', name: 'Usuário Mock' };
      this.login(mockToken, mockUser);
    } else {
      this.checkAuthStatus();
    }
  }

  login(token: string, userData?: any): void {
    localStorage.setItem(this.tokenKey, token);
    if (userData) {
      localStorage.setItem(this.userKey, JSON.stringify(userData));
      this.currentUser.set(userData);
    }
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    // Não redireciona para auth, pois login está mockado
    // Apenas limpa os dados
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserData(): any {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  checkAuthStatus(): void {
    this.isAuthenticated.set(this.hasToken());
    if (this.hasToken()) {
      this.currentUser.set(this.getUserData());
    }
  }

  isLoggedIn(): Observable<boolean> {
    return of(this.isAuthenticated());
  }
}
