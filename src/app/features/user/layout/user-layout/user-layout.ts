import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { AuthRepository } from '../../../../data/repositories/auth.repository';

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
    FormsModule,
    RippleModule,
    TooltipModule,
    InputTextModule
  ],
  templateUrl: './user-layout.html',
  styleUrls: ['./user-layout.css']
})
export class UserLayoutComponent implements OnInit {
  userName = signal<string>('Cargando...'); // <--- Convertido a Signal
  isSidebarCollapsed = false;
  searchQuery = '';

  internalMenu: MenuItem[] = [
    { label: 'Últimas Noticias', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Nintendo Switch 2', icon: 'pi pi-sparkles', routerLink: '/posts-nintendo-switch-2' },
    { label: 'Nintendo Switch', icon: 'pi pi-tablet', routerLink: '/posts-nintendo-switch' },
    { label: 'Wii U', icon: 'pi pi-clone', routerLink: '/posts-wii-u' },
    { label: 'Retro', icon: 'pi pi-history', routerLink: '/posts-retro' }
  ];

  externalMenu: MenuItem[] = [
    { label: 'Nintendo Oficial', icon: 'pi pi-globe', url: 'https://www.nintendo.com/es-mx/', target: '_blank' },
    { label: 'Nintendo Latam', icon: 'pi pi-twitter', url: 'https://x.com/NintendoLatam', target: '_blank' },
    { label: 'Nintendo eShop', icon: 'pi pi-shopping-bag', url: 'https://www.nintendo.com/es-mx/store/', target: '_blank' }
  ];

  constructor(
    private readonly router: Router,
    private readonly authRepo: AuthRepository
  ) {}

  async ngOnInit() {
    const user = await this.authRepo.obtenerUsuarioActual();
    if (user) {
      const { data } = await this.authRepo.obtenerPerfil(user.id);
      if (data) {
        this.userName.set(data.nombre); // <--- Actualizamos el valor del signal
      }
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.searchQuery = ''; 
    }
  }

  async logout(): Promise<void> {
    await this.authRepo.logout();
    this.router.navigate(['/login']);
  }
}