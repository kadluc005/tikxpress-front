import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-eventslist',
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './eventslist.component.html',
  styleUrl: './eventslist.component.scss',
})
export class EventslistComponent {
  searchQuery = '';
  events: Event[] = [];

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

  getImageUrl(filename: string): string {
    return 'http://localhost:3000' + filename;
  }

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
