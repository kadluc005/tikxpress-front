import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Auth } from '../../models/user';
import { Event } from '../../models/event';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatTabsModule } from '@angular/material/tabs'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-super',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule
  ],
  templateUrl: './super.component.html',
  styleUrl: './super.component.scss'
})
export class SuperComponent implements OnInit{

  activeTab: 'users' | 'events' = 'users';
  
  // Données utilisateurs
  usersDataSource = new MatTableDataSource<Auth>();
  displayedUserColumns = ['id', 'nom', 'prenom', 'email', 'tel', 'type', 'is_active', 'actions'];
  
  // Données événements
  eventsDataSource = new MatTableDataSource<Event>();
  displayedEventColumns = ['id', 'nom', 'type', 'date_debut', 'date_fin', 'lieu', 'is_active', 'actions'];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.loadUsers();
    this.loadEvents();
  }

  loadUsers() {
    // Simulation de données - à remplacer par un appel API
    this.usersDataSource.data = [
      {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@example.com',
        tel: '0612345678',
        password: '',
        type: 'user',
        is_active: true,
        is_visible: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        nom: 'Martin',
        prenom: 'Marie',
        email: 'marie@example.com',
        tel: '0698765432',
        password: '',
        type: 'organizer',
        is_active: true,
        is_visible: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
  }

  loadEvents() {
    // Simulation de données - à remplacer par un appel API
    this.eventsDataSource.data = [
      {
        id: 1,
        nom: 'Concert Rock',
        description: 'Un super concert de rock',
        type: 'musique',
        date_debut: new Date('2023-12-15T20:00:00'),
        date_fin: new Date('2023-12-15T23:00:00'),
        lieu: 'Paris, France',
        latitude: 48.8566,
        longitude: 2.3522,
        image_url: 'assets/rock.jpg',
        is_active: true,
        is_visible: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
  }

  // Méthodes pour les utilisateurs
  editUser() {//param user: Auth
    // this.dialog.open(UserFormComponent, {
    //   width: '600px',
    //   data: { user }
    // }).afterClosed().subscribe(result => {
    //   if (result) this.loadUsers();
    // });
  }

  toggleUserStatus(user: Auth) {
    user.is_active = !user.is_active;
    // Ici vous devriez faire un appel API pour sauvegarder
  }

  // Méthodes pour les événements
  editEvent() {// param event: Event
    // this.dialog.open(EventFormComponent, {
    //   width: '800px',
    //   data: { event }
    // }).afterClosed().subscribe(result => {
    //   if (result) this.loadEvents();
    // });
  }

  toggleEventStatus(event: Event) {
    event.is_active = !event.is_active;
    // Ici vous devriez faire un appel API pour sauvegarder
  }

  // Filtres
  applyUserFilter() { //param event: Event
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyEventFilter() {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.eventsDataSource.filter = filterValue.trim().toLowerCase();
  }

  // Helper pour afficher le type d'utilisateur
  getUserTypeLabel(type: string): string {
    const types: {[key: string]: string} = {
      'user': 'Utilisateur',
      'organizer': 'Organisateur',
      'admin': 'Administrateur'
    };
    return types[type] || type;
  }
}
