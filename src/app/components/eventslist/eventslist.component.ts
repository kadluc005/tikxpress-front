import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';

// interface Event {
//   id: number;
//   title: string;
//   date: string;
//   location: string;
//   price: number;
//   image: string;
//   category: string;
//   description: string;
// }

@Component({
  selector: 'app-eventslist',
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './eventslist.component.html',
  styleUrl: './eventslist.component.scss',
})
export class EventslistComponent {
  searchQuery = '';
  events: Event[] = [];
  // events2: Event[] = [
  //   {
  //     "id": 1,
  //     "nom": "Concert Symphonique",
  //     "description": "Orchestre philharmonique avec les plus grandes œuvres classiques",
  //     "type": "Musique",
  //     "date_debut": new Date("2023-12-15T20:00:00.000Z"), // Convert string to Date
  //     "date_fin": new Date("2023-12-15T23:00:00.000Z"),   // Convert string to Date
  //     "lieu": "Opéra National, Paris",
  //     "image_url": "https://pbs.twimg.com/media/Fkl7tDQWIAAWTzo.jpg",
  //     "is_active": true,
  //     "is_visible": true,
  //     "created_at": new Date("2023-11-01T00:00:00.000Z"),
  //     "updated_at": new Date("2023-11-15T00:00:00.000Z")
  //   },
  //   {
  //     "id": 2,
  //     "nom": "Festival International",
  //     "description": "3 jours de musique, art et gastronomie",
  //     "type": "Festival",
  //     "date_debut": new Date("2024-01-20T00:00:00.000Z"),
  //     "date_fin": new Date("2024-01-22T23:59:00.000Z"),
  //     "lieu": "Parc des Expositions, Lyon",
  //     "image_url": "https://www.toulouseblog.fr/wp-content/uploads/2023/06/fave%CC%81-toulouse-1024x536.png",
  //     "is_active": true,
  //     "is_visible": true,
  //     "created_at": new Date("2023-10-01T00:00:00.000Z"),
  //     "updated_at": new Date("2023-12-01T00:00:00.000Z")
  //   },
  //   {
  //     "id": 3,
  //     "nom": "Pièce de Théâtre Classique",
  //     "description": "Représentation exclusive des 'Fourberies de Scapin'",
  //     "type": "Théâtre",
  //     "date_debut": new Date("2024-02-05T19:30:00.000Z"),
  //     "date_fin": new Date("2024-02-05T22:00:00.000Z"),
  //     "lieu": "Théâtre Municipal, Marseille",
  //     "image_url": "https://www.totaalrez.com/wp-content/uploads/2024/10/ninho-niska-fb-concert-rap-lyon-a-voir-740x416.jpg",
  //     "is_active": true,
  //     "is_visible": true,
  //     "created_at": new Date("2023-11-15T00:00:00.000Z"),
  //     "updated_at": new Date("2024-01-10T00:00:00.000Z")
  //   },
  //   {
  //     "id": 4,
  //     "nom": "Exposition Contemporaine",
  //     "description": "Rétrospective des artistes émergents européens",
  //     "type": "Art",
  //     "date_debut": new Date("2024-03-10T00:00:00.000Z"),
  //     "date_fin": new Date("2024-03-10T23:59:00.000Z"),
  //     "lieu": "Musée d'Art Moderne, Lille",
  //     "image_url": "https://woody.cloudly.space/app/uploads/lille-tourisme/2023/11/thumbs/Palais-des-Beaux-Arts-PBA-Lille-Laurent-Javoy-69-min-1920x960-crop-1699523255.jpg",
  //     "is_active": true,
  //     "is_visible": true,
  //     "created_at": new Date("2023-12-01T00:00:00.000Z"),
  //     "updated_at": new Date("2024-02-15T00:00:00.000Z")
  //   },
  //   {
  //     "id": 5,
  //     "nom": "Conférence Technologique",
  //     "description": "Les dernières innovations en intelligence artificielle",
  //     "type": "Conférence",
  //     "date_debut": new Date("2024-04-08T09:00:00.000Z"),
  //     "date_fin": new Date("2024-04-08T17:00:00.000Z"),
  //     "lieu": "Centre de Congrès, Toulouse",
  //     "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5idlCUTgQbZrHag9ib3QGQwEjq-5wAN3nCQ&s",
  //     "is_active": true,
  //     "is_visible": true,
  //     "created_at": new Date("2024-01-15T00:00:00.000Z"),
  //     "updated_at": new Date("2024-03-01T00:00:00.000Z")
  //   },
  //   {
  //     "id": 6,
  //     "nom": "Match de Football",
  //     "description": "Match de championnat entre équipes locales",
  //     "type": "Sport",
  //     "date_debut": new Date("2024-05-12T17:00:00.000Z"),
  //     "date_fin": new Date("2024-05-12T19:00:00.000Z"),
  //     "lieu": "Stade Municipal, Bordeaux",
  //     "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGFkbjzQKhPNgUSM9fozzRQYh9VRSDRgb8vQ&s",
  //     "is_active": true,
  //     "is_visible": true,
  //     "created_at": new Date("2024-02-01T00:00:00.000Z"),
  //     "updated_at": new Date("2024-04-15T00:00:00.000Z")
  //   }
  // ];

  categories: string[] = [
    'Tous',
    'Musique',
    'Concert',
    'Festival',
    'Théâtre',
    'Art',
    'Conférence',
    'Sport',
  ];
  selectedCategory = 'Tous';


  constructor(private router: Router, private eventsService: EventsService) {}

  // get filteredEvents(): Event[] {
  //   if (this.selectedCategory === 'Tous') {
  //     return this.events;
  //   }
  //   return this.events.filter(
  //     (event) => event.category === this.selectedCategory
  //   );
  // }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventsService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements', err);
      }
    });
  }

  
  get filteredEvents(): Event[] {
    let events = this.events;

    // Filtre par catégorie
    if (this.selectedCategory !== 'Tous') {
      events = events.filter(event => event.type === this.selectedCategory);
    }

    // Filtre par recherche
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      events = events.filter(event => 
        event.nom.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query) ||
        event.lieu.toLowerCase().includes(query))
    }

    return events;
  }


  applyFilters(): void {
    // Cette méthode est appelée à chaque changement de la recherche
    // Le filtrage est déjà géré par le getter filteredEvents
  }

  navigateToEvent(eventId: number): void {
    this.router.navigate(['/event', eventId]);
  }
}
