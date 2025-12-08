import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantCreateFormComponent } from './components/tenant-create-form/tenant-create-form.component';

const routes: Routes = [
  { path: 'create', component: TenantCreateFormComponent },
  { path: '', redirectTo: 'create', pathMatch: 'full' } // Default to create for now as list is not ready
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantManagementRoutingModule { }
