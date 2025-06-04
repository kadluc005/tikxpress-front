import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-welcome',
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterLink],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  featuredEvents: Event[] = [];

  constructor( private router: Router, private eventService: EventsService ) {}

  ngOnInit(): void {
    this.loadFeaturedEvents();
  }
  getImageUrl(filename: string): string {
      const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
      const url = environment.BASE_API_URL + cleanFilename;
      console.log('Image URL:', url);
      return url;
    }

  loadFeaturedEvents(): void {
    this.eventService.getAllEvents().subscribe((events: Event[]) => {
      // trie par date (si possible) puis prend les 3 derniers
      this.featuredEvents = events
        .slice() // copie du tableau pour ne pas le modifier
        .sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime())
        .slice(0, 3);
    });
  }
  navigateToEvent(eventId: number) {
    this.router.navigate(['/event', eventId]);
  }
  

}
