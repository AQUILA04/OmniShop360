import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'pos',
    loadComponent: () => import('./features/pos/pos.component').then(m => m.PosComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'pos',
    pathMatch: 'full'
  },
  {
    path: 'back-office',
    loadChildren: () => import('./features/back-office/back-office.routes').then(m => m.BACK_OFFICE_ROUTES),
    canActivate: [authGuard]
  }
];
