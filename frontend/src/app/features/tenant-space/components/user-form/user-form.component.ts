import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseFormComponent } from '../../../../shared/abstractions/base-form.component';
import { FormSectionConfig } from '../../../../shared/abstractions/form-config.model';
import { ShopAdminService } from '../../services/shop-admin.service';
import { ShopService } from '../../services/shop.service';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './user-form.component.html'
})
export class UserFormComponent extends BaseFormComponent<any> {
    pageTitle = 'Nouveau Shop Admin';

    formConfig: FormSectionConfig[] = [
        {
            title: '1. Sélection de la Boutique',
            fields: [
                {
                    key: 'shopId',
                    label: 'Boutique',
                    type: 'select',
                    validators: [Validators.required],
                    options: [],
                    placeholder: 'Sélectionnez une boutique',
                    icon: 'store'
                }
            ]
        },
        {
            title: '2. Informations de l\'utilisateur',
            fields: [
                { key: 'firstName', label: 'Prénom', type: 'text', validators: [Validators.required, Validators.minLength(2)], placeholder: 'Prénom', icon: 'person' },
                { key: 'lastName', label: 'Nom', type: 'text', validators: [Validators.required, Validators.minLength(2)], placeholder: 'Nom', icon: 'person' },
                { key: 'email', label: 'Email', type: 'email', validators: [Validators.required, Validators.email], placeholder: 'email@example.com', icon: 'email' }
            ]
        },
        {
            title: '3. Profil',
            fields: [
                {
                    key: 'profile',
                    label: 'Profil',
                    type: 'select',
                    validators: [Validators.required],
                    options: [{ label: 'Administrateur de boutique', value: 'SHOP_ADMIN' }],
                    disabled: true,
                    hint: 'Seul le profil Administrateur de boutique est disponible pour le moment.',
                    icon: 'badge'
                }
            ]
        }
    ];

    constructor(
        protected shopAdminService: ShopAdminService,
        private shopService: ShopService
    ) {
        super(shopAdminService);
    }

    initForm(): void {
        this.form = this.fb.group({
            shopId: ['', Validators.required],
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            profile: [{ value: 'SHOP_ADMIN', disabled: true }, Validators.required]
        });

        this.loadShops();
    }

    loadShops(): void {
        this.shopService.getAll({ page: 0, size: 100 }).subscribe({
            next: (response) => {
                let shops: any[] = [];
                if ((response as any).content) {
                    shops = (response as any).content;
                } else if (Array.isArray(response)) {
                    shops = response;
                }

                // Update options dynamically
                const shopSection = this.formConfig.find(s => s.fields.some(f => f.key === 'shopId'));
                if (shopSection) {
                    const shopField = shopSection.fields.find(f => f.key === 'shopId');
                    if (shopField) {
                        shopField.options = shops.map(shop => ({
                            label: `${shop.name} (${shop.city})`,
                            value: shop.id
                        }));
                    }
                }
            },
            error: (err) => console.error('Error loading shops', err)
        });
    }

    patchForm(item: any): void {
        // Implement if edit mode is needed
        this.pageTitle = `Éditer : ${item.firstName} ${item.lastName}`;
        this.form.patchValue(item);
    }

    getRedirectUrl(): string {
        return '/tenant/users';
    }

    getSubmitLabel(): string {
        return this.isEditMode ? 'Modifier' : 'Créer l\'utilisateur';
    }
}
