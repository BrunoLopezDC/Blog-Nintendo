import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async registrar(email: string, password: string, nombre: string) {
    return await this.supabase.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre: nombre
        }
      }
    });
  }

  async login(email: string, password: string) {
    return await this.supabase.client.auth.signInWithPassword({
      email,
      password
    });
  }

  async obtenerPerfil(userId: string) {
    return await this.supabase.client
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single();
  }

  async obtenerUsuarioActual() {
    const { data, error } = await this.supabase.client.auth.getSession();
    return data.session?.user || null;
  }

  async enviarMagicLink(email: string) {
    return await this.supabase.client.auth.signInWithOtp({
      email: email,
      options: {
        // Esto detecta automáticamente si estás en localhost o en Vercel
        emailRedirectTo: window.location.origin + '/dashboard' 
      }
    });
  }
  
  async logout() {
    return await this.supabase.client.auth.signOut();
  }

  // ¡NUEVO! Escuchamos los cambios de sesión (el "timbre" del Magic Link)
  escucharCambiosDeSesion(callback: (event: string, session: any) => void) {
    return this.supabase.client.auth.onAuthStateChange(callback);
  }
}