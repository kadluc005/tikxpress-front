import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { TypeBillets } from '../../models/type-billets';
import { BilletsService } from '../../services/billets.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Event } from '../../models/event';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { EditEventModalComponent } from '../edit-event-modal/edit-event-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-event-detail',
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-event-detail.component.html',
  styleUrl: './admin-event-detail.component.scss',
})
export class AdminEventDetailComponent implements OnInit {
  editEvent() {
    this.eventsService.getEventById(this.eventId).subscribe({
    next: (event) => {
      this.openEditModal(event);
    },
    error: (err) => {
      console.error('Erreur récupération événement :', err);
    },
  });
  }
  deleteEvent() {
    throw new Error('Method not implemented.');
  }

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private billetsService: BilletsService,
    private dialog: MatDialog
  ) {}

  event: Event = null!;
  eventId!: number;
  billets: TypeBillets[] = [];
  token: string = localStorage.getItem('token') || '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      const id = Number(param.get('id'));
      if (id) {
        this.eventId = id;
        this.getEventById(id);
        this.getEventBillet(id);
      }
    });
  }

  getEventById(id: number): void {
    this.eventsService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
      },
      error: (err) => {
        console.error('Erreur récupération événement :', err);
      },
    });
  }
  getImageUrl(filename: string): string {
    return 'http://localhost:3000' + filename;
  }

  getEventBillet(id: number): void {
    // id = this.event.id;
    // console.log(id);
    this.billetsService.findEventBillet(id).subscribe({
      next: (billets) => {
        this.billets = billets;
      },
      error: (err) => {
        console.error('Erreur récupération billets :', err);
      },
    });
  }

  openEditModal(event: any) {
    const dialogRef = this.dialog.open(EditEventModalComponent, {
      width: '90%',
      data: event,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Tu récupères les données modifiées ici
        console.log('Données modifiées :', result);
      }
    });
  }
}
