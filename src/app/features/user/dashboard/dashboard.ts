import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  userName: string = 'Usuario';

  constructor(private readonly router: Router) {}

  logout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}