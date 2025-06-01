import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profil',
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss',
})
export class ProfilComponent {
  user = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    isOrganizer: false, // Ajouté pour gérer l'affichage du bouton organisateur
  };

  showTickets = false;

  tickets = [
    {
      concertName: 'Festival Rock en Seine',
      date: '2023-08-25',
      location: 'Paris',
      downloaded: false,
    },
    {
      concertName: 'DJ Snake World Tour',
      date: '2023-09-12',
      location: 'Lyon',
      downloaded: false,
    },
    {
      concertName: 'Stromae - Multitude Tour',
      date: '2023-10-05',
      location: 'Marseille',
      downloaded: true,
    },
  ];

  toggleTickets() {
    this.showTickets = !this.showTickets;
  }

  downloadTicket(ticket: any) {
    ticket.downloaded = true;
    console.log(`Téléchargement du billet pour ${ticket.concertName}`);
  }

  manageEvents() {
    // Navigation vers la gestion des événements
    console.log('Redirection vers la gestion des événements');
    // this.router.navigate(['/manage-events']);
  }
}
