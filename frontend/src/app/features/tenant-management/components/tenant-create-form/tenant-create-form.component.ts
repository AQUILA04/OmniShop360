import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TenantService } from '../../services/tenant.service';
import { CreateTenantRequest, TenantResponse } from '../../models/tenant.model';

@Component({
  selector: 'app-tenant-create-form',
  templateUrl: './tenant-create-form.component.html',
  styleUrls: ['./tenant-create-form.component.scss']
})
export class TenantCreateFormComponent implements OnInit {
  tenantForm!: FormGroup;
  isLoading = false;
  isEditMode = false;
  tenantId: string | null = null;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tenantService = inject(TenantService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.tenantForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      adminFirstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      adminLastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      adminEmail: ['', [Validators.required, Validators.email]]
    });
  }

  checkEditMode(): void {
    this.tenantId = this.route.snapshot.paramMap.get('id');
    if (this.tenantId) {
      this.isEditMode = true;
      this.isLoading = true;
      this.tenantService.getTenantById(this.tenantId).subscribe({
        next: (tenant) => {
          this.patchForm(tenant);
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open('Error loading tenant details', 'Close', { duration: 3000 });
          this.router.navigate(['/tenants']);
        }
      });
    }
  }

  patchForm(tenant: TenantResponse): void {
    this.tenantForm.patchValue({
      companyName: tenant.companyName,
      contactEmail: tenant.contactEmail,
      // Admin details might not be editable or available in the same way depending on backend
      // For now, we assume we can't edit admin details here or they are not returned in the same structure
      // If admin details are needed, we need to fetch them or map them correctly
    });

    // Disable admin fields in edit mode if they shouldn't be changed here
    if (this.isEditMode) {
      this.tenantForm.get('adminFirstName')?.disable();
      this.tenantForm.get('adminLastName')?.disable();
      this.tenantForm.get('adminEmail')?.disable();
    }
  }

  onSubmit(): void {
    if (this.tenantForm.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.isEditMode && this.tenantId) {
      const updateRequest: Partial<TenantResponse> = {
        companyName: this.tenantForm.get('companyName')?.value,
        contactEmail: this.tenantForm.get('contactEmail')?.value
      };

      this.tenantService.updateTenant(this.tenantId, updateRequest).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Tenant updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/tenants']);
        },
        error: (error) => {
          this.handleError(error, 'Error updating tenant');
        }
      });
    } else {
      const request: CreateTenantRequest = this.tenantForm.getRawValue(); // getRawValue to include disabled fields if any (though not for create)

      this.tenantService.createTenant(request).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Tenant created successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.tenantForm.reset();
          this.router.navigate(['/tenants']);
        },
        error: (error) => {
          this.handleError(error, 'Error creating tenant');
        }
      });
    }
  }

  handleError(error: any, defaultMessage: string): void {
    this.isLoading = false;
    console.error(defaultMessage, error);

    let errorMessage = defaultMessage;
    if (error.error && error.error.message) {
        errorMessage = error.error.message;
    }

    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.tenantForm.get(controlName);
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

  cancel(): void {
    this.router.navigate(['/tenants']);
  }
}
