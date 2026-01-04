import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeyValuePair } from '@app/models/key-value-pair';
import { UiService } from '@app/core/services/ui.service';

export interface CanDeactivateComponent {
  canDeactivate(): Promise<boolean>;
}

export class ComponentBase implements CanDeactivateComponent {
  isDirty = false;

  public readonly ui = inject(UiService);
  public readonly router = inject(Router);

  onInputChange(value?: boolean): void {
    this.isDirty = value ?? true;
  }

  // Método do guard para verificar se há alterações não salvas
  canDeactivate(): Promise<boolean> {
    if (!this.isDirty) return Promise.resolve(true);

    return this.ui.dialog.confirm(
      'Alterações não salvas!',
      'Você tem alterações não salvas. Deseja realmente sair?',
      {
        icon: 'pi pi-exclamation-triangle',
        acceptButtonProps: {
          label: 'Sim, sair',
          severity: 'primary',
        },
        rejectButtonProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true,
        },
      }
    );
  }

  getQuery(params: any): KeyValuePair[] {
    const ret = new Array<KeyValuePair>();
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) ret.push({ Key: key, Value: value });
    });

    return ret;
  }

  handleError(reason: any, callback?: () => void, router?: Router, showAlert = true) {
    if (!reason) return;

    if (this.handleValidationError(reason, callback)) return;
    if (this.handleUnauthorized(reason, router)) return;
    if (this.handleServerError(reason, callback)) return;
    if (this.handleNotFoundError(reason, callback, showAlert)) return;
    if (this.handleNotAcceptableError(reason, callback, showAlert)) return;

    this.ui.toast.error('Ops!', reason.message || reason.error?.detail || 'Erro desconhecido');
  }

  handleAuthError = (err: HttpErrorResponse) => {
    const info = this.classifyAuthError(err);

    this.router.navigate(['/ops/error'], {
      queryParams: {
        code: info.code,
        title: info.title,
        detail: info.detail,
      },
      replaceUrl: true,
    });
  };

  private handleUnauthorized(reason: any, router?: Router): boolean {
    if (reason.unauthorized) {
      this.ui.dialog.alert('Atenção!', 'Sua sessão expirou, você será redirecionado!').then(() => {
        if (router) router.navigate(['/auth']);
      });
      return true;
    }
    return false;
  }

  private handleServerError(reason: any, callback?: () => void): boolean {
    if (reason.error && reason.status == 500) {
      this.ui.toast.error(
        'Ops!',
        'Encontramos uma falha ao tentar realizar esta operação no momento.'
      );
      return true;
    }
    return false;
  }

  private handleNotFoundError(reason: any, callback?: () => void, showAlert = true): boolean {
    if (reason.status == 404 && showAlert) {
      this.ui.toast.warn('Aviso', 'Nenhum registro encontrado.');
      return true;
    }
    return false;
  }

  private handleNotAcceptableError(reason: any, callback?: () => void, showAlert = true): boolean {
    if (reason.status == 406 && showAlert) {
      const detailMessage = reason.error?.detail || reason.detail;
      if (detailMessage) {
        this.ui.toast.warn('Aviso', detailMessage);
        return true;
      }
    }
    return false;
  }

  private handleValidationError(reason: any, callback?: () => void): boolean {
    if (reason.error && reason.status == 422) {
      const errors = reason.error.errors;
      let errorMessage = '';

      errorMessage = '<ul>';
      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          errors[key].forEach((msg: string) => {
            errorMessage += `<li>${msg}</li>`;
          });
        }
      }
      errorMessage += '</ul>';
      this.ui.toast.warn(
        'Verifique as informações abaixo:',
        `<div style="text-align: justify; margin-left: 7rem;">${errorMessage}</div>`
      );

      return true;
    }
    return false;
  }

  private classifyAuthError(err: HttpErrorResponse): {
    code: string;
    title: string;
    detail: string;
  } {
    if (err.status === 0) {
      const msg = (err.message || '') + ' ' + (err.statusText || '');
      const refused = /ERR_CONNECTION_REFUSED|CONNECTION_REFUSED|NS_ERROR_CONNECTION_REFUSED/i.test(
        msg
      );
      const reset = /ERR_CONNECTION_RESET|CONNECTION_RESET/i.test(msg);

      if (!navigator.onLine) {
        return {
          code: 'OFFLINE',
          title: 'Sem conexão com a internet',
          detail: 'Verifique sua conexão e tente novamente.',
        };
      } else if (refused) {
        return {
          code: 'CONNECTION_REFUSED',
          title: 'Serviço de autenticação indisponível',
          detail:
            'Não foi possível conectar ao servidor de autenticação. Tente novamente em alguns instantes.',
        };
      } else if (reset) {
        return {
          code: 'CONNECTION_RESET',
          title: 'Conexão interrompida',
          detail: 'A conexão com o servidor foi interrompida. Tente novamente.',
        };
      } else {
        return {
          code: 'NETWORK_ERROR',
          title: 'Falha de rede',
          detail: 'Ocorreu um problema de rede ao contatar o servidor. Tente novamente.',
        };
      }
    }

    if (err.status === 400) {
      const desc =
        err.error?.error_description || 'Requisição inválida ao servidor de autenticação.';
      return { code: 'BAD_REQUEST', title: 'Solicitação inválida', detail: desc };
    }
    if (err.status === 401 || err.status === 403) {
      return {
        code: 'UNAUTHORIZED',
        title: 'Não autorizado',
        detail: 'Credenciais inválidas ou expiradas.',
      };
    }
    if (err.status >= 500) {
      return {
        code: 'SERVER_ERROR',
        title: 'Erro no servidor de autenticação',
        detail: 'Tente novamente mais tarde.',
      };
    }

    return {
      code: 'UNKNOWN',
      title: 'Erro desconhecido',
      detail: 'Ocorreu um erro inesperado durante a autenticação.',
    };
  }
}

