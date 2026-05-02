import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseListComponent } from '../../../shared/abstractions/base-list.component';
import { InventoryService } from '../services/inventory.service';
import { InventoryResponse } from '../models/inventory.model';
import { ColumnConfig } from '../../../shared/abstractions/column-config.model';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['../../../shared/abstractions/base-list.component.scss']
})
export class InventoryListComponent extends BaseListComponent<InventoryResponse> {
  pageTitle = 'Gestion des Stocks';

  // Dans inventory-list.component.ts
  columnsConfig: ColumnConfig[] = [
    { key: 'productName', label: 'Produit', sortable: true },
    { key: 'productSku', label: 'SKU', sortable: true },
    { key: 'quantity', label: 'Quantité Totale', sortable: true, type: 'text' },
    {
      key: 'availableQuantity',
      label: 'Disponible',
      sortable: true,
      type: 'text',
      // Utilisation des classes premium définies dans le SCSS ci-dessus
      cssClass: (item: InventoryResponse) => item.lowStock ? 'badge-premium badge-danger' : 'badge-premium badge-success'
    },
    { key: 'minStockLevel', label: 'Niveau Min', sortable: true, type: 'text' },
    { key: 'maxStockLevel', label: 'Niveau Max', sortable: true, type: 'text' }
  ];

  constructor(protected inventoryService: InventoryService) {
    super(inventoryService);
  }

  override onAction(event: { action: string, item: InventoryResponse }): void {
    switch (event.action) {
      case 'create':
        this.router.navigate(['/shop-admin/stock-movement']);
        break;
      default:
        super.onAction(event);
        break;
    }
  }
}
