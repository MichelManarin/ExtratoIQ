import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { UiService } from '../services/ui.service';

export const globalHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const uiService = inject(UiService);

  loadingService.show();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      loadingService.hide();

      let errorMessage = 'Ocorreu um erro desconhecido';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Requisição inválida';
            break;
          case 401:
            errorMessage = 'Não autorizado. Por favor, faça login novamente.';
            break;
          case 403:
            errorMessage = 'Acesso negado';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            break;
          default:
            errorMessage = `Erro: ${error.message}`;
        }
      }

      uiService.toast.error('Erro', errorMessage);
      return throwError(() => error);
    })
  );
};

