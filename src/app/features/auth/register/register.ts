import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Importaciones de PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast'; // <--- NUEVO
import { MessageService } from 'primeng/api'; // <--- NUEVO

// Repositorio
import { AuthRepository } from '../../../data/repositories/auth.repository';

@Component({
  selector: 'app-register',
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
    ToastModule // <--- NUEVO
  ],
  providers: [MessageService], // <--- NUEVO
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false; 

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authRepo: AuthRepository,
    private readonly messageService: MessageService // <--- NUEVO
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (confirmPassword?.value && password?.value !== confirmPassword?.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  async onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true; 
      
      const { email, password, nombre } = this.registerForm.value;

      try {
        const { data, error } = await this.authRepo.registrar(email, password, nombre);
        
        if (error) {
          this.messageService.add({ severity: 'error', summary: 'Error al registrar', detail: error.message, life: 4000 });
        } else {
          this.messageService.add({ 
            severity: 'success', 
            summary: '¡Casi listo!', 
            detail: 'Te enviamos un correo. Por favor, revisa tu bandeja para activar la cuenta.', 
            life: 6000 
          });
          
          // Esperamos un segundito para que el usuario alcance a leer el Toast antes de mandarlo al login
          setTimeout(() => {
            this.router.navigate(['/login']); 
          }, 2500);
        }
      } catch (err) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error inesperado.', life: 4000 });
      } finally {
        this.isLoading = false; 
      }
    }
  }
}