import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterDto } from '../../models/user';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  userRole: string = localStorage.getItem('userRole') ?? '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authSevice: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        companyName: [''],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]], // Nouveau champ
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        acceptTerms: [false, [Validators.requiredTrue]],
      },
      { validator: this.passwordMatchValidator }
    );

    if (this.userRole === 'organisateur') {
      this.registerForm
        .get('companyName')
        ?.setValidators([Validators.required]);
      this.registerForm.get('companyName')?.updateValueAndValidity();
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const formdata: RegisterDto = {
      nom: this.registerForm.value.firstName,
      prenom: this.registerForm.value.lastName,
      nomEntreprise: this.registerForm.value.companyName,
      email: this.registerForm.value.email,
      tel: this.registerForm.value.phoneNumber,
      password: this.registerForm.value.password,
    };
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simulation d'une requête API
    setTimeout(() => {
      const { email } = this.registerForm.value;

      // Vérification fictive si l'email existe déjà
      if (email === 'existant@example.com') {
        this.errorMessage = 'Cet email est déjà utilisé';
      } else {
        console.log('Formulaire soumis avec succès:', this.registerForm.value);
        this.authSevice.register(formdata, this.userRole).subscribe({
          next: (response) => {
            console.log("Réponse de l'API:", response);
            this.successMessage = 'Inscription réussie ! Redirection...';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (error) => {
            this.errorMessage =
              "Erreur lors de l'inscription. Veuillez réessayer.";
            console.error("Erreur d'inscription:", error);
          },
        });
      }

      this.isLoading = false;
    }, 1500);
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
  get acceptTerms() {
    return this.registerForm.get('acceptTerms');
  }
  get companyName() {
    return this.registerForm.get('companyName');
  }
  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }
}
