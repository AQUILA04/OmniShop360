import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TenantManagementRoutingModule } from './tenant-management-routing.module';
import { TenantCreateFormComponent } from './components/tenant-create-form/tenant-create-form.component';

@NgModule({
  declarations: [
    TenantCreateFormComponent
  ],
  imports: [
    SharedModule,
    TenantManagementRoutingModule
  ]
})
export class TenantManagementModule { }
