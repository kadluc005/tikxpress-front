import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { EventsService } from '../../services/events.service';
import { BilletsService } from '../../services/billets.service';
import { Event } from '../../models/event';
import { TypeBillets } from '../../models/type-billets';
import { MapComponent } from '../map/map.component';


@Component({
  selector: 'app-eventsdetails',
  imports: [CommonModule, NavbarComponent, FooterComponent, MapComponent],
  templateUrl: './eventsdetails.component.html',
  styleUrl: './eventsdetails.component.scss',
})
export class EventsdetailsComponent implements OnInit {
  event: Event = null!;
  eventId!: number;
  billets: TypeBillets[] = [];
  map: MapComponent | null = null;

  selectedTicketType: string | null = null;
  ticketQuantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private billetsService: BilletsService
  ) {}

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
    this.eventsService.getEventById(id).subscribe((event) => {
      this.event = event;
    });
  }
  getImageUrl(filename: string): string {
    return 'http://localhost:3000' + filename;
  }


  getEventBillet(id: number): void {
    // id = this.event.id;
    // console.log(id);
    this.billetsService.findEventBillet(id).subscribe((billets) => {
      this.billets = billets;
    });
  }
  selectTicketType(type: string): void {
    this.selectedTicketType = type;
    this.ticketQuantity = 1;
  }

  incrementQuantity(): void {
    this.ticketQuantity += 1;
  }

  decrementQuantity(): void {
    if (this.ticketQuantity > 1) {
      this.ticketQuantity -= 1;
    }
  }

  get selectedTicket() {
    return this.billets.find((t) => t.libelle === this.selectedTicketType);
  }

  get totalPrice() {
    if (!this.selectedTicket) return 0;
    return this.selectedTicket.prix * this.ticketQuantity;
  }

  bookTickets(): void {
    alert(
      `Réservation confirmée pour ${this.ticketQuantity} place(s) ${this.selectedTicketType}`
    );
    // Normalement, ici on redirigerait vers un processus de paiement
  }

  getEventDuration(event: any): string {
    const debut = new Date(event.date_debut);
    const fin = new Date(event.date_fin);
    const diffMs = fin.getTime() - debut.getTime();

    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMin = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffH === 0) {
      return `${diffMin} min`;
    } else {
      return `${diffH}h ${diffMin}min`;
    }
  }
}
