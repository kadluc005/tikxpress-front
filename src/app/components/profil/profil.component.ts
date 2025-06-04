import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommandesService } from '../../services/commandes.service';

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
export class ProfilComponent implements OnInit{
  me: any = null;
  token: string = localStorage.getItem('token') || '';
  statut : string = localStorage.getItem('userRole') || '';
  user: any = undefined;
  constructor(private authService: AuthService, private router: Router, private commandService: CommandesService) {
    this.me = this.authService.getCurrentUserFromToken();
  }

  getUser(){
    this.authService.findUserById(this.token, this.me.sub).subscribe({
      next: (user) => {
        this.user = {
          id: user.id,
          nom: user.nom,
          email: user.email,
          prenom: user.prenom,
          nomEntreprise: user.nomEntreprise || '',
          tel: user.tel || '',
        };
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des informations utilisateur', err);
      }
    })
  }
  getCommandes(userId: number){
    this.commandService.findCommandesByUserId(userId).subscribe({
      next: (commandes) => {
        console.log('Commandes récupérées:', commandes);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des commandes', err);
      }
    })
  }

  showTickets = false;
  isLoggedIn = !!this.token; // Vérifie si l'utilisateur est connecté
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

  ngOnInit(): void {
    if (this.me && this.token) {
      this.getUser();
    }
  }

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
    this.router.navigate(['/admin/my-events']);
  }
  deconnexion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
}
