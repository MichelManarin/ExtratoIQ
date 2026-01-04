import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss',
})
export class DashboardCardComponent {
  @Input() title: string = '';
  @Input() value: string | number | null = '';
  @Input() subtitle?: string;
  @Input() variant: 'default' | 'primary' | 'success' | 'warning' = 'default';
}

