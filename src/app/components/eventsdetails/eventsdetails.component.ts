import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { EventsService } from '../../services/events.service';
import { BilletsService } from '../../services/billets.service';
import { Event } from '../../models/event';
import { TypeBillets } from '../../models/type-billets';
import { MapComponent } from '../map/map.component';
import 'boxicons';
import { CommandesService } from '../../services/commandes.service';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { EmailModalComponent } from '../email-modal/email-modal.component';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment.development';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-eventsdetails',
  imports: [
    CommonModule,
    NavbarComponent,
    MatIconModule,
    FooterComponent,
    MapComponent,
    PaymentModalComponent,
    EmailModalComponent,
  ],
  templateUrl: './eventsdetails.component.html',
  styleUrl: './eventsdetails.component.scss',
})
export class EventsdetailsComponent implements OnInit {
  event: Event = null!;
  eventId!: number;
  billets: TypeBillets[] = [];
  token: string = localStorage.getItem('token') || '';

  selectedTickets: { [libelle: string]: number } = {};

  // payment modal
  paymentModalVisible = false;
  selectedPaymentMethod: string | null = null;

  // email modal
  emailModalVisible = false;
  email: string = '';
  userId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private billetsService: BilletsService,
    private commandeService: CommandesService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  getUserEmail() {
    const user = this.authService.getCurrentUser();
    this.email = user && user.email ? user.email : '';
    return this.email;
  }

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
    const cleanFilename = filename.startsWith('/')
      ? filename.slice(1)
      : filename;
    const url = environment.BASE_API_URL + cleanFilename;
    console.log('Image URL:', url);
    return url;
  }

  getEventBillet(id: number): void {
    this.billetsService.findEventBillet(id).subscribe((billets) => {
      this.billets = billets;
    });
  }
  selectTicketType(type: string): void {
    const billet = this.billets.find((b) => b.libelle === type);
    if (!billet || billet.quantite <= 0) return;

    if (!this.selectedTickets[type]) {
      this.selectedTickets[type] = 1;
    }
  }

  incrementQuantity(type: string): void {
    const billet = this.billets.find((b) => b.libelle === type);
    if (!billet) return;
    if (this.selectedTickets[type] < billet.quantite) {
      this.selectedTickets[type]++;
      console.log(this.selectedTickets[type]);
    }
  }

  decrementQuantity(type: string): void {
    if (this.selectedTickets[type] > 1) {
      this.selectedTickets[type]--;
      console.log(this.selectedTickets[type]);
    } else {
      delete this.selectedTickets[type];
    }
  }

  getTicketQuantity(type: string): number {
    return this.selectedTickets[type] || 0;
  }
  updateTypeBilletQuantity(type: string, quantity: number): void {
    const billet = this.billets.find((b) => b.libelle === type);
    if (!billet) return;
    this.billetsService
      .updateBillet(this.token, billet.id, {
        quantiteRestante: quantity,
      })
      .subscribe({
        next: () => {
          console.log(`Quantité du billet "${type}" mise à jour à ${quantity}`);
        },
        error: (err) => {
          console.error(
            `Erreur lors de la mise à jour du billet "${type}" :`,
            err
          );
        },
      });
    console.log(billet);
  }
  get selectedTicketList() {
    return Object.entries(this.selectedTickets).map(([libelle, quantite]) => {
      const billet = this.billets.find((b) => b.libelle === libelle);
      return {
        libelle,
        quantite,
        prixUnitaire: billet?.prix,
        total: (billet?.prix ?? 0) * quantite,
      };
    });
  }

  get totalPrice() {
    return this.selectedTicketList.reduce((acc, item) => acc + item.total, 0);
  }

  bookTickets(): void {
    this.paymentModalVisible = true;
  }

  onPaymentSelected(method: string): void {
    this.selectedPaymentMethod = method;
    this.emailModalVisible = true;
  }

  onEmailSubmitted(email: string) {
    this.email = email;
    this.confirmBooking();
  }

  confirmBooking(): void {
    this.commandeService
      .createCommande(this.token, {
        billets: [],
        date: new Date(),
        prix_total: this.totalPrice,
      })
      .subscribe({
        next: (commande) => {
          const billetRequests = this.selectedTicketList
            .map((item) => {
              const billet = this.billets.find(
                (b) => b.libelle === item.libelle
              );
              if (!billet?.id) return null;

              this.updateTypeBilletQuantity(
                billet.libelle,
                billet.quantite - item.quantite
              );

              return {
                billetData: {
                  type: billet.id,
                  commande: commande.id,
                },
                email: this.email || '',
                prix_total: this.totalPrice,
              };
            })
            .filter(
              (
                dto
              ): dto is {
                billetData: { type: number; commande: number };
                email: string;
                prix_total: number;
              } => dto !== null
            );

          Promise.all(
            billetRequests.map((dto) =>
              this.billetsService.bookBillet(this.token, dto).toPromise()
            )
          )
            .then(() => {
              // alert(`Réservation confirmée avec ${this.selectedPaymentMethod} !\nTotal: ${this.totalPrice} F CFA`);
              this.alertService.show({
                message: `Réservation confirmée avec ${this.selectedPaymentMethod} !\nTotal: ${this.totalPrice} F CFA`,
                type: 'success',
                duration: 5000,
              });
              this.router.navigate(['/events']);
            })
            .catch((error) => {
              // alert("Erreur lors de la réservation des billets.");
              this.alertService.showApiError(error);
            });
        },
        error: (err) => {
          // alert("Erreur lors de la création de la commande.");
          this.alertService.showApiError(err);
        },
      });
  }

  getEventDuration(event: any): string {
    const debut = new Date(event.date_debut);
    const fin = new Date(event.date_fin);
    const diffMs = fin.getTime() - debut.getTime();

    const diffJ = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffH = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const diffMin = Math.floor((diffMs / (1000 * 60)) % 60);

    const parts = [];
    if (diffJ >= 0) parts.push(`${diffJ}j`);
    if (diffH >= 0) parts.push(`${diffH}h`);
    if (diffMin >= 0) parts.push(`${diffMin}min`);

    return parts.join(' ');
  }
}
