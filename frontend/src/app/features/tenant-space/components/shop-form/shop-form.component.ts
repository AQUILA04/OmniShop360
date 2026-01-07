import { Component } from '@angular/core';
import { BaseFormComponent } from '../../../../shared/abstractions/base-form.component';
import { Shop } from '../../models/shop.model';
import { ShopService } from '../../services/shop.service';
import { Validators } from '@angular/forms';
import { FormSectionConfig } from '../../../../shared/abstractions/form-config.model';

@Component({
    selector: 'app-shop-form',
    templateUrl: './shop-form.component.html',
    styleUrls: ['./shop-form.component.scss'],
    standalone: false
})
export class ShopFormComponent extends BaseFormComponent<Shop> {
    pageTitle = 'Nouvelle Boutique';

    // Configuration for Generic Form
    formConfig: FormSectionConfig[] = [
        {
            fields: [
                { key: 'name', label: 'Nom de la boutique', type: 'text', validators: [Validators.required], placeholder: 'Ex: Ma Super Boutique', icon: 'store' },
                { key: 'active', label: 'Actif', type: 'slide-toggle', hint: 'Désactivez pour rendre la boutique inaccessible temporairement' }
            ]
        },
        {
            fields: [
                { key: 'address', label: 'Adresse', type: 'text', validators: [Validators.required], placeholder: '123 rue du Commerce', icon: 'place' },
                { key: 'city', label: 'Ville', type: 'text', validators: [Validators.required], placeholder: 'Paris', icon: 'apartment' },
                { key: 'postalCode', label: 'Code Postal', type: 'text', validators: [Validators.required], placeholder: '75001', icon: 'markunread_mailbox' }
            ]
        },
        {
            fields: [
                { key: 'phone', label: 'Téléphone', type: 'text', placeholder: '+33 1 23 45 67 89', icon: 'phone' },
                { key: 'email', label: 'Email de contact', type: 'email', validators: [Validators.required, Validators.email], placeholder: 'contact@boutique.com', icon: 'email' }
            ]
        }
    ];

    constructor(protected shopService: ShopService) {
        super(shopService);
    }

    initForm(): void {
        this.form = this.fb.group({
            name: ['', Validators.required],
            active: [true], // Matches Model
            address: ['', Validators.required],
            city: ['', Validators.required],
            postalCode: ['', Validators.required],
            phone: [''],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    isReadOnly = false;

    getSubmitLabel(): string {
        return this.isEditMode ? 'Modifier' : 'Enregistrer';
    }

    patchForm(item: Shop): void {
        this.isReadOnly = this.route.snapshot.data['readOnly'] === true;
        if (this.isReadOnly) {
            this.pageTitle = `Détails : ${item.name}`;
            this.form.patchValue(item);
            this.form.disable();
        } else {
            this.pageTitle = `Éditer : ${item.name}`;
            this.form.patchValue(item);
        }
    }

    navigateToEdit(): void {
        if (this.itemId) {
            this.router.navigate(['/tenant/shops/edit', this.itemId]);
        }
    }

    // Override to handle redirect
    override onSubmit(): void {
        if (this.form.valid) {
            this.isSubmitting = true;
            const formValue = this.form.getRawValue();

            const request$ = this.isEditMode
                ? this.service.update(this.itemId!, formValue as Shop)
                : this.service.create(formValue as Shop);

            request$.subscribe({
                next: () => {
                    this.isSubmitting = false;
                    this.router.navigate([this.getRedirectUrl()]);
                },
                error: (err) => {
                    this.isSubmitting = false;
                    console.error('Error saving shop', err);
                }
            });
        } else {
            this.form.markAllAsTouched();
        }
    }

    getRedirectUrl(): string {
        return '/tenant/shops';
    }
}
