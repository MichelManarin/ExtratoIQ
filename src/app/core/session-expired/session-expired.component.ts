import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-session-expired',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-expired.component.html',
  styleUrl: './session-expired.component.scss',
})
export class SessionExpiredComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goToLogin(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}

