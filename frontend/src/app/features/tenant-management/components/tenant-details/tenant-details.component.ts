import { Component } from '@angular/core';
import { TenantService } from '../../services/tenant.service';
import { TenantResponse } from '../../models/tenant.model';
import { BaseDetailsComponent } from '../../../../shared/abstractions/base-details.component';
import { SectionConfig } from '../../../../shared/abstractions/field-config.model';

@Component({
  selector: 'app-tenant-details',
  templateUrl: '../../../../shared/abstractions/base-details.component.html',
  styleUrls: ['../../../../shared/abstractions/base-details.component.scss']
})
export class TenantDetailsComponent extends BaseDetailsComponent<TenantResponse> {

  constructor(protected tenantService: TenantService) {
    super(tenantService);
  }

  get pageTitle(): string {
    return this.item ? `Details for ${this.item.companyName}` : 'Tenant Details';
  }

  get backLink(): string {
    return '/tenants';
  }

  get sections(): SectionConfig[] {
    return [
      {
        title: 'Company Information',
        fields: [
          { key: 'companyName', label: 'Company Name', type: 'text' },
          { key: 'contactEmail', label: 'Contact Email', type: 'email' },
          { key: 'status', label: 'Status', type: 'status' },
        ]
      },
      {
        title: 'System Information',
        fields: [
          { key: 'id', label: 'Tenant ID', type: 'text' },
          { key: 'createdAt', label: 'Creation Date', type: 'datetime' },
          { key: 'updatedAt', label: 'Last Updated', type: 'datetime' },
        ]
      },
      {
        title: 'Statistics',
        fields: [
          { key: 'adminCount', label: 'Administrators', type: 'number' },
          { key: 'shopCount', label: 'Shops', type: 'number' },
        ]
      }
    ];
  }
}
