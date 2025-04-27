import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  stats = [
    { 
      title: 'Événements en cours', 
      value: 5, 
      route: '/admin/events/current',
      icon: 'event',
      color: 'primary'
    },
    { 
      title: 'Tickets en cours', 
      value: 128, 
      route: '/admin/tickets',
      icon: 'confirmation_number',
      color: 'accent'
    },
    { 
      title: 'Complétion du profil', 
      value: '40%', 
      route: '/admin/profile',
      icon: 'account_circle',
      color: 'warn'
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}

