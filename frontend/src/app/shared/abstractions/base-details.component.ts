import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseCrudService } from './base-crud.service';
import { SectionConfig } from './field-config.model';
import { ToastService } from '../services/toast.service';

@Component({
  template: ''
})
export abstract class BaseDetailsComponent<T> implements OnInit {
  item: T | null = null;
  isLoading = true;
  itemId: string | null = null;

  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected toastService = inject(ToastService);

  constructor(protected service: BaseCrudService<T, string>) {}

  abstract get pageTitle(): string;
  abstract get sections(): SectionConfig[];
  abstract get backLink(): string;

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.loadData(this.itemId);
    } else {
      this.handleError('No ID provided');
    }
  }

  loadData(id: string): void {
    this.isLoading = true;
    this.service.getById(id).subscribe({
      next: (data) => {
        this.item = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Error loading details');
      }
    });
  }

  getFieldValue(field: any, item: any): any {
    if (!item) return '';
    const value = field.key.split('.').reduce((obj: any, key: string) => obj && obj[key], item);

    if (value === null || value === undefined) return '-';

    if (field.mapValue) {
      return field.mapValue(value);
    }

    return value;
  }

  goBack(): void {
    this.router.navigate([this.backLink]);
  }

  edit(): void {
    if (this.itemId) {
      this.router.navigate([this.backLink, 'edit', this.itemId]);
    }
  }

  protected handleError(message: string): void {
    this.isLoading = false;
    this.toastService.showError(message);
    this.goBack();
  }
}
