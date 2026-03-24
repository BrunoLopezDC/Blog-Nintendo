import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog'; // ¡NUEVO!
import { SelectModule } from 'primeng/select'; // ¡NUEVO!

// Repositorios
import { UserRepository } from '../../../data/repositories/user.repository';
import { AuthRepository } from '../../../data/repositories/auth.repository';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, TagModule,
    TooltipModule, InputTextModule, CardModule, AvatarModule,
    ConfirmDialogModule, ToastModule, DialogModule, SelectModule // Agregados acá también
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css'], 
})
export class ManageUsers implements OnInit {
  searchText = signal<string>('');
  users = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  currentUserId: string = '';

  // Variables para la edición
  userDialog = signal<boolean>(false);
  currentUser: any = {};
  roles = [
    { label: 'Usuario', value: 'Usuario' },
    { label: 'Admin', value: 'Admin' }
  ];

  filteredUsers = computed(() => {
    const term = this.searchText().toLowerCase();
    return this.users().filter(u => 
      u.nombre?.toLowerCase().includes(term) || 
      u.correo?.toLowerCase().includes(term)
    );
  });

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userRepo: UserRepository,
    private authRepo: AuthRepository
  ) {}

  async ngOnInit() {
    const user = await this.authRepo.obtenerUsuarioActual();
    if (user) {
      this.currentUserId = user.id;
    }
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.isLoading.set(true);
    const { data, error } = await this.userRepo.obtenerUsuarios();
    if (!error) {
      this.users.set(data || []);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo conectar con la base de datos' });
    }
    this.isLoading.set(false);
  }

  getRoleSeverity(rol: string): 'danger' | 'warn' | 'info' {
    return rol === 'Admin' ? 'danger' : 'info';
  }

  getStatusSeverity(estado: string): 'success' | 'danger' {
    return estado === 'Activo' ? 'success' : 'danger';
  }

  toggleUserStatus(user: any) {
    if (user.id === this.currentUserId) {
      this.messageService.add({ severity: 'warn', summary: 'Acción bloqueada', detail: 'No te puedes suspender a ti mismo :p.' });
      return;
    }

    const esActivo = user.estado === 'Activo';
    const nuevoEstado = esActivo ? 'Suspendido' : 'Activo';

    this.confirmationService.confirm({
      message: `¿Estás seguro que quieres ${esActivo ? 'suspender' : 'reactivar'} a "${user.nombre}"?`,
      header: 'Confirmar Acción',
      icon: esActivo ? 'pi pi-ban' : 'pi pi-check-circle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: esActivo ? 'p-button-danger' : 'p-button-success',
      accept: async () => {
        const { error } = await this.userRepo.actualizarEstadoUsuario(user.id, nuevoEstado);
        if (!error) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Usuario puesto en estado: ${nuevoEstado}` });
          this.cargarUsuarios();
        }
      }
    });
  }

  // ¡NUEVO! Abre el modal con los datos del usuario
  editUser(user: any) {
    this.currentUser = { ...user };
    this.userDialog.set(true);
  }

  // ¡NUEVO! Guarda los cambios de Nombre y Rol
  async saveUser() {
    if (!this.currentUser.nombre || this.currentUser.nombre.trim() === '') {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'El nombre no puede estar vacío' });
      return;
    }

    this.isLoading.set(true);
    const { error } = await this.userRepo.actualizarPerfil(this.currentUser.id, {
      nombre: this.currentUser.nombre,
      rol: this.currentUser.rol
    });

    if (!error) {
      this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Perfil modificado con éxito' });
      this.userDialog.set(false);
      this.cargarUsuarios();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el perfil' });
    }
    this.isLoading.set(false);
  }
}