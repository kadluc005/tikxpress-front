import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-eventslist',
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './eventslist.component.html',
  styleUrl: './eventslist.component.scss',
})
export class EventslistComponent {
  searchQuery = '';
  events: Event[] = [
    {
      id: 1,
      title: 'Concert Symphonique',
      date: '15 DÉC 2023 - 20h00',
      location: 'Opéra National, Paris',
      price: 45,
      image: 'https://pbs.twimg.com/media/Fkl7tDQWIAAWTzo.jpg',
      category: 'Musique',
      description:
        'Orchestre philharmonique avec les plus grandes œuvres classiques',
    },
    {
      id: 2,
      title: 'Festival International',
      date: '20-22 JAN 2024',
      location: 'Parc des Expositions, Lyon',
      price: 120,
      image:
        'https://www.toulouseblog.fr/wp-content/uploads/2023/06/fave%CC%81-toulouse-1024x536.png',
      category: 'Festival',
      description: '3 jours de musique, art et gastronomie',
    },
    {
      id: 3,
      title: 'Pièce de Théâtre Classique',
      date: '5 FÉV 2024 - 19h30',
      location: 'Théâtre Municipal, Marseille',
      price: 35,
      image:
        'https://www.totaalrez.com/wp-content/uploads/2024/10/ninho-niska-fb-concert-rap-lyon-a-voir-740x416.jpg',
      category: 'Théâtre',
      description: 'Représentation exclusive des "Fourberies de Scapin"',
    },
    {
      id: 4,
      title: 'Exposition Contemporaine',
      date: '10 MAR 2024',
      location: "Musée d'Art Moderne, Lille",
      price: 25,
      image:
        'https://woody.cloudly.space/app/uploads/lille-tourisme/2023/11/thumbs/Palais-des-Beaux-Arts-PBA-Lille-Laurent-Javoy-69-min-1920x960-crop-1699523255.jpg',
      category: 'Art',
      description: 'Rétrospective des artistes émergents européens',
    },
    {
      id: 5,
      title: 'Conférence Technologique',
      date: '8 AVR 2024 - 09h00',
      location: 'Centre de Congrès, Toulouse',
      price: 80,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5idlCUTgQbZrHag9ib3QGQwEjq-5wAN3nCQ&s',
      category: 'Conférence',
      description: 'Les dernières innovations en intelligence artificielle',
    },
    {
      id: 6,
      title: 'Match de Football',
      date: '12 MAI 2024 - 17h00',
      location: 'Stade Municipal, Bordeaux',
      price: 55,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGFkbjzQKhPNgUSM9fozzRQYh9VRSDRgb8vQ&s',
      category: 'Sport',
      description: 'Match de championnat entre équipes locales',
    },
  ];

  categories: string[] = [
    'Tous',
    'Musique',
    'Festival',
    'Théâtre',
    'Art',
    'Conférence',
    'Sport',
  ];
  selectedCategory = 'Tous';


  constructor(private router: Router) {}

  // get filteredEvents(): Event[] {
  //   if (this.selectedCategory === 'Tous') {
  //     return this.events;
  //   }
  //   return this.events.filter(
  //     (event) => event.category === this.selectedCategory
  //   );
  // }

  
  get filteredEvents(): Event[] {
    let events = this.events;

    // Filtre par catégorie
    if (this.selectedCategory !== 'Tous') {
      events = events.filter(event => event.category === this.selectedCategory);
    }

    // Filtre par recherche
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      events = events.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query))
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
