import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Repositorios
import { AuthRepository } from '../../../data/repositories/auth.repository';
import { UserRepository } from '../../../data/repositories/user.repository';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, ButtonModule, 
    InputTextModule, AvatarModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  userId = signal<string>('');
  userEmail = signal<string>('');
  userName = signal<string>('');
  userRole = signal<string>('');
  isLoading = signal<boolean>(false);

  constructor(
    private authRepo: AuthRepository,
    private userRepo: UserRepository,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    const user = await this.authRepo.obtenerUsuarioActual();
    if (user) {
      this.userId.set(user.id);
      this.userEmail.set(user.email || ''); // El correo viene directo de la sesión segura
      
      const { data } = await this.authRepo.obtenerPerfil(user.id);
      if (data) {
        this.userName.set(data.nombre);
        this.userRole.set(data.rol);
      }
    }
  }

  async saveProfile() {
    if (!this.userName().trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'El nombre no puede estar vacío.' });
      return;
    }

    this.isLoading.set(true);
    
    // Le pasamos any para que no nos exija mandar el rol de nuevo, solo actualizamos el nombre
    const { error } = await this.userRepo.actualizarPerfil(this.userId(), { 
      nombre: this.userName() 
    } as any);

    if (!error) {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tu perfil ha sido actualizado.' });
      
      // Emitimos un evento o recargamos para que el layout arriba a la derecha se entere (opcional)
      setTimeout(() => {
        window.location.reload(); // Forma rápida de que el header actualice el nombre
      }, 1500);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el perfil.' });
    }
    this.isLoading.set(false);
  }
}