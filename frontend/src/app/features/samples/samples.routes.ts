import { Routes } from '@angular/router';

export const SAMPLE_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./sample-dashboard/sample-dashboard.component').then(m => m.SampleDashboardComponent)
    },
    {
        path: 'list',
        loadComponent: () => import('./sample-list/sample-list.component').then(m => m.SampleListComponent)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./sample-form/sample-form.component').then(m => m.SampleFormComponent)
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./sample-details/sample-details.component').then(m => m.SampleDetailsComponent)
    }
];
