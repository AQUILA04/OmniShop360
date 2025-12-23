import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TenantSpaceRoutingModule } from './tenant-space-routing.module';
import { ShopListComponent } from './components/shop-list/shop-list.component';
import { ShopFormComponent } from './components/shop-form/shop-form.component';
import { CatalogListComponent } from './components/catalog-list/catalog-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { TenantSettingsComponent } from './components/tenant-settings/tenant-settings.component';

@NgModule({
    declarations: [
        ShopListComponent,
        ShopFormComponent,
        CatalogListComponent,
        ProductFormComponent,
        TenantSettingsComponent
    ],
    imports: [
        SharedModule,
        TenantSpaceRoutingModule
    ]
})
export class TenantSpaceModule { }
