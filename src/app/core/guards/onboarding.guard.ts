import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { OnboardingService } from '../services/onboarding.service';

export const onboardingGuard: CanActivateFn = (route, state) => {
  const onboardingService = inject(OnboardingService);
  const router = inject(Router);

  // Se já completou o onboarding, redireciona para home
  if (onboardingService.isCompleted()) {
    router.navigate(['/home']);
    return false;
  }

  // Permite acesso ao onboarding
  return true;
};

