import { Component, OnInit, inject, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseCrudService } from './base-crud.service';
import { ColumnConfig } from './column-config.model';
import { ToastService } from '../services/toast.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  template: '',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ]
})
export abstract class BaseListComponent<T extends { id: string }> implements OnInit {

  // État des données pour le composant générique
  data: T[] = [];
  dataSource = new MatTableDataSource<T>([]);
  isLoading = true;
  isLoadingResults = true; // Alias for isLoading to match template
  resultsLength = 0;

  // État de la pagination et du tri
  pageIndex = 0;
  pageSize = 10;
  defaultSort = { active: 'createdAt', direction: 'desc' as SortDirection };
  searchValue = '';

  // Configuration abstraite à définir par l'enfant
  abstract pageTitle: string;
  abstract columnsConfig: ColumnConfig[];

  // Template optionnel pour les actions spécifiques
  specificActionsTemplate?: TemplateRef<any>;

  protected router = inject(Router);
  protected toastService = inject(ToastService);

  constructor(protected service: BaseCrudService<T, string>) {}

  ngOnInit(): void {
    this.loadData();
  }

  get displayedColumns(): string[] {
    return [...this.columnsConfig.map(c => c.key), 'actions'];
  }

  loadData() {
    this.isLoading = true;
    this.isLoadingResults = true;
    this.service.getAll({
      page: this.pageIndex,
      size: this.pageSize,
      sort: `${this.defaultSort.active},${this.defaultSort.direction}`,
      search: this.searchValue
    }).pipe(
      catchError(() => of(null))
    ).subscribe(response => {
      this.isLoading = false;
      this.isLoadingResults = false;
      if (response) {
        // Handle both paginated response and array response
        if (Array.isArray(response)) {
             this.data = response;
             this.dataSource.data = response;
             this.resultsLength = response.length;
        } else {
             this.data = response.content;
             this.dataSource.data = response.content;
             this.resultsLength = response.page.totalElements;
        }
      } else {
        this.data = [];
        this.dataSource.data = [];
        this.resultsLength = 0;
      }
    });
  }

  // Helper method for template
  getFieldValue(key: string, item: any): any {
    if (!item) return '';

    // Check if there's a custom mapValue function in config
    const colConfig = this.columnsConfig.find(c => c.key === key);
    if (colConfig && colConfig.mapValue) {
        const rawValue = key.split('.').reduce((obj: any, k: string) => obj && obj[k], item);
        return colConfig.mapValue(rawValue, item);
    }

    const value = key.split('.').reduce((obj: any, k: string) => obj && obj[k], item);
    return value === null || value === undefined ? '-' : value;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchValue = filterValue;
    // Debounce could be added here
    this.pageIndex = 0;
    this.loadData();
  }

  // Gestionnaires d'événements pour le composant générique
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSortChange(sort: Sort) {
    this.defaultSort = { active: sort.active, direction: sort.direction };
    this.pageIndex = 0;
    this.loadData();
  }

  onSearchChange(value: string) {
    this.searchValue = value;
    this.pageIndex = 0;
    this.loadData();
  }

  // Gestionnaire d'actions centralisé
  onAction(event: { action: string; item: T }) {
    switch (event.action) {
      case 'create':
        this.createItem();
        break;
      case 'edit':
        this.editItem(event.item);
        break;
      case 'details':
        this.viewDetails(event.item);
        break;
      case 'delete':
        this.deleteItem(event.item);
        break;
      default:
        this.onCustomAction(event.action, event.item);
    }
  }

  // Méthodes par défaut (peuvent être surchargées)
  createItem() {
    const currentUrl = this.router.url.split('?')[0];
    this.router.navigate([`${currentUrl}/create`]);
  }

  editItem(item: T) {
    const currentUrl = this.router.url.split('?')[0];
    this.router.navigate([`${currentUrl}/edit`, item.id]);
  }

  viewDetails(item: T) {
    const currentUrl = this.router.url.split('?')[0];
    this.router.navigate([currentUrl, item.id]);
  }

  deleteItem(item: T | string, name?: string) {
    const id = typeof item === 'string' ? item : item.id;
    const displayName = name || (typeof item !== 'string' ? ((item as any).companyName || (item as any).name || id) : id);

    if (confirm(`Are you sure you want to delete ${displayName}?`)) {
      this.service.delete(id).subscribe({
        next: () => {
          this.toastService.showSuccess('Item deleted successfully');
          this.loadData();
        },
        error: () => {
          this.toastService.showError('Error deleting item');
        }
      });
    }
  }

  onCustomAction(action: string, item: T) {
    console.warn(`Action ${action} not handled in component`);
  }
}
