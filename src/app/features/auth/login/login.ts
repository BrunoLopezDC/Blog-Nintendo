import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthRepository } from '../../../data/repositories/auth.repository';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authRepo: AuthRepository,
    private readonly messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      try {
        const { data: authData, error: authError } = await this.authRepo.login(email, password);

        if (authError) {
          this.messageService.add({ severity: 'error', summary: '¡Epa!', detail: 'Credenciales incorrectas.', life: 4000 });
          this.isLoading = false;
          return;
        }

        if (authData.user) {
          const { data: perfilData, error: perfilError } = await this.authRepo.obtenerPerfil(authData.user.id);

          if (perfilError) {
            this.router.navigate(['/dashboard']);
          } else {
            // Verificamos si la cuenta está suspendida antes de dejarlo pasar
            if (perfilData.estado === 'Suspendido') {
              await this.authRepo.logout();
              this.messageService.add({ severity: 'error', summary: 'Acceso Denegado', detail: 'Tu cuenta ha sido suspendida. Contactá al administrador.', life: 5000 });
              this.isLoading = false;
              return;
            }

            this.messageService.add({ severity: 'success', summary: '¡Bienvenido!', detail: `Logueado correctamente como ${perfilData.rol}`, life: 2000 });

            setTimeout(() => {
              if (perfilData.rol === 'Admin') {
                this.router.navigate(['/admin/dashboard']);
              } else {
                this.router.navigate(['/dashboard']);
              }
            }, 1200);
          }
        }

      } catch (err) {
        this.messageService.add({ severity: 'error', summary: 'Error del servidor', detail: 'Algo se rompió. Intentá de nuevo más tarde.', life: 4000 });
        this.isLoading = false;
      }
    }
  }
}