import { Component } from '@angular/core';
import { BaseListComponent } from '../../../../shared/abstractions/base-list.component';
import { ColumnConfig } from '../../../../shared/abstractions/column-config.model';
import { ShopAdminService } from '../../services/shop-admin.service';
import { SharedModule } from '../../../../shared/shared.module';
import { UserResponse } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent extends BaseListComponent<UserResponse> {
  pageTitle = 'Utilisateurs';

  columnsConfig: ColumnConfig[] = [
    { key: 'firstName', label: 'Prénom', sortable: true, type: 'text' },
    { key: 'lastName', label: 'Nom', sortable: true, type: 'text' },
    { key: 'email', label: 'Email', sortable: true, type: 'text' },
    { key: 'active', label: 'Statut', sortable: true, type: 'text', mapValue: (val: boolean) => val ? 'Actif' : 'Inactif' },
    { key: 'role', label: 'Rôles', sortable: false, type: 'text', mapValue: (roles: any) => Array.isArray(roles) ? roles.join(', ') : roles }
  ];

  constructor(protected shopAdminService: ShopAdminService) {
    super(shopAdminService);
  }
}
