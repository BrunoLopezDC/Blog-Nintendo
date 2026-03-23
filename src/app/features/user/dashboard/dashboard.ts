import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG - Corregido para que no tire error
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea'; // <--- Este es el correcto ahora

import { PostRepository } from '../../../data/repositories/post.repository';
import { AuthRepository } from '../../../data/repositories/auth.repository';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CardModule, 
    AvatarModule,
    ButtonModule, 
    DividerModule, 
    TagModule, 
    RatingModule, 
    TextareaModule // <--- Cambiado acá también
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  // ... Todo el resto del código que ya tenías queda igual ...
  posts = signal<any[]>([]);
  userId = signal<string>('');
  userName = signal<string>('');
  comentarioTemporal = signal<{[key: number]: string}>({});

  constructor(
    private postRepo: PostRepository,
    private authRepo: AuthRepository
  ) {}

  async ngOnInit() {
    const user = await this.authRepo.obtenerUsuarioActual();
    if (user) {
      this.userId.set(user.id);
      const { data } = await this.authRepo.obtenerPerfil(user.id);
      this.userName.set(data?.nombre || 'Usuario');
    }
    this.cargarPosts();
  }

  async cargarPosts() {
    const { data } = await this.postRepo.obtenerPostsDashboard();
    if (data) {
      this.posts.set(data);
    }
  }

  async calificar(post: any) {
    if (!this.userId()) return;
    await this.postRepo.calificarPost(post.id, this.userId(), post.mi_valoracion);
    this.cargarPosts();
  }

  async enviarComentario(postId: number) {
    const texto = this.comentarioTemporal()[postId];
    if (!texto || !texto.trim() || !this.userId()) return;

    const { error } = await this.postRepo.agregarComentario(postId, this.userId(), texto);
    
    if (!error) {
      this.comentarioTemporal.update(val => ({ ...val, [postId]: '' }));
      this.cargarPosts();
    }
  }

  updateTempComment(postId: number, event: any) {
    const val = event.target.value;
    this.comentarioTemporal.update(prev => ({ ...prev, [postId]: val }));
  }
}