import { Component } from '@angular/core';
import { BaseListComponent } from '../../../../shared/abstractions/base-list.component';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ColumnConfig } from '../../../../shared/abstractions/column-config.model';

@Component({
    selector: 'app-catalog-list',
    template: `
    <app-generic-list
      [pageTitle]="pageTitle"
      [isLoading]="isLoading"
      [data]="data"
      [columnsConfig]="columnsConfig"
      [resultsLength]="resultsLength"
      (pageChange)="onPageChange($event)"
      (sortChange)="onSortChange($event)"
      (searchChange)="onSearchChange($event)"
      (action)="onAction($event)">
    </app-generic-list>
  `,
    standalone: false
})
export class CatalogListComponent extends BaseListComponent<Product> {
    pageTitle = 'Catalogue Maître';

    columnsConfig: ColumnConfig[] = [
        { key: 'name', label: 'Produit', sortable: true },
        { key: 'sku', label: 'SKU', sortable: true },
        { key: 'category', label: 'Catégorie', sortable: true },
        { key: 'salePrice', label: 'Prix Vente', type: 'currency', sortable: true }
    ];

    constructor(protected productService: ProductService) {
        super(productService);
    }
}
