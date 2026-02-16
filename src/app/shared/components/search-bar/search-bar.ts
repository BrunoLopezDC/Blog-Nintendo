import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBarComponent {
  searchControl = new FormControl('');
  @Output() searchQuery = new EventEmitter<string>();

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchQuery.emit(value || '');
      });
  }

  onSearch() {
    const query = this.searchControl.value || '';
    this.searchQuery.emit(query);
  }

  clearSearch() {
    this.searchControl.setValue('');
  }
}