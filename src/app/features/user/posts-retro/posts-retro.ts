import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea'; 
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';

// Repositorios
import { PostRepository } from '../../../data/repositories/post.repository';
import { AuthRepository } from '../../../data/repositories/auth.repository';

@Component({
  selector: 'app-posts-retro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    AvatarModule,
    ButtonModule,
    TextareaModule,
    DividerModule,
    TagModule,
    RatingModule
  ],
  templateUrl: './posts-retro.html',
  styleUrls: ['./posts-retro.css']
})
export class PostsRetro implements OnInit {
  posts = signal<any[]>([]);
  userId = signal<string>('');
  userName = signal<string>('');
  
  // Diccionario para los comentarios de cada post
  comentarioTemporal = signal<{[key: number]: string}>({});

  constructor(
    private postRepo: PostRepository,
    private authRepo: AuthRepository
  ) {}

  async ngOnInit() {
    // 1. Identificamos al usuario
    const user = await this.authRepo.obtenerUsuarioActual();
    if (user) {
      this.userId.set(user.id);
      const { data } = await this.authRepo.obtenerPerfil(user.id);
      this.userName.set(data?.nombre || 'Usuario');
    }

    // 2. Cargamos la nostalgia
    this.cargarPosts();
  }

  async cargarPosts() {
    const { data } = await this.postRepo.obtenerPostsPorCategoria('Retro');
    if (data) {
      this.posts.set(data);
    }
  }

  async calificar(post: any) {
    if (!this.userId()) return;
    await this.postRepo.calificarPost(post.id, this.userId(), post.mi_valoracion);
  }

  async enviarComentario(postId: number) {
    const texto = this.comentarioTemporal()[postId];
    if (!texto || !texto.trim() || !this.userId()) return;

    const { error } = await this.postRepo.agregarComentario(postId, this.userId(), texto);
    
    if (!error) {
      this.comentarioTemporal.update(prev => ({ ...prev, [postId]: '' }));
      this.cargarPosts();
    }
  }

  onInputComment(postId: number, event: any) {
    const val = event.target.value;
    this.comentarioTemporal.update(prev => ({ ...prev, [postId]: val }));
  }
}