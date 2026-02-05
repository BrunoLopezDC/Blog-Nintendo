import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputFieldComponent } from '../../../shared/components/input-field/input-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputFieldComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  emailControl!: FormControl<any>;
  passwordControl!: FormControl<any>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.emailControl = this.loginForm.get('email') as FormControl<any>;
    this.passwordControl = this.loginForm.get('password') as FormControl<any>;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Por ahora, solo redirige al dashboard (cuando lo crees)
      // En el futuro, aquí llamarás al servicio de autenticación
      console.log('Login válido:', this.loginForm.value);
      
      // Preparado para redirección futura:
      this.router.navigate(['/dashboard']);
    }
  }
}