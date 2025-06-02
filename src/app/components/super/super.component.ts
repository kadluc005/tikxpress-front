import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Auth } from '../../models/user';
import { Event } from '../../models/event';
import { AuthService } from '../../services/auth.service';
import { EventsService } from '../../services/events.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
export class SuperComponent implements OnInit {

  activeTab: 'users' | 'events' = 'users';

  usersDataSource = new MatTableDataSource<Auth>();
  displayedUserColumns = ['id', 'nom', 'prenom', 'email', 'tel','is_active', 'actions'];

  eventsDataSource = new MatTableDataSource<Event>();
  displayedEventColumns = ['id', 'nom', 'type', 'date_debut', 'date_fin', 'lieu', 'is_active', 'actions'];

  @ViewChild('userPaginator') userPaginator!: MatPaginator;
  @ViewChild('userSort') userSort!: MatSort;

  @ViewChild('eventPaginator') eventPaginator!: MatPaginator;
  @ViewChild('eventSort') eventSort!: MatSort;

  constructor(private dialog: MatDialog, private authService: AuthService, private eventsService: EventsService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadEvents();
  }

  loadUsers() {
    const token = localStorage.getItem('token') || '';
    this.authService.getAllUsers(token).subscribe({
      next: users => {
        this.usersDataSource.data = users;
        this.usersDataSource.paginator = this.userPaginator;
        this.usersDataSource.sort = this.userSort;
      },
      error: err => console.error('Erreur lors du chargement des utilisateurs', err)
    });
  }

  loadEvents() {
    this.eventsService.getAllEvents().subscribe({
      next: events => {
        this.eventsDataSource.data = events;
        this.eventsDataSource.paginator = this.eventPaginator;
        this.eventsDataSource.sort = this.eventSort;
      },
      error: err => console.error('Erreur lors du chargement des événements', err)
    });
  }

  // applyUserFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.usersDataSource.filter = filterValue.trim().toLowerCase();
  // }

  // applyEventFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.eventsDataSource.filter = filterValue.trim().toLowerCase();
  // }

  toggleUserStatus(user: Auth) {
    user.is_active = !user.is_active;
    // TODO: appel API pour sauvegarder
  }

  toggleEventStatus(event: Event) {
    event.is_active = !event.is_active;
    // TODO: appel API pour sauvegarder
  }

  getUserTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      user: 'Utilisateur',
      organizer: 'Organisateur',
      admin: 'Administrateur'
    };
    return types[type] || type;
  }

  editUser(user: Auth) {
    // TODO: ouvrir un formulaire dans une boîte de dialogue
  }

  editEvent(event: Event) {
    // TODO: ouvrir un formulaire dans une boîte de dialogue
  }
}
