import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantCreateFormComponent } from './components/tenant-create-form/tenant-create-form.component';
import { TenantListComponent } from './components/tenant-list/tenant-list.component';
import { TenantDetailsComponent } from './components/tenant-details/tenant-details.component';

const routes: Routes = [
  { path: '', component: TenantListComponent },
  { path: 'create', component: TenantCreateFormComponent },
  { path: 'edit/:id', component: TenantCreateFormComponent },
  { path: ':id', component: TenantDetailsComponent }, // Route pour les détails
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantManagementRoutingModule { }
