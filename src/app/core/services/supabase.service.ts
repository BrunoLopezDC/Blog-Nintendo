// Ruta: src/app/core/services/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Acá levantamos la conexión con la base de datos
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Este getter nos va a dejar usar el cliente desde los repositorios (data layer)
  get client(): SupabaseClient {
    return this.supabase;
  }
}