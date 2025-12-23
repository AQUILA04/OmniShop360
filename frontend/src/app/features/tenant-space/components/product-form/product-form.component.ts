import { Component } from '@angular/core';
import { BaseFormComponent } from '../../../../shared/abstractions/base-form.component';
import { Product, ProductVariant } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { FormArray, Validators, FormGroup, FormControl } from '@angular/forms';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    standalone: false
})
export class ProductFormComponent extends BaseFormComponent<Product> {
    pageTitle = 'Nouveau Produit';

    // Pricing Security (US-008)
    canSeePurchasePrice = false;

    constructor(
        protected productService: ProductService,
        private permissionsService: NgxPermissionsService
    ) {
        super(productService);
        // Determine if user can see purchase price
        this.permissionsService.hasPermission('ROLE_TENANT_ADMIN').then((has: boolean) => {
            this.canSeePurchasePrice = has;
        });
    }

    initForm(): void {
        this.form = this.fb.group({
            name: ['', Validators.required],
            sku: ['', Validators.required],
            category: ['', Validators.required],
            description: [''],

            // Pricing
            salePrice: [0, [Validators.required, Validators.min(0)]],
            purchasePrice: [0, [Validators.min(0)]],

            hasVariants: [false],
            variants: this.fb.array([])
        });

        // Watch for variants toggle
        this.form.get('hasVariants')?.valueChanges.subscribe(hasVariants => {
            if (hasVariants) {
                this.addVariant();
            } else {
                this.variants.clear();
            }
        });
    }

    get variants(): FormArray {
        return this.form.get('variants') as FormArray;
    }

    addVariant(): void {
        const variantGroup = this.fb.group({
            sku: ['', Validators.required],
            size: [''],
            color: [''],
            stock: [0]
        });
        this.variants.push(variantGroup);
    }

    removeVariant(index: number): void {
        this.variants.removeAt(index);
    }

    patchForm(item: Product): void {
        this.pageTitle = `Éditer : ${item.name}`;
        this.form.patchValue(item);

        // Handle variants
        this.variants.clear();
        if (item.variants && item.variants.length > 0) {
            item.variants.forEach(v => {
                const g = this.fb.group({
                    sku: [v.sku, Validators.required],
                    size: [v.size],
                    color: [v.color],
                    stock: [v.stock]
                });
                this.variants.push(g);
            });
        }
    }

    getRedirectUrl(): string {
        return '/tenant/catalog';
    }

    // Margin Calculation
    get marginPercentage(): number | null {
        const sale = this.form.get('salePrice')?.value;
        const purchase = this.form.get('purchasePrice')?.value;

        if (sale > 0 && purchase >= 0) {
            return ((sale - purchase) / sale) * 100;
        }
        return null;
    }
}
