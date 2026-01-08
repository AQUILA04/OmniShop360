import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { FormSectionConfig } from '../../../../shared/abstractions/form-config.model';
import { CategoryService } from '../../services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-category-form',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './category-form.component.html',
    styles: []
})
export class CategoryFormComponent {
    formConfig: FormSectionConfig[] = [{
        fields: [
            { key: 'name', label: 'Nom de la catégorie', type: 'text', validators: [Validators.required] },
            { key: 'code', label: 'Code', type: 'text', validators: [Validators.required], hint: 'Identifiant unique (ex: VETEMENTS)' },
            { key: 'description', label: 'Description', type: 'textarea' }
        ]
    }];

    formGroup: FormGroup;
    isEditMode = false;
    categoryId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private categoryService: CategoryService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.formGroup = this.fb.group({
            name: ['', Validators.required],
            description: ['']
        });

        this.categoryId = this.route.snapshot.paramMap.get('id');
        if (this.categoryId) {
            this.isEditMode = true;
            this.loadCategory(this.categoryId);
        }
    }

    loadCategory(id: string) {
        this.categoryService.getById(id).subscribe(category => {
            this.formGroup.patchValue(category);
        });
    }

    onSubmit(formValue: any) {
        if (this.isEditMode) {
            // Update logic would go here if/when update is supported
            this.snackBar.open('Modification non supportée pour le moment', 'Fermer', { duration: 3000 });
        } else {
            this.categoryService.create(formValue).subscribe({
                next: () => {
                    this.snackBar.open('Catégorie créée avec succès', 'Fermer', { duration: 3000 });
                    this.router.navigate(['/tenant/categories']);
                },
                error: (err) => {
                    console.error('Error creating category', err);
                    this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
                }
            });
        }
    }

    onCancel() {
        this.router.navigate(['/tenant/categories']);
    }
}
