import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  title: string;
  icon: string;
  path: string;
  isActive?: boolean;
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isCollapsed = false;
  currentRoute = '';

  menuItems: MenuItem[] = [
    {
      title: 'Tableau de bord',
      icon: '📊',
      path: '/admin/dashboard'
    },
    {
      title: 'Événements',
      icon: '🎭',
      path: '/admin/my-events',
      subItems: [
        { title: 'Tous les événements', icon: '📋', path: '/admin/events/list' },
        { title: 'Créer un événement', icon: '➕', path: '/admin/events/create' },
      ]
    },
    // {
    //   title: 'Billets',
    //   icon: '🎫',
    //   path: '/admin/tickets',
    //   subItems: [
    //     { title: 'Ventes', icon: '💰', path: '/admin/tickets/sales' },
    //     { title: 'Types de billets', icon: '🎟️', path: '/admin/tickets/types' }
    //   ]
    // },
    // {
    //   title: 'Utilisateurs',
    //   icon: '👥',
    //   path: '/admin/users'
    // },
    // {
    //   title: 'Paramètres',
    //   icon: '⚙️',
    //   path: '/admin/settings'
    // }
  ];

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
      this.updateActiveStates();
    });
  }

  updateActiveStates(): void {
    this.menuItems.forEach(item => {
      item.isActive = this.currentRoute.startsWith(item.path);
      if (item.subItems) {
        item.subItems.forEach(subItem => {
          subItem.isActive = this.currentRoute.startsWith(subItem.path);
        });
      }
    });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

}
