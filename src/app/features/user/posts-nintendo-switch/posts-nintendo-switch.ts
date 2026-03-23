import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-posts-nintendo-switch',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    AvatarModule,
    ButtonModule,
    Textarea,
    DividerModule,
    TagModule,
    RatingModule
  ],
  templateUrl: './posts-nintendo-switch.html',
  styleUrls: ['./posts-nintendo-switch.css']
})
export class PostsNintendoSwitch {
  userRating = signal<number>(0);
}