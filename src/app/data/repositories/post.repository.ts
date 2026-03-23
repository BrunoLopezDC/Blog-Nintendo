import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class PostRepository {
  constructor(private readonly supabase: SupabaseService) {}

  // ==========================================
  // 1. MÉTODOS DE ADMINISTRACIÓN (CRUD)
  // ==========================================

  // Traer todos para la tabla del Admin
async obtenerPosts() {
    // Solo traemos los datos puros de Supabase
    return await this.supabase.client
      .from('posts')
      .select(`
        *,
        comentarios(count),
        calificaciones(valor)
      `)
      .order('id', { ascending: false });
  }

  async crearPost(post: any) {
    return await this.supabase.client
      .from('posts')
      .insert([post])
      .select()
      .single();
  }

  async actualizarPost(id: string, post: any) {
    return await this.supabase.client
      .from('posts')
      .update(post)
      .eq('id', id)
      .select()
      .single();
  }

  async eliminarPost(id: string) {
    return await this.supabase.client
      .from('posts')
      .delete()
      .eq('id', id);
  }

  // Subida de imágenes al Storage
  async subirImagen(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await this.supabase.client.storage
      .from('portadas')
      .upload(filePath, file);

    if (error) throw error;

    const { data: urlData } = this.supabase.client.storage
      .from('portadas')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  }

  // ==========================================
  // 2. MÉTODOS DE VISTA DE USUARIO (READ + JOINS)
  // ==========================================

  // Dashboard: Últimos 15 días (Cualquier categoría)
  async obtenerPostsDashboard() {
    const hace15Dias = new Date();
    hace15Dias.setDate(hace15Dias.getDate() - 15);

    return await this.supabase.client
      .from('posts')
      .select(`
        *,
        perfiles!posts_autor_id_fkey (nombre),
        comentarios (
          id, texto, creado_en, 
          perfiles!comentarios_usuario_id_fkey (nombre)
        ),
        calificaciones (valor)
      `)
      .eq('estado', 'Publicado')
      .gt('creado_en', hace15Dias.toISOString())
      .order('id', { ascending: false });
  }

  // Categorías Específicas: Wii U, Switch, etc. (Sin límite de días)
  async obtenerPostsPorCategoria(categoria: string) {
    return await this.supabase.client
      .from('posts')
      .select(`
        *,
        perfiles!posts_autor_id_fkey (nombre),
        comentarios (
          id, texto, creado_en, 
          perfiles!comentarios_usuario_id_fkey (nombre)
        ),
        calificaciones (valor)
      `)
      .eq('estado', 'Publicado')
      .eq('categoria', categoria)
      .order('id', { ascending: false });
  }

  // Buscador Global (Busca en título o contenido)
  async buscarPosts(termino: string) {
    return await this.supabase.client
      .from('posts')
      .select(`
        *,
        perfiles!posts_autor_id_fkey (nombre),
        comentarios (id, texto, creado_en, perfiles!comentarios_usuario_id_fkey(nombre)),
        calificaciones (valor)
      `)
      .eq('estado', 'Publicado')
      .or(`titulo.ilike.%${termino}%,contenido.ilike.%${termino}%`)
      .order('id', { ascending: false });
  }

  // ==========================================
  // 3. INTERACCIONES (COMENTARIOS Y RATING)
  // ==========================================

  async agregarComentario(postId: number, usuarioId: string, texto: string) {
    return await this.supabase.client
      .from('comentarios')
      .insert([{ post_id: postId, usuario_id: usuarioId, texto: texto }]);
  }

  async calificarPost(postId: number, usuarioId: string, valor: number) {
    return await this.supabase.client
      .from('calificaciones')
      .upsert(
        { post_id: postId, usuario_id: usuarioId, valor: valor }, 
        { onConflict: 'post_id,usuario_id' }
      );
  }
}