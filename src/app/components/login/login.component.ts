import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  user: User | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.minLength(6)]]
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.user = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.authService.login(this.user).subscribe({
      next: (response) => {
        // localStorage.setItem('isLoggedIn', 'true');
        if (!response || !response.access_token) {
          this.isLoading = false;
          this.errorMessage = 'Email ou mot de passe incorrect.';
          return;
        }
        const token = response.access_token;
        localStorage.setItem('token', token);
        const tokenPayload = this.decodeToken(token);
        const userId = tokenPayload.sub;

        this.getUserRole(userId);
        setTimeout(() => {
          if (localStorage.getItem('userRole') === 'organisateur') {
            this.router.navigate(['/admin/my-events']);
          } else {
            this.router.navigate(['/']);
          }
          this.isLoading = false;
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Une erreur est survenue. Réessayez.';
        console.error('Erreur login :', error);
      },
    });
  }

  getUserRole(userId: number) {
    return this.authService.getUserRoles(userId).subscribe({
      next: (response) => {
        response.forEach((role) => {
          if (role.nom === 'organisateur') {
            localStorage.setItem('userRole', role.nom);
          } else {
            localStorage.setItem('userRole', role.nom);
          }
        });
      },
      error: (error) => {
        console.error(
          "Erreur lors de la récupération des rôles de l'utilisateur:",
          error
        );
      },
    });
  }

  //décode le token JWT pour récupérer le payload
  // et extraire l'ID de l'utilisateur
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
    }
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
