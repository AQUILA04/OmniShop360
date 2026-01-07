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
                only: ['ROLE_TENANT_ADMIN', 'ROLE_superadmin'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'shops/create',
        component: ShopFormComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE_TENANT_ADMIN', 'ROLE_superadmin'],
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
                only: ['ROLE_TENANT_ADMIN', 'ROLE_superadmin'],
                redirectTo: '/login'
            }
        }
    },
    {
        path: 'shops/details/:id',
        component: ShopFormComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            readOnly: true,
            permissions: {
                only: ['ROLE_TENANT_ADMIN', 'ROLE_superadmin'],
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
                only: ['ROLE_TENANT_ADMIN', 'ROLE_superadmin'],
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
                only: ['ROLE_TENANT_ADMIN', 'ROLE_superadmin'],
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
                only: ['ROLE_TENANT_ADMIN', 'ROLE_superadmin'],
                redirectTo: '/login'
            }
        }
    },
    {
        path: 'categories',
        loadComponent: () => import('./components/category-list/category-list.component').then(m => m.CategoryListComponent),
        data: { title: 'Catégories' }
    },
    {
        path: 'categories/create',
        loadComponent: () => import('./components/category-form/category-form.component').then(m => m.CategoryFormComponent),
        data: { title: 'Nouvelle catégorie' }
    },
    {
        path: 'categories/:id',
        loadComponent: () => import('./components/category-form/category-form.component').then(m => m.CategoryFormComponent),
        data: { title: 'Modifier la catégorie' }
    },
    {
        path: 'settings',
        component: TenantSettingsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ROLE_TENANT_ADMIN', 'ROLE_superadmin'],
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
