import { Component } from '@angular/core';
import { BaseListComponent } from '../../../../shared/abstractions/base-list.component';
import { Shop } from '../../models/shop.model';
import { ShopService } from '../../services/shop.service';
import { ColumnConfig } from '../../../../shared/abstractions/column-config.model';

@Component({
    selector: 'app-shop-list',
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
export class ShopListComponent extends BaseListComponent<Shop> {
    pageTitle = 'Gestion des Boutiques';

    columnsConfig: ColumnConfig[] = [
        { key: 'name', label: 'Nom', sortable: true },
        { key: 'city', label: 'Ville', sortable: true },
        { key: 'status', label: 'Statut', type: 'status' },
        { key: 'userCount', label: 'Staff', type: 'text', sortable: false }
    ];

    constructor(protected shopService: ShopService) {
        super(shopService);
    }
}
