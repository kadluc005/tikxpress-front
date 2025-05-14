import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  user: User | null = null

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.minLength(6)]]
      password: ['', [Validators.required, ]]
    })
  }

  onSubmit(): void{
    
    if(this.loginForm.invalid){
      return;
    }

    this.user = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }

    this.authService.login(this.user).subscribe({
      next: (response) => {
        // localStorage.setItem('isLoggedIn', 'true');
        const token = response.access_token;
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = `Email ou mot de passe incorrect ${error}}`;
      }

    })
    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      // const { email, password } = this.loginForm.value;
      
      // if (email === 'admin@example.com' && password === 'password123') {
      //   // Connexion réussie
      //   localStorage.setItem('isLoggedIn', 'true');
      //   this.router.navigate(['/']);
      // } else {
      //   this.errorMessage = 'Email ou mot de passe incorrect';
      // }
      
      this.isLoading = false;
    }, 1500);
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  

}
