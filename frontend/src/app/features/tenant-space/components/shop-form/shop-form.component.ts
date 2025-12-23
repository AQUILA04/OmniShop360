import { Component } from '@angular/core';
import { BaseFormComponent } from '../../../../shared/abstractions/base-form.component';
import { Shop } from '../../models/shop.model';
import { ShopService } from '../../services/shop.service';
import { Validators } from '@angular/forms';

@Component({
    selector: 'app-shop-form',
    templateUrl: './shop-form.component.html',
    standalone: false
})
export class ShopFormComponent extends BaseFormComponent<Shop> {
    pageTitle = 'Nouvelle Boutique';

    // TODO: Implement Shop Admin assignment UI when User Management feature is ready.
    // This will require fetching users and allowing selection/assignment to the shop.

    constructor(protected shopService: ShopService) {
        super(shopService);
    }

    initForm(): void {
        this.form = this.fb.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            postalCode: ['', Validators.required],
            phone: [''],
            email: ['', [Validators.required, Validators.email]],
            status: ['ACTIVE', Validators.required]
        });
    }

    patchForm(item: Shop): void {
        this.pageTitle = `Éditer : ${item.name}`;
        this.form.patchValue(item);
    }

    getRedirectUrl(): string {
        return '/tenant/shops';
    }
}
