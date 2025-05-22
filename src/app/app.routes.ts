import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { EventsdetailsComponent } from './components/eventsdetails/eventsdetails.component';
import { EventslistComponent } from './components/eventslist/eventslist.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyeventsComponent } from './components/myevents/myevents.component';
import { RoleSelectionComponent } from './components/role-selection/role-selection.component';

export const routes: Routes = [
    {path: '', component: WelcomeComponent},
    {path:'event', component: EventsdetailsComponent},
    {path: 'events', component: EventslistComponent},
    {path: 'event/:id', component: EventsdetailsComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'role-selection', component: RoleSelectionComponent},

    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {path:'dashboard', component: DashboardComponent},
            {path:'my-events', component: MyeventsComponent},
            {path:'events/create', component: CreateEventComponent},
        ]
           
    }
];
