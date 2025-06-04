import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(
    private router: Router,
    private alertService: AlertService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Ne pas gérer les erreurs 401 pour les requêtes d'authentification
        const isAuthRequest = request.url.includes('auth') || request.url.includes('login');
        
        if (error.status === 401 && !isAuthRequest) {
          this.handleUnauthorized();
        } else if (error.status === 403) {
          this.handleForbidden();
        } else if (error.status === 404) {
          this.handleNotFound(request);
        } else if (error.status >= 500) {
          this.handleServerError(error);
        } else {
          this.alertService.showApiError(error);
        }

        return throwError(error);
      })
    );
  }

  private handleUnauthorized(): void {
    // Vous pourriez rediriger vers la page de login ici
    this.alertService.error('Session expirée - Veuillez vous reconnecter');
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

  private handleForbidden(): void {
    this.alertService.error('Accès refusé - Permissions insuffisantes');
    // this.router.navigate(['/access-denied']);
  }

  private handleNotFound(request: HttpRequest<unknown>): void {
    // Ne pas rediriger pour les API calls, seulement pour les routes
    if (request.url.startsWith('http')) {
      this.alertService.error('Ressource introuvable');
    } else {
      this.router.navigate(['/not-found'], { 
        state: { attemptedUrl: request.url } 
      });
    }
  }

  private handleServerError(error: HttpErrorResponse): void {
    const message = error.status === 503 
      ? 'Service temporairement indisponible' 
      : 'Erreur interne du serveur';
    
    this.alertService.error(message, { 
      duration: 0, // Message persistant pour les erreurs critiques
      action: 'Réessayer'
    });
  }
}