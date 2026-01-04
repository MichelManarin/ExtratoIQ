import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { OnboardingComponent } from './views/onboarding/onboarding.component';
import { AuthComponent } from './core/auth/auth.component';
import { SessionExpiredComponent } from './core/session-expired/session-expired.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { UnauthorizedComponent } from './core/unauthorized/unauthorized.component';
import { authGuard } from './core/guards/auth.guard';
import { onboardingGuard } from './core/guards/onboarding.guard';
import { onboardingCompletedGuard } from './core/guards/onboarding-completed.guard';

export const routes: Routes = [
  {
    path: 'onboarding',
    component: OnboardingComponent,
    data: { title: 'Onboarding' },
    canActivate: [onboardingGuard],
  },
  {
    path: '',
    redirectTo: '/onboarding',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Página Inicial' },
    canActivate: [onboardingCompletedGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'sessao-expirada',
    component: SessionExpiredComponent,
    data: { title: 'Sessão Expirada' },
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    data: { title: 'Acesso Negado' },
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
