import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { Event } from '../../models/event';
import { EventsService } from '../../services/events.service';
import { MatButtonModule } from '@angular/material/button';


@Component({
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatChipsModule, MatButtonModule],
  templateUrl: './myevents.component.html',
  styleUrl: './myevents.component.scss'
})
export class MyeventsComponent implements OnInit {


  events : Event[] = [];
  token : string = localStorage.getItem('token') || '';

  constructor(private router: Router, private eventsService: EventsService){}
  ngOnInit(): void {
    this.loadMyEvents();
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'actif': return 'primary';
      case 'terminé': return 'warn';
      case 'brouillon': return 'accent';
      default: return '';
    }
  }

  loadMyEvents(): void {
    this.eventsService.getOrganizerEvents(this.token).subscribe({
      next: (events: Event[]) => {
        this.events = events;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        alert(error.message)
      },
    })
    
  }

  viewEventDetails(eventId: number): void {
    this.router.navigate(['admin/event/', eventId]);
  }

  createNewEvent(): void {
    this.router.navigate(['/admin/events/create']);
  }

  getProgressValue(event: Event): number {
    return (event.id / event.id) * 100;
  }

}
