import { Component } from '@angular/core';
import { BaseListComponent } from '../../../../shared/abstractions/base-list.component';
import { ColumnConfig } from '../../../../shared/abstractions/column-config.model';
import { ShopAdminService } from '../../services/shop-admin.service';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent extends BaseListComponent<any> {
  pageTitle = 'Utilisateurs';

  columnsConfig: ColumnConfig[] = [
    { key: 'firstName', label: 'Prénom', sortable: true, type: 'text' },
    { key: 'lastName', label: 'Nom', sortable: true, type: 'text' },
    { key: 'email', label: 'Email', sortable: true, type: 'email' },
    // Add status or role if available
  ];

  constructor(protected shopAdminService: ShopAdminService) {
    super(shopAdminService);
  }

  // Override to handle empty state gracefully while endpoint might be missing
  override loadData(): void {
    // In a real scenario, this would call super.loadData()
    // For now, ensuring no crash if endpoint doesn't exist 
    // or if we just want to show the list structure
    super.loadData();
  }
}
