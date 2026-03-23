import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthRepository } from '../../data/repositories/auth.repository';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authRepo = inject(AuthRepository);

  // Le preguntamos a Supabase si hay alguien logueado
  const user = await authRepo.obtenerUsuarioActual();
  
  if (user) {
    return true; // ¡Pasá nomás!
  } else {
    router.navigate(['/login']); // ¡Arafue, andá a loguearte!
    return false;
  }
};