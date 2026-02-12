import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pos',
    loadComponent: () => import('./features/pos/pos.component').then(m => m.PosComponent)
  },
  {
    path: '',
    redirectTo: 'pos',
    pathMatch: 'full'
  }
];
