import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlertComponent } from '../components/alert/alert.component';



export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertOptions {
  message: string;
  type?: AlertType;
  duration?: number;
  action?: string;
  verticalPosition?: 'top' | 'bottom';
  horizontalPosition?: 'start' | 'center' | 'end';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private snackBar: MatSnackBar) {}

  show(options: AlertOptions): void {
    const config: MatSnackBarConfig = {
      duration: options.duration || 5000,
      panelClass: `alert-${options.type || 'info'}`,
      verticalPosition: options.verticalPosition || 'top',
      horizontalPosition: options.horizontalPosition || 'center',
      data: {
        message: options.message,
        type: options.type || 'info',
        action: options.action
      }
    };

    this.snackBar.openFromComponent(AlertComponent, config);
  }

  showApiError(error: any, defaultMessage?: string): void {
    let message = defaultMessage || 'Une erreur est survenue';
    let type: AlertType = 'error';

    if (error?.status) {
      switch (error.status) {
        case 400:
          message = error.error?.message || 'Requête incorrecte';
          break;
        case 401:
          message = 'Non autorisé - Veuillez vous connecter';
          break;
        case 403:
          message = 'Accès refusé - Permissions insuffisantes';
          break;
        case 404:
          message = error.error?.message || 'Ressource introuvable';
          break;
        case 409:
          message = error.error?.message || 'Conflit de données';
          break;
        case 422:
          message = error.error?.message || 'Erreur de validation';
          type = 'warning';
          break;
        case 500:
          message = 'Erreur interne du serveur';
          break;
        case 503:
          message = 'Service temporairement indisponible';
          break;
        default:
          message = error.error?.message || `Erreur ${error.status}`;
      }
    } else if (error?.message) {
      message = error.message;
    }

    this.show({ message, type });
  }

  success(message: string, options?: Partial<AlertOptions>): void {
    this.show({ ...options, message, type: 'success' });
  }

  error(message: string, options?: Partial<AlertOptions>): void {
    this.show({ ...options, message, type: 'error' });
  }

  warning(message: string, options?: Partial<AlertOptions>): void {
    this.show({ ...options, message, type: 'warning' });
  }

  info(message: string, options?: Partial<AlertOptions>): void {
    this.show({ ...options, message, type: 'info' });
  }
}
