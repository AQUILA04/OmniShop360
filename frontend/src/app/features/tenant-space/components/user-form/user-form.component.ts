import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseFormComponent } from '../../../../shared/abstractions/base-form.component';
import { FormSectionConfig } from '../../../../shared/abstractions/form-config.model';
import { ShopAdminService } from '../../services/shop-admin.service';
import { ShopService } from '../../services/shop.service';
import { SharedModule } from '../../../../shared/shared.module';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './user-form.component.html'
})
export class UserFormComponent extends BaseFormComponent<any> {
    pageTitle = 'Nouvel Utilisateur';
    isShopAdmin = false;

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
                    options: [
                        { label: 'Administrateur de boutique', value: 'SHOP_ADMIN' },
                        { label: 'Caissier', value: 'CASHIER' },
                        { label: 'Gestionnaire de stock', value: 'STOCK_MANAGER' }
                    ],
                    disabled: false,
                    icon: 'badge'
                }
            ]
        }
    ];

    constructor(
        protected shopAdminService: ShopAdminService,
        private shopService: ShopService,
        private permissionsService: NgxPermissionsService
    ) {
        super(shopAdminService);
    }

    initForm(): void {
        this.form = this.fb.group({
            shopId: ['', Validators.required],
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            profile: ['SHOP_ADMIN', Validators.required]
        });

        this.checkPermissions();
        this.loadShops();
    }

    checkPermissions(): void {
        const permissions = this.permissionsService.getPermissions();

        // If Tenant Admin, they have full access (can create SHOP_ADMIN and CASHIER)
        if (permissions['ROLE_TENANT_ADMIN'] || permissions['ROLE_superadmin']) {
            return;
        }

        // If Shop Admin (and not Tenant Admin), restrict to Cashier
        if (permissions['ROLE_SHOP_ADMIN']) {
            this.isShopAdmin = true;

            // Shop Admin can create Cashiers and Stock Managers
            // We set a default value but keep it enabled
            if (!this.form.get('profile')?.value || this.form.get('profile')?.value === 'SHOP_ADMIN') {
                this.form.get('profile')?.setValue('CASHIER');
            }

            // Update profile options to only show Cashier and Stock Manager
            const profileSection = this.formConfig.find(s => s.fields.some(f => f.key === 'profile'));
            if (profileSection) {
                const profileField = profileSection.fields.find(f => f.key === 'profile');
                if (profileField) {
                    profileField.options = [
                        { label: 'Caissier', value: 'CASHIER' },
                        { label: 'Gestionnaire de stock', value: 'STOCK_MANAGER' }
                    ];
                    // profileField.disabled = true; // No longer disabled
                    profileField.hint = 'En tant qu\'administrateur de boutique, vous pouvez créer des caissiers et des gestionnaires de stock.';
                }
            }
        }
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

                        // If Shop Admin and only one shop, auto-select it
                        if (this.isShopAdmin && shops.length === 1) {
                            this.form.get('shopId')?.setValue(shops[0].id);
                            // We can also disable it if we want to enforce it
                            // this.form.get('shopId')?.disable();
                        }
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

    override onSubmit(): void {
        if (this.form.invalid) {
            return;
        }

        this.isLoading = true;
        this.isSubmitting = true;
        // Use getRawValue() to include disabled fields (like profile for Shop Admin)
        const request = this.form.getRawValue();

        this.service.create(request).subscribe({
            next: () => {
                this.handleSuccess('Utilisateur créé avec succès');
            },
            error: (error) => {
                this.handleError(error, 'Erreur lors de la création de l\'utilisateur');
            }
        });
    }
}
