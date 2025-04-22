import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { EventsdetailsComponent } from './components/eventsdetails/eventsdetails.component';
import { EventslistComponent } from './components/eventslist/eventslist.component';

export const routes: Routes = [
    {path: '', component: WelcomeComponent},
    {path:'event', component: EventsdetailsComponent},
    {path: 'events', component: EventslistComponent},
    {path: 'event/:id', component: EventsdetailsComponent},
];
