import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, SearchBarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  userName: string = 'Usuario';

  constructor(private readonly router: Router) {}

  onSearch(query: string) {
    console.log('Buscando:', query);
    // En el futuro: llamar al servicio de búsqueda
  }

  logout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}