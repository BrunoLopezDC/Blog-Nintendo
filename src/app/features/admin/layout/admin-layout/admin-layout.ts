import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

interface MenuItem {
  label: string;
  icon: string;
  routerLink?: string;
  url?: string;
  target?: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, RippleModule, TooltipModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent {
  adminName = 'Admin';
  isSidebarCollapsed = false;

  internalMenu: MenuItem[] = [
    { label: 'Dashboard Admin', icon: 'pi pi-chart-bar', routerLink: '/admin/dashboard' },
    { label: 'Gestionar Posts', icon: 'pi pi-file-edit', routerLink: '/admin/manage-posts' },
    { label: 'Gestionar Usuarios', icon: 'pi pi-users', routerLink: '/admin/manage-users' }
  ];

  externalMenu: MenuItem[] = [
    {
      label: 'Nintendo Oficial',
      icon: 'pi pi-globe',
      url: 'https://www.nintendo.com',
      target: '_blank'
    }
  ];

  constructor(private readonly router: Router) {}

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}