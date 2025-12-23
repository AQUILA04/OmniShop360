import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { TenantCreateFormComponent } from './components/tenant-create-form/tenant-create-form.component';
import { TenantListComponent } from './components/tenant-list/tenant-list.component';
import { TenantDetailsComponent } from './components/tenant-details/tenant-details.component';

const routes: Routes = [
  {
    path: '',
    component: TenantListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ROLE_superadmin'],
        redirectTo: '/login'
      }
    }
  },
  {
    path: 'create',
    component: TenantCreateFormComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ROLE_superadmin'],
        redirectTo: '/login'
      }
    }
  },
  {
    path: 'edit/:id',
    component: TenantCreateFormComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ROLE_superadmin'],
        redirectTo: '/login'
      }
    }
  },
  {
    path: ':id',
    component: TenantDetailsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ROLE_superadmin'],
        redirectTo: '/login'
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantManagementRoutingModule { }
