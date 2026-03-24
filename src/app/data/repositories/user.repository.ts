import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UserRepository {
  constructor(private readonly supabase: SupabaseService) {}

  // Traer todos los perfiles con tu columna 'fecha_registro'
  async obtenerUsuarios() {
    return await this.supabase.client
      .from('perfiles')
      .select('*')
      .order('fecha_registro', { ascending: false });
  }

  // Cambiar el estado entre Activo y Suspendido
  async actualizarEstadoUsuario(id: string, nuevoEstado: string) {
    return await this.supabase.client
      .from('perfiles')
      .update({ estado: nuevoEstado })
      .eq('id', id);
  }

  // ¡NUEVO! Actualizar datos del usuario (Nombre y Rol)
  async actualizarPerfil(id: string, datos: { nombre: string, rol: string }) {
    return await this.supabase.client
      .from('perfiles')
      .update(datos)
      .eq('id', id);
  }
}