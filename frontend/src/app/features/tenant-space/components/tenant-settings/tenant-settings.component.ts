import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TenantSettingsService } from '../../services/tenant-settings.service';
import { PricePolicy } from '../../models/tenant-settings.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-tenant-settings',
    templateUrl: './tenant-settings.component.html',
    standalone: false
})
export class TenantSettingsComponent implements OnInit {
    form: FormGroup;
    isLoading = false;
    isSaving = false;
    pricePolicies = Object.values(PricePolicy);

    constructor(
        private fb: FormBuilder,
        private settingsService: TenantSettingsService,
        private toastr: ToastrService
    ) {
        this.form = this.fb.group({
            pricePolicy: [PricePolicy.GLOBAL_ENFORCED]
        });
    }

    ngOnInit(): void {
        this.loadSettings();
    }

    loadSettings(): void {
        this.isLoading = true;
        this.settingsService.getSettings().subscribe({
            next: (settings) => {
                this.form.patchValue(settings);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading settings', err);
                // Fallback or mock for now since backend might not exist
                // this.form.patchValue({ pricePolicy: PricePolicy.GLOBAL_ENFORCED }); 
                this.isLoading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        this.isSaving = true;
        this.settingsService.updateSettings(this.form.value).subscribe({
            next: (updated) => {
                this.toastr.success('Paramètres sauvegardés avec succès');
                this.form.patchValue(updated);
                this.isSaving = false;
            },
            error: (err) => {
                this.toastr.error('Erreur lors de la sauvegarde');
                this.isSaving = false;
            }
        });
    }
}
