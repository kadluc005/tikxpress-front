import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { EventsService } from '../../services/events.service';
import { BilletsService } from '../../services/billets.service';
import { Event } from '../../models/event';
import { TypeBillets } from '../../models/type-billets';

interface Eventa {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  price: number;
  image: string;
  category: string;
  description: string;
  duration: string;
  organizer: string;
  rating: number;
  tickets: {
    category: string;
    price: number;
    available: number;
    benefits: string[];
  }[];
}

@Component({
  selector: 'app-eventsdetails',
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './eventsdetails.component.html',
  styleUrl: './eventsdetails.component.scss',
})
export class EventsdetailsComponent implements OnInit {
  event: Event = null ! ;
  eventId!: number;
  billets: TypeBillets[] = []
  event1: Eventa = {
    id: 1,
    title: 'Concert Symphonique',
    date: '15 Décembre 2023',
    time: '20h00',
    location: 'Opéra National',
    address: "Place de l'Opéra, 75009 Paris",
    price: 45,
    image:
      'https://cdn.tikerama.com/images/IQR1cEqDg0Et7QkEclduUpWj9GkEueVMYHUIWq6C.jpg',
    category: 'Musique',
    description:
      "Vivez une expérience musicale exceptionnelle avec l'Orchestre Philharmonique de Paris interprétant les plus grandes œuvres de Mozart, Beethoven et Tchaïkovski. Sous la direction du célèbre chef d'orchestre Jean Dupont, ce concert promet une soirée inoubliable dans le cadre prestigieux de l'Opéra National.",
    duration: '2h avec entracte de 20min',
    organizer: 'Association Culturelle Parisienne',
    rating: 4.8,
    tickets: [
      {
        category: 'Standard',
        price: 45,
        available: 124,
        benefits: ['Place en gradin', 'Accès libre au vestiaire'],
      },
      {
        category: 'Premium',
        price: 75,
        available: 42,
        benefits: [
          'Place en orchestre',
          'Programme offert',
          'Accès prioritaire',
        ],
      },
      {
        category: 'VIP',
        price: 120,
        available: 15,
        benefits: [
          'Place au premier rang',
          'Accès lounge VIP',
          'Rencontre avec les artistes',
          'Cadeau souvenir',
        ],
      },
      {
        category: 'Étudiant',
        price: 30,
        available: 36,
        benefits: ['Place en gradin', 'Sur présentation de carte'],
      },
    ],
  };


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
        if(id){
          this.eventId = id;
          this.getEventById(id);
          this.getEventBillet(id);
        }
      })
  }

  getEventById(id: number): void {
    this.eventsService.getEventById(id).subscribe((event) => {
      this.event = event;
    })
  }

  getEventBillet(id: number): void {
    // id = this.event.id;
    // console.log(id);
    this.billetsService.findEventBillet(id).subscribe((billets) => {
      this.billets = billets;
    })
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
    return this.billets.find(
      (t) => t.libelle === this.selectedTicketType
    );
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
