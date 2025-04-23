import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private router: Router
  ){
    this.loginForm = this.fb.group({
      emai: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit(): void{
    if(this.loginForm.invalid){
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      const { email, password } = this.loginForm.value;
      
      if (email === 'admin@example.com' && password === 'password123') {
        // Connexion réussie
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/']);
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
      
      this.isLoading = false;
    }, 1500);
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  

}
