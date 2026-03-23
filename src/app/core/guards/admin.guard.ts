import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthRepository } from '../../data/repositories/auth.repository';

export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authRepo = inject(AuthRepository);

  const user = await authRepo.obtenerUsuarioActual();
  
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // Si está logueado, le buscamos la chapa de Admin
  const { data, error } = await authRepo.obtenerPerfil(user.id);
  
  if (data && data.rol === 'Admin') {
    return true; // Es el jefe, alfombra roja
  } else {
    router.navigate(['/dashboard']); // Es un usuario común, lo mandamos a la zona general
    return false;
  }
};