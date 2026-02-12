import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { StockMovementFormComponent } from './stock-movement-form/stock-movement-form.component';

const routes: Routes = [
    {
        path: 'inventory',
        component: InventoryListComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE_SHOP_ADMIN', 'ROLE_STOCK_MANAGER', 'ROLE_superadmin'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'stock-movement',
        component: StockMovementFormComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE_SHOP_ADMIN', 'ROLE_STOCK_MANAGER', 'ROLE_superadmin'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShopAdminRoutingModule { }
