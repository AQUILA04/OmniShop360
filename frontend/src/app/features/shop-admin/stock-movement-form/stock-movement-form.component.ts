import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../shared/abstractions/base-form.component';
import { StockMovementService } from '../services/stock-movement.service';
import { ProductService } from '../../tenant-space/services/product.service';
import { StockMovementResponse } from '../models/stock-movement.model';
import { ToastService } from '../../../shared/services/toast.service';
import { FormSectionConfig } from '../../../shared/abstractions/form-config.model';

@Component({
  selector: 'app-stock-movement-form',
  templateUrl: './stock-movement-form.component.html',
  styleUrls: ['./stock-movement-form.component.scss']
})
export class StockMovementFormComponent extends BaseFormComponent<StockMovementResponse> implements OnInit {
  pageTitle = 'Réception de Marchandises';

  formConfig: FormSectionConfig[] = [
    {
      fields: [
        {
          key: 'productId',
          label: 'Produit',
          type: 'select',
          options: [], // Sera rempli dynamiquement
          validators: [Validators.required],
          icon: 'inventory_2'
        },
        {
          key: 'quantity',
          label: 'Quantité',
          type: 'number',
          placeholder: 'Entrez la quantité',
          validators: [Validators.required, Validators.min(0.01)],
          icon: 'numbers'
        },
        {
          key: 'unitCost',
          label: 'Prix Unitaire (€)',
          type: 'number',
          placeholder: 'Prix d\'achat unitaire',
          icon: 'euro_symbol'
        },
        {
          key: 'notes',
          label: 'Notes',
          type: 'textarea',
          placeholder: 'Informations complémentaires',
          icon: 'note'
        }
      ]
    }
  ];

  constructor(
    protected stockMovementService: StockMovementService,
    protected productService: ProductService,
    protected override toastService: ToastService,
    protected override fb: FormBuilder,
    protected override router: Router,
    protected override route: ActivatedRoute
  ) {
    super(stockMovementService);
  }

  override ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  initForm(): void {
    this.form = this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0.01)]],
      unitCost: [null],
      notes: ['']
    });
  }

  patchForm(item: StockMovementResponse): void {
    // Not needed for creation form
  }

  getRedirectUrl(): string {
    return '/shop-admin/inventory';
  }

  private loadProducts(): void {
    this.productService.getAll({page: 0, size: 100}).subscribe({
      next: (response) => {
        const productOptions = response.content.map(p => ({
          label: `${p.name} (${p.sku})`,
          value: p.id
        }));

        // Mettre à jour la configuration avec les options chargées
        // On crée une nouvelle référence pour déclencher la détection de changement si nécessaire
        this.formConfig = [{
          ...this.formConfig[0],
          fields: this.formConfig[0].fields.map(field => {
            if (field.key === 'productId') {
              return { ...field, options: productOptions };
            }
            return field;
          })
        }];
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.toastService.showError('Erreur lors du chargement des produits');
      }
    });
  }

  override onSubmit(): void {
    // La méthode onSubmit est appelée par le generic-form via l'event (formSubmit)
    // Mais ici on surcharge la méthode de BaseFormComponent qui est appelée manuellement
    // On va adapter pour que generic-form appelle une méthode qui appelle super.onSubmit() ou similaire
    // Cependant, BaseFormComponent.onSubmit() utilise this.form.value.
    // GenericFormComponent émet les valeurs brutes.

    if (this.form.valid) {
      this.isSubmitting = true;
      this.stockMovementService.create(this.form.value).subscribe({
        next: () => {
          this.toastService.showSuccess('Mouvement enregistré avec succès');
          this.router.navigate([this.getRedirectUrl()]);
        },
        error: (err) => {
          this.toastService.showError('Erreur lors de l\'enregistrement');
          this.isSubmitting = false;
        }
      });
    }
  }

  // Méthode appelée par l'événement du composant générique
  onGenericFormSubmit(formData: any): void {
    // On met à jour le form interne si nécessaire, ou on utilise directement formData
    this.form.patchValue(formData);
    this.onSubmit();
  }
}
