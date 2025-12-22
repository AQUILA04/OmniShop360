import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantCreateFormComponent } from './components/tenant-create-form/tenant-create-form.component';
import { TenantListComponent } from './components/tenant-list/tenant-list.component';

const routes: Routes = [
  { path: '', component: TenantListComponent },
  { path: 'create', component: TenantCreateFormComponent },
  { path: 'edit/:id', component: TenantCreateFormComponent }, // Reuse create form for edit
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantManagementRoutingModule { }
