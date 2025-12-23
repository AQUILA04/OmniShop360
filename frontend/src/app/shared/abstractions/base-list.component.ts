import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseCrudService } from './base-crud.service';
import { ColumnConfig } from './column-config.model';
import { ToastService } from '../services/toast.service';

@Component({
  template: ''
})
export abstract class BaseListComponent<T extends { id: string }> implements OnInit {

  // État des données pour le composant générique
  data: T[] = [];
  isLoading = true;
  resultsLength = 0;

  // État de la pagination et du tri
  pageIndex = 0;
  pageSize = 10;
  sortActive = 'createdAt';
  sortDirection: SortDirection = 'desc';
  searchValue = '';

  // Configuration abstraite à définir par l'enfant
  abstract pageTitle: string;
  abstract columnsConfig: ColumnConfig[];

  protected router = inject(Router);
  protected toastService = inject(ToastService);

  constructor(protected service: BaseCrudService<T, string>) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.service.getAll({
      page: this.pageIndex,
      size: this.pageSize,
      sort: `${this.sortActive},${this.sortDirection}`,
      search: this.searchValue
    }).pipe(
      catchError(() => of(null))
    ).subscribe(response => {
      this.isLoading = false;
      if (response) {
        this.data = response.content;
        this.resultsLength = response.page.totalElements;
      } else {
        this.data = [];
        this.resultsLength = 0;
      }
    });
  }

  // Gestionnaires d'événements pour le composant générique
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSortChange(sort: Sort) {
    this.sortActive = sort.active;
    this.sortDirection = sort.direction;
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

  deleteItem(item: T) {
    const name = (item as any).companyName || (item as any).name || item.id;

    if (confirm(`Are you sure you want to delete ${name}?`)) {
      this.service.delete(item.id).subscribe({
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
