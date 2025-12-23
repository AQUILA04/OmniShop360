import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TenantManagementRoutingModule } from './tenant-management-routing.module';
import { TenantCreateFormComponent } from './components/tenant-create-form/tenant-create-form.component';
import { TenantListComponent } from './components/tenant-list/tenant-list.component';
import { TenantDetailsComponent } from './components/tenant-details/tenant-details.component';

@NgModule({
  declarations: [
    TenantCreateFormComponent,
    TenantListComponent,
    TenantDetailsComponent
  ],
  imports: [
    SharedModule,
    TenantManagementRoutingModule
  ]
})
export class TenantManagementModule { }
