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

// ¡Importamos tu nuevo repositorio!
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
    FloatLabelModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false; // Para que el botón muestre un loader mientras carga

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authRepo: AuthRepository // Lo inyectamos acá
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

  // ¡Acá está la magia de Supabase!
  async onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true; // Prendemos el loader
      
      const { email, password, nombre } = this.registerForm.value;

      try {
        const { data, error } = await this.authRepo.registrar(email, password, nombre);
        
        if (error) {
          console.error('hubo un error al registrar:', error.message);
          alert('Error al registrar: ' + error.message); // Después lo cambiamos por un Toast lindo de PrimeNG
        } else {
          console.log('¡Usuario registrado con éxito!', data);
          alert('¡Casi listo! Te enviamos un correo. Por favor, revisa tu bandeja de entrada y confirma tu mail para activar la cuenta.');
          this.router.navigate(['/login']); // Lo mandamos a loguearse
        }
      } catch (err) {
        console.error('Error inesperado:', err);
      } finally {
        this.isLoading = false; // Apagamos el loader
      }
    }
  }
}