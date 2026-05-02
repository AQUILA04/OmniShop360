import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { TenantService } from '../../services/tenant.service';
import { TenantResponse } from '../../models/tenant.model';
import { BaseFormComponent } from '../../../../shared/abstractions/base-form.component';
import { FormSectionConfig } from '../../../../shared/abstractions/form-config.model';

@Component({
  selector: 'app-tenant-create-form',
  templateUrl: './tenant-create-form.component.html',
  styleUrls: ['./tenant-create-form.component.scss']
})
export class TenantCreateFormComponent extends BaseFormComponent<TenantResponse> {

  formConfig: FormSectionConfig[] = [];

  constructor(protected tenantService: TenantService) {
    super(tenantService);
  }

  initForm(): void {
    this.formConfig = [
      {
        title: 'Company Information',
        fields: [
          {
            key: 'companyName',
            label: 'Company Name',
            type: 'text',
            placeholder: 'Ex: ACME Corp',
            validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
          },
          {
            key: 'contactEmail',
            label: 'Contact Email (Company)',
            type: 'email',
            placeholder: 'contact@acme.com',
            validators: [Validators.required, Validators.email]
          }
        ]
      },
      {
        title: 'Primary Administrator',
        fields: [
          {
            key: 'adminFirstName',
            label: 'First Name',
            type: 'text',
            placeholder: 'John',
            cssClass: 'half-width',
            validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
          },
          {
            key: 'adminLastName',
            label: 'Last Name',
            type: 'text',
            placeholder: 'Doe',
            cssClass: 'half-width',
            validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
          },
          {
            key: 'adminEmail',
            label: 'Administrator Email',
            type: 'email',
            placeholder: 'john.doe@acme.com',
            hint: 'This email will be used for login',
            validators: [Validators.required, Validators.email]
          }
        ]
      }
    ];

    this.form = this.fb.group({});
  }

  patchForm(tenant: TenantResponse): void {
    // Désactiver les champs admin en mode édition
    if (this.isEditMode) {
      this.formConfig[1].fields.forEach(field => field.disabled = true);
    }

    // Préparer les valeurs à patcher
    const patchValues: any = {
      companyName: tenant.companyName,
      contactEmail: tenant.contactEmail,
    };

    // Mapper les infos de l'admin si disponibles
    if (tenant.admin) {
      patchValues.adminFirstName = tenant.admin.firstName;
      patchValues.adminLastName = tenant.admin.lastName;
      patchValues.adminEmail = tenant.admin.email;
    }

    this.form.patchValue(patchValues);
  }

  getRedirectUrl(): string {
    return '/tenants';
  }

  onFormSubmit(formData: any) {
    super.onSubmit();
  }
}
