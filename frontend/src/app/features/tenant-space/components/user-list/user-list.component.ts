import {Component, inject} from '@angular/core';
import { BaseListComponent } from '../../../../shared/abstractions/base-list.component';
import { ColumnConfig } from '../../../../shared/abstractions/column-config.model';
import { ShopAdminService } from '../../services/shop-admin.service';
import { SharedModule } from '../../../../shared/shared.module';
import { UserResponse } from '../../../../shared/models/user.model';
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent extends BaseListComponent<UserResponse> {
  pageTitle = 'Utilisateurs';
  protected override router = inject(Router);

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

  override onAction(event: { action: string, item: UserResponse }): void {
    switch (event.action) {
      case 'details':
        // Adaptez l'URL selon votre fichier de routing exact
        this.router.navigate(['/shop-admin/users/details', event.item.id]);
        break;
      case 'edit':
        this.router.navigate(['/shop-admin/users/edit', event.item.id]);
        break;
      case 'create':
        this.router.navigate(['/shop-admin/users/create']);
        break;
      case 'delete':
        // Laisse le BaseListComponent gérer la suppression (ex: ouverture d'une modale de confirmation)
        super.onAction(event);
        break;
      default:
        super.onAction(event);
        break;
    }
  }
}
