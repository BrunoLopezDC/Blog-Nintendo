import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-manage-posts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    RatingModule,
    TooltipModule,
    InputTextModule,
    CardModule
  ],
  templateUrl: './manage-posts.html',
  styleUrls: ['./manage-posts.css'],
})
export class ManagePosts {
  searchText = signal<string>('');

  // Datos de prueba simulando lo que vendría del backend
  posts = signal([
    {
      id: 1,
      titulo: 'Nuevo título AAA anunciado para este año',
      categoria: 'Nintendo Switch',
      estado: 'Publicado',
      rating: 4,
      comentarios: 12,
      fecha: new Date('2026-03-22')
    },
    {
      id: 2,
      titulo: 'Se filtran especificaciones del nuevo hardware',
      categoria: 'Switch 2',
      estado: 'Borrador',
      rating: 0,
      comentarios: 0,
      fecha: new Date('2026-03-20')
    },
    {
      id: 3,
      titulo: 'El legado de la Wii U que sobrevive hoy',
      categoria: 'Wii U',
      estado: 'Publicado',
      rating: 5,
      comentarios: 34,
      fecha: new Date('2026-03-18')
    }
  ]);

  getSeverity(estado: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (estado) {
      case 'Publicado': return 'success';
      case 'Borrador': return 'warn';
      case 'Oculto': return 'danger';
      default: return 'info';
    }
  }
}