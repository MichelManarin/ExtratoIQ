import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { jwtAuthInterceptor } from './core/interceptors/jwt-auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { globalHttpInterceptor } from './core/interceptors/globalhttpinterceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtAuthInterceptor, loadingInterceptor, globalHttpInterceptor])
    ),
    provideCharts(withDefaultRegisterables()),
  ],
};
