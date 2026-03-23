import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { AuthRepository } from '../../../../data/repositories/auth.repository';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, RippleModule, TooltipModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent implements OnInit {
  adminName = 'Cargando...'; 
  isSidebarCollapsed = false;

  internalMenu: MenuItem[] = [
    { label: 'Dashboard Admin', icon: 'pi pi-chart-pie', routerLink: '/admin/dashboard' },
    { label: 'Gestionar Posts', icon: 'pi pi-file-edit', routerLink: '/admin/manage-posts' },
    { label: 'Control Usuarios', icon: 'pi pi-users', routerLink: '/admin/manage-users' }
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
        this.adminName = data.nombre; 
      }
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  async logout(): Promise<void> {
    await this.authRepo.logout();
    this.router.navigate(['/login']);
  }
}