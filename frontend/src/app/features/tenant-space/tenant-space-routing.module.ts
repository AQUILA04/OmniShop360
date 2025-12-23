import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ShopListComponent } from './components/shop-list/shop-list.component';
import { ShopFormComponent } from './components/shop-form/shop-form.component';
import { CatalogListComponent } from './components/catalog-list/catalog-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { TenantSettingsComponent } from './components/tenant-settings/tenant-settings.component';

const routes: Routes = [
    {
        path: 'shops',
        component: ShopListComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE_TENANT_ADMIN'],
                redirectTo: '/login'
            }
        }
    },
    {
        path: 'shops/create',
        component: ShopFormComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE_TENANT_ADMIN'],
                redirectTo: '/login'
            }
        }
    },
    {
        path: 'shops/edit/:id',
        component: ShopFormComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE_TENANT_ADMIN'],
                redirectTo: '/login'
            }
        }
    },
    {
        path: 'catalog',
        component: CatalogListComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE_TENANT_ADMIN'],
                redirectTo: '/login'
            }
        }
    },
    {
        path: 'catalog/create',
        component: ProductFormComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE_TENANT_ADMIN'],
                redirectTo: '/login'
            }
        }
    },
    {
        path: 'catalog/edit/:id',
        component: ProductFormComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE_TENANT_ADMIN'],
                redirectTo: '/login'
            }
        }
    },
    {
        path: 'settings',
        component: TenantSettingsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE_TENANT_ADMIN'],
                redirectTo: '/login'
            }
        }
    },
    {
        path: '',
        redirectTo: 'shops',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TenantSpaceRoutingModule { }
