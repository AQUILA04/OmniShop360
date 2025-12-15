import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'samples',
        loadChildren: () => import('./features/samples/samples.routes').then(m => m.SAMPLE_ROUTES)
      },
      {
        path: 'tenants',
        loadChildren: () => import('./features/tenant-management/tenant-management.module').then(m => m.TenantManagementModule)
      }
    ]
  }
];
