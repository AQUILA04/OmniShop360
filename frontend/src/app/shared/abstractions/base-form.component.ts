import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseCrudService } from './base-crud.service';
import { ToastService } from '../services/toast.service';

@Component({
  template: ''
})
export abstract class BaseFormComponent<T> implements OnInit {
  form!: FormGroup;
  isLoading = false;
  isEditMode = false;
  itemId: string | null = null;

  protected fb = inject(FormBuilder);
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected toastService = inject(ToastService);

  constructor(protected service: BaseCrudService<T, string>) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  abstract initForm(): void;
  abstract patchForm(item: T): void;
  abstract getRedirectUrl(): string;

  protected checkEditMode(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.isEditMode = true;
      this.isLoading = true;
      this.service.getById(this.itemId).subscribe({
        next: (item) => {
          this.patchForm(item);
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.toastService.showError('Error loading details');
          this.router.navigate([this.getRedirectUrl()]);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const request = this.form.getRawValue();

    if (this.isEditMode && this.itemId) {
      this.service.update(this.itemId, request).subscribe({
        next: () => {
          this.handleSuccess('Updated successfully');
        },
        error: (error) => {
          this.handleError(error, 'Error updating item');
        }
      });
    } else {
      this.service.create(request).subscribe({
        next: () => {
          this.handleSuccess('Created successfully');
        },
        error: (error) => {
          this.handleError(error, 'Error creating item');
        }
      });
    }
  }

  protected handleSuccess(message: string): void {
    this.isLoading = false;
    this.toastService.showSuccess(message);
    this.router.navigate([this.getRedirectUrl()]);
  }

  protected handleError(error: any, defaultMessage: string): void {
    this.isLoading = false;
    console.error(defaultMessage, error);

    let errorMessage = defaultMessage;
    if (error.error && error.error.message) {
        errorMessage = error.error.message;
    }

    this.toastService.showError(errorMessage);
  }

  cancel(): void {
    this.router.navigate([this.getRedirectUrl()]);
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Invalid email format';
    }
    if (control?.hasError('minlength')) {
      return `Minimum ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      return `Maximum ${control.errors?.['maxlength'].requiredLength} characters`;
    }
    return '';
  }
}
