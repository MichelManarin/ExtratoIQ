import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { OnboardingService } from '../services/onboarding.service';

export const onboardingCompletedGuard: CanActivateFn = (route, state) => {
  const onboardingService = inject(OnboardingService);
  const router = inject(Router);

  // Se o onboarding não foi completado, redireciona para o onboarding
  if (!onboardingService.isCompleted()) {
    router.navigate(['/onboarding'], { replaceUrl: true });
    return false;
  }

  return true;
};

