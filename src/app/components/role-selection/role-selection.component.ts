import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-selection',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.scss'
})
export class RoleSelectionComponent {

  constructor(private router: Router) {}  

  selectRole(role: 'client' | 'organisateur'): void {
    // Enregistrer le choix dans le localStorage
    localStorage.setItem('userRole', role);
    
    // Rediriger vers la page appropriée
    if (role === 'client') {
      this.router.navigate(['/register']);
    } else {
      this.router.navigate(['/register']);
    }
  }

}
