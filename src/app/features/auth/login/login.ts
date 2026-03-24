import { Component, OnInit, OnDestroy } from '@angular/core';
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
    CommonModule, ReactiveFormsModule, RouterModule, CardModule,
    ButtonModule, RippleModule, InputTextModule, PasswordModule,
    FloatLabelModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoadingPassword = false;
  isLoadingMagicLink = false;
  private authListener: any; // Para apagar el "timbre" cuando nos vamos

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

  ngOnInit() {
    // Escuchamos el Magic Link, pero solo si no estamos usando la contraseña
    const { data } = this.authRepo.escucharCambiosDeSesion(async (event, session) => {
      if (event === 'SIGNED_IN' && session && !this.isLoadingPassword) {
        this.isLoadingMagicLink = true;
        await this.procesarAcceso(session.user.id, '¡Magia pura!');
        this.isLoadingMagicLink = false;
      }
    });
    this.authListener = data?.subscription;
  }

  ngOnDestroy() {
    // Apagamos el timbre cuando cerramos la pantalla
    if (this.authListener) {
      this.authListener.unsubscribe();
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoadingPassword = true;
      const { email, password } = this.loginForm.value;

      try {
        const { data: authData, error: authError } = await this.authRepo.login(email, password);

        if (authError) {
          this.messageService.add({ severity: 'error', summary: '¡Epa!', detail: 'Credenciales incorrectas.', life: 4000 });
          return; // El bloque finally apagará el botón
        }

        if (authData?.user) {
          await this.procesarAcceso(authData.user.id, 'Logueado correctamente');
        }
      } catch (err) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Algo se rompió en el servidor.' });
      } finally {
        // ESTO EVITA EL GIRO INFINITO
        this.isLoadingPassword = false; 
      }
    }
  }

  // Centralizamos la lógica de entrada para no repetir código
  async procesarAcceso(userId: string, mensajeExito: string) {
    const { data: perfilData, error: perfilError } = await this.authRepo.obtenerPerfil(userId);

    if (perfilError || !perfilData) {
      this.router.navigate(['/dashboard']);
      return;
    }

    if (perfilData.estado === 'Suspendido') {
      await this.authRepo.logout();
      this.messageService.add({ severity: 'error', summary: 'Acceso Denegado', detail: 'Tu cuenta está suspendida.' });
      return;
    }

    this.messageService.add({ severity: 'success', summary: '¡Bienvenido!', detail: mensajeExito, life: 2000 });

    if (perfilData.rol === 'Admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  async sendMagicLink() {
    const emailControl = this.loginForm.get('email');
    
    if (emailControl?.valid) {
      this.isLoadingMagicLink = true;
      try {
        const { error } = await this.authRepo.enviarMagicLink(emailControl.value);
        if (error) throw error;
        this.messageService.add({ severity: 'success', summary: '¡Revisá tu bandeja!', detail: 'Enlace enviado.' });
      } catch (err) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar el enlace.' });
      } finally {
        // ESTO EVITA EL GIRO INFINITO DEL MAGIC LINK
        this.isLoadingMagicLink = false;
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Ingresá un correo válido.' });
    }
  }
}