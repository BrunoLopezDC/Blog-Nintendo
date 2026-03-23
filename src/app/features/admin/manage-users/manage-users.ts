import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    InputTextModule,
    CardModule,
    AvatarModule
  ],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css'], // Usamos el mismo CSS que en posts
})
export class ManageUsers {
  searchText = signal<string>('');

  users = signal([
    {
      id: 1,
      nombre: 'Juan Pérez',
      correo: 'juan.perez@email.com',
      rol: 'Usuario',
      estado: 'Activo',
      fechaRegistro: new Date('2026-01-15')
    },
    {
      id: 2,
      nombre: 'María García',
      correo: 'maria.g@email.com',
      rol: 'Editor',
      estado: 'Activo',
      fechaRegistro: new Date('2026-02-10')
    },
    {
      id: 3,
      nombre: 'Troll Nintendo',
      correo: 'troll@email.com',
      rol: 'Usuario',
      estado: 'Suspendido',
      fechaRegistro: new Date('2026-03-01')
    }
  ]);

  getRoleSeverity(rol: string): 'success' | 'info' | 'warn' {
    switch (rol) {
      case 'Admin': return 'danger' as any; // Trick para usar un color fuerte
      case 'Editor': return 'warn';
      default: return 'info';
    }
  }

  getStatusSeverity(estado: string): 'success' | 'danger' {
    return estado === 'Activo' ? 'success' : 'danger';
  }
}