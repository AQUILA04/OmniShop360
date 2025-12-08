import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TenantService } from '../../services/tenant.service';
import { CreateTenantRequest } from '../../models/tenant.model';

@Component({
  selector: 'app-tenant-create-form',
  templateUrl: './tenant-create-form.component.html',
  styleUrls: ['./tenant-create-form.component.scss']
})
export class TenantCreateFormComponent implements OnInit {
  tenantForm!: FormGroup;
  isLoading = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private tenantService = inject(TenantService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.initForm();
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

  onSubmit(): void {
    if (this.tenantForm.invalid) {
      return;
    }

    this.isLoading = true;
    const request: CreateTenantRequest = this.tenantForm.value;

    this.tenantService.createTenant(request).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Tenant créé avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.tenantForm.reset();
        // Optionnel : rediriger vers la liste des tenants quand elle sera prête
        // this.router.navigate(['/tenants']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur création tenant', error);

        let errorMessage = 'Une erreur est survenue lors de la création du tenant.';
        if (error.error && error.error.message) {
            errorMessage = error.error.message;
        }

        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.tenantForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('email')) {
      return 'Email invalide';
    }
    if (control?.hasError('minlength')) {
      return `Minimum ${control.errors?.['minlength'].requiredLength} caractères`;
    }
    if (control?.hasError('maxlength')) {
      return `Maximum ${control.errors?.['maxlength'].requiredLength} caractères`;
    }
    return '';
  }
}
