import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';

import { PostRepository } from '../../../data/repositories/post.repository';
import { AuthRepository } from '../../../data/repositories/auth.repository';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, AvatarModule,
    ButtonModule, TextareaModule, DividerModule, TagModule, RatingModule
  ],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css'] // Podés usar el mismo CSS del Dashboard
})
export class SearchResults implements OnInit {
  posts = signal<any[]>([]);
  searchTerm = signal<string>('');
  userId = signal<string>('');
  userName = signal<string>('');
  comentarioTemporal = signal<{[key: number]: string}>({});

  constructor(
    private route: ActivatedRoute,
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

    // Escuchamos los cambios en la URL (por si el usuario busca otra cosa sin recargar)
    this.route.queryParams.subscribe(params => {
      this.searchTerm.set(params['q'] || '');
      this.ejecutarBusqueda();
    });
  }

  async ejecutarBusqueda() {
    if (!this.searchTerm()) return;
    const { data } = await this.postRepo.buscarPosts(this.searchTerm());
    if (data) this.posts.set(data);
  }

  // --- Lógica de comentarios y votos (la misma que ya tenés) ---
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
      this.ejecutarBusqueda();
    }
  }

  onInputComment(postId: number, event: any) {
    const val = event.target.value;
    this.comentarioTemporal.update(prev => ({ ...prev, [postId]: val }));
  }
}