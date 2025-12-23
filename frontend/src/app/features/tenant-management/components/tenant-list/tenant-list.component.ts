import { Component } from '@angular/core';
import { TenantResponse, TenantStatus } from '../../models/tenant.model';
import { TenantService } from '../../services/tenant.service';
import { BaseListComponent } from '../../../../shared/abstractions/base-list.component';
import { ColumnConfig } from '../../../../shared/abstractions/column-config.model';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss']
})
export class TenantListComponent extends BaseListComponent<TenantResponse> {

  pageTitle = 'Tenant Management';

  columnsConfig: ColumnConfig[] = [
    { key: 'companyName', label: 'Company Name', sortable: true },
    { key: 'contactEmail', label: 'Contact Email', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true },
    { key: 'createdAt', label: 'Created At', type: 'date', sortable: true },
  ];

  constructor(protected tenantService: TenantService) {
    super(tenantService);
  }

  toggleStatus(tenant: TenantResponse) {
    const newStatus = tenant.status === TenantStatus.ACTIVE ? TenantStatus.SUSPENDED : TenantStatus.ACTIVE;
    this.tenantService.updateTenantStatus(tenant.id, newStatus).subscribe({
      next: () => {
        this.toastService.showSuccess(`Tenant ${newStatus === TenantStatus.ACTIVE ? 'activated' : 'suspended'}`);
        this.loadData();
      },
      error: () => {
        this.toastService.showError('Error updating status');
      }
    });
  }
}
