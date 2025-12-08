import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tenants',
    loadChildren: () => import('./features/tenant-management/tenant-management.module').then(m => m.TenantManagementModule)
  },
  { path: '', redirectTo: 'tenants', pathMatch: 'full' }
];
