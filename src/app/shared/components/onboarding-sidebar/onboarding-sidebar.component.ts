import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingService } from '@app/core/services/onboarding.service';

@Component({
  selector: 'app-onboarding-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding-sidebar.component.html',
  styleUrl: './onboarding-sidebar.component.scss',
})
export class OnboardingSidebarComponent {
  onboardingService = inject(OnboardingService);
  
  benefits = [
    'Feedback de objetivos',
    'Recomendações personalizadas',
    'Conteúdos direcionados',
  ];

  get progressPercentage(): number {
    const data = this.onboardingService.getOnboardingData();
    if (data.totalSteps === 0) return 0;
    return (data.currentStep / data.totalSteps) * 100;
  }
}

