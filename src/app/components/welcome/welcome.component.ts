import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterLink],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  featuredEvents = [
    {
      id: 1,
      title: 'Concert Symphonique',
      date: '15 DÉC 2023',
      location: 'Opéra National',
      price: 45,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0WzsqDruDfZRESuGoUJX3DPf3HXLg1V3INA&s'
    },
    {
      id: 2,
      title: 'Festival International',
      date: '20-22 JAN 2024',
      location: 'Parc des Expositions',
      price: 120,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMTSAcWmBte83EDAWvj68LGt9GJrEaBSH7Tg&s'
    },
    {
      id: 3,
      title: 'Pièce de Théâtre',
      date: '5 FÉV 2024',
      location: 'Théâtre Municipal',
      price: 35,
      image: 'https://pbs.twimg.com/media/FYxdytoXkAAZbkK.jpg:large'
    }
  ];

  constructor( private router: Router ) {}

  navigateToEvent(eventId: number) {
    this.router.navigate(['/event', eventId]);
  }
  

}
