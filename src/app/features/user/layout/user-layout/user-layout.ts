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
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    RippleModule,
    TooltipModule
  ],
  templateUrl: './user-layout.html',
  styleUrls: ['./user-layout.css']
})
export class UserLayoutComponent {
  userName = 'Bruni';
  isSidebarCollapsed = false;

  internalMenu: MenuItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
  { label: 'Nintendo Switch 2', icon: 'pi pi-sparkles', routerLink: '/posts-nintendo-switch-2' },
  { label: 'Nintendo Switch', icon: 'pi pi-tablet', routerLink: '/posts-nintendo-switch' },
  { label: 'Wii U', icon: 'pi pi-clone', routerLink: '/posts-wii-u' }, 
  { label: 'Retro', icon: 'pi pi-history', routerLink: '/posts-retro' } 
];

  externalMenu: MenuItem[] = [
    {
      label: 'Nintendo Oficial',
      icon: 'pi pi-globe',
      url: 'https://www.nintendo.com',
      target: '_blank'
    },
    {
      label: 'Nintendo España',
      icon: 'pi pi-compass',
      url: 'https://www.nintendo.es',
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