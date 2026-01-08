import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { BaseListComponent } from '../../../../shared/abstractions/base-list.component';
import { ColumnConfig } from '../../../../shared/abstractions/column-config.model';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../models/category.model';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './category-list.component.html',
    styles: []
})
export class CategoryListComponent extends BaseListComponent<CategoryResponse> {
    pageTitle = 'Catégories';
    columnsConfig: ColumnConfig[] = [
        { key: 'name', label: 'Nom', sortable: true },
        { key: 'code', label: 'Code', sortable: true },
        { key: 'description', label: 'Description', sortable: true }
    ];

    constructor(private categoryService: CategoryService) {
        super(categoryService);
    }

    // Optional: Override action methods if custom navigation logic is needed
    // For now, default implementation in BaseListComponent matches our needs roughly
    // BUT BaseListComponent assumes /edit and /details paths.
    // My previous implementation used /tenant/categories/:id for edit.
    // BaseListComponent.editItem uses: router.navigate([`${currentUrl}/edit`, item.id]);
    // which would be /tenant/categories/edit/:id
    // My routing is /tenant/categories/:id for edit.
    // So I should override editItem.

    override editItem(item: CategoryResponse) {
        this.router.navigate(['/tenant/categories', item.id]);
    }
}
