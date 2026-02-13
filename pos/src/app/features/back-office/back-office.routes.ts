import { Routes } from '@angular/router';
import { BackOfficeLayoutComponent } from './layouts/back-office-layout.component';
import { TransactionHistoryComponent } from './pages/transaction-history/transaction-history.component';

export const BACK_OFFICE_ROUTES: Routes = [
    {
        path: '',
        component: BackOfficeLayoutComponent,
        children: [
            {
                path: 'transactions',
                component: TransactionHistoryComponent
            },
            {
                path: 'dashboard',
                redirectTo: 'transactions',
                pathMatch: 'full' // Placeholder until Dashboard is implemented
            },
            {
                path: '',
                redirectTo: 'transactions',
                pathMatch: 'full'
            }
        ]
    }
];
