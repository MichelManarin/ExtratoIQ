import { Injectable, inject } from '@angular/core';
import { LoadingService } from './loading.service';

export interface DialogOptions {
  icon?: string;
  acceptButtonProps?: {
    label: string;
    severity?: string;
  };
  rejectButtonProps?: {
    label: string;
    severity?: string;
    outlined?: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private loadingService = inject(LoadingService);

  loading = {
    show: () => this.loadingService.show(),
    hide: () => this.loadingService.hide(),
    isLoading: () => this.loadingService.isLoading(),
  };

  dialog = {
    confirm: (title: string, message: string, options?: DialogOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        const confirmed = window.confirm(`${title}\n\n${message}`);
        resolve(confirmed);
      });
    },
    alert: (title: string, message: string): Promise<void> => {
      return new Promise((resolve) => {
        window.alert(`${title}\n\n${message}`);
        resolve();
      });
    },
  };

  toast = {
    success: (title: string, message: string): void => {
      console.log(`[SUCCESS] ${title}: ${message}`);
      // Implementar toast real aqui (ex: PrimeNG Toast, ngx-toastr, etc)
    },
    error: (title: string, message: string): void => {
      console.error(`[ERROR] ${title}: ${message}`);
      // Implementar toast real aqui
    },
    warn: (title: string, message: string): void => {
      console.warn(`[WARN] ${title}: ${message}`);
      // Implementar toast real aqui
    },
    info: (title: string, message: string): void => {
      console.info(`[INFO] ${title}: ${message}`);
      // Implementar toast real aqui
    },
  };
}

