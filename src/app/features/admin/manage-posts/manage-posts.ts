import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

// Repositorio
import { PostRepository } from '../../../data/repositories/post.repository';

@Component({
  selector: 'app-manage-posts',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, TagModule,
    RatingModule, TooltipModule, InputTextModule, CardModule,
    DialogModule, ConfirmDialogModule, SelectModule, EditorModule,
    FileUploadModule, ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './manage-posts.html',
  styleUrls: ['./manage-posts.css']
})
export class ManagePosts implements OnInit {
  searchText = signal<string>('');
  postDialog = signal<boolean>(false);
  statsDialog = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  
  currentPost: any = {};
  selectedStats: any = {};
  posts = signal<any[]>([]);

  // Buscador reactivo por título o categoría
  filteredPosts = computed(() => {
    const term = this.searchText().toLowerCase();
    return this.posts().filter(p => 
      p.titulo?.toLowerCase().includes(term) || 
      p.categoria?.toLowerCase().includes(term) ||
      p.estado?.toLowerCase().includes(term)
    );
  });

  categorias = [
    { label: 'Nintendo Switch', value: 'Nintendo Switch' },
    { label: 'Switch 2', value: 'Switch 2' },
    { label: 'Wii U', value: 'Wii U' },
    { label: 'Retro', value: 'Retro' }
  ];

  estados = [
    { label: 'Publicado', value: 'Publicado' },
    { label: 'Borrador', value: 'Borrador' },
    { label: 'Oculto', value: 'Oculto' }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private postRepo: PostRepository
  ) {}

  ngOnInit() {
    this.cargarPosts();
  }

  async cargarPosts() {
    this.isLoading.set(true);
    try {
      const { data, error } = await this.postRepo.obtenerPosts();
      if (error) throw error;

      const mapeados = (data || []).map((post: any) => {
        const totalComes = post.comentarios && post.comentarios[0] ? post.comentarios[0].count : 0;
        const votos = post.calificaciones || [];
        const suma = votos.reduce((acc: number, cur: any) => acc + (cur.valor || 0), 0);
        const promedio = votos.length > 0 ? Number((suma / votos.length).toFixed(1)) : 0;

        return {
          ...post,
          totalComentarios: totalComes,
          promedioRating: promedio
        };
      });

      this.posts.set(mapeados);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información' });
    } finally {
      this.isLoading.set(false);
    }
  }

  getSeverity(estado: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (estado) {
      case 'Publicado': return 'success';
      case 'Borrador': return 'warn';
      case 'Oculto': return 'danger';
      default: return 'info';
    }
  }

  openNew() {
    this.currentPost = { titulo: '', categoria: '', estado: 'Borrador', contenido: '', imagen_url: null, imagenFile: null };
    this.isEditing.set(false);
    this.postDialog.set(true);
  }

  editPost(post: any) {
    this.currentPost = { ...post, imagenFile: null };
    this.isEditing.set(true);
    this.postDialog.set(true);
  }

  async savePost() {
    if (!this.currentPost.titulo || !this.currentPost.categoria) {
        this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Faltan campos' });
        return;
    }
    this.isLoading.set(true);
    try {
      let finalImageUrl = this.currentPost.imagen_url;
      if (this.currentPost.imagenFile) {
        finalImageUrl = await this.postRepo.subirImagen(this.currentPost.imagenFile);
      }
      const postData = {
        titulo: this.currentPost.titulo,
        categoria: this.currentPost.categoria,
        estado: this.currentPost.estado,
        contenido: this.currentPost.contenido,
        imagen_url: finalImageUrl
      };
      if (this.isEditing()) {
        await this.postRepo.actualizarPost(this.currentPost.id, postData);
      } else {
        await this.postRepo.crearPost(postData);
      }
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Noticia guardada' });
      this.postDialog.set(false);
      this.cargarPosts();
    } catch (err) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
    } finally {
      this.isLoading.set(false);
    }
  }

  onImageUpload(event: any) {
    this.currentPost.imagenFile = event.files[0];
  }

  deletePost(post: any) {
    this.confirmationService.confirm({
      message: `¿Eliminar "${post.titulo}"?`,
      header: 'Confirmar',
      icon: 'pi pi-trash',
      accept: async () => {
        const { error } = await this.postRepo.eliminarPost(post.id);
        if (!error) {
          this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Post borrado' });
          this.cargarPosts();
        }
      }
    });
  }

  viewStats(post: any) {
    this.selectedStats = post;
    this.statsDialog.set(true);
  }
}