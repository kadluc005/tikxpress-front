import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  status: 'actif' | 'terminé' | 'brouillon';
  ticketsSold: number;
  totalCapacity: number;
}
@Component({
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatChipsModule],
  templateUrl: './myevents.component.html',
  styleUrl: './myevents.component.scss'
})
export class MyeventsComponent {

  events: Event[] = [
    {
      id: 1,
      title: 'Concert Jazz',
      date: '15/06/2023',
      location: 'Paris',
      status: 'actif',
      ticketsSold: 124,
      totalCapacity: 200
    },
    {
      id: 2,
      title: 'Festival Rock',
      date: '22/07/2023',
      location: 'Lyon',
      status: 'actif',
      ticketsSold: 356,
      totalCapacity: 500
    },
    {
      id: 3,
      title: 'Exposition Art Moderne',
      date: '05/05/2023',
      location: 'Marseille',
      status: 'terminé',
      ticketsSold: 89,
      totalCapacity: 150
    },
    {
      id: 4,
      title: 'Conférence Technologie',
      date: '12/08/2023',
      location: 'Toulouse',
      status: 'brouillon',
      ticketsSold: 0,
      totalCapacity: 100
    }
  ];

  constructor(private router: Router){}

  getStatusColor(status: string): string {
    switch(status) {
      case 'actif': return 'primary';
      case 'terminé': return 'warn';
      case 'brouillon': return 'accent';
      default: return '';
    }
  }

  viewEventDetails(eventId: number): void {
    this.router.navigate(['/organizer/events', eventId]);
  }

  createNewEvent(): void {
    this.router.navigate(['/organizer/events/new']);
  }

  getProgressValue(event: Event): number {
    return (event.ticketsSold / event.totalCapacity) * 100;
  }

}
