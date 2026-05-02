import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../core/models/customer.model';

@Component({
  selector: 'app-customer-create-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Créer un nouveau client</h2>
          <button class="close-btn" (click)="close()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Prénom *</label>
              <input type="text" [(ngModel)]="formData.firstName" placeholder="Saisir le prénom">
            </div>
            <div class="form-group">
              <label>Nom *</label>
              <input type="text" [(ngModel)]="formData.lastName" placeholder="Saisir le nom">
            </div>
          </div>
          
          <div class="form-group">
            <label>Téléphone *</label>
            <input type="text" [(ngModel)]="formData.phone" placeholder="Ex: 0612345678">
          </div>
          
          <div class="form-group">
            <label>Adresse e-mail</label>
            <input type="email" [(ngModel)]="formData.email" placeholder="Ex: client@email.com">
          </div>
          
          <div class="form-group">
            <label>Adresse physique</label>
            <input type="text" [(ngModel)]="formData.address" placeholder="Saisir l'adresse">
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Ville</label>
              <input type="text" [(ngModel)]="formData.city" placeholder="Ex: Paris">
            </div>
            <div class="form-group">
              <label>Code Postal</label>
              <input type="text" [(ngModel)]="formData.postalCode" placeholder="Ex: 75001">
            </div>
          </div>

          <div class="form-group">
            <label>Pays</label>
            <input type="text" [(ngModel)]="formData.country" placeholder="Ex: France">
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" (click)="close()">Annuler</button>
          <button class="btn-confirm" (click)="submit()" [disabled]="!isValid() || isSubmitting">
            {{ isSubmitting ? 'Création...' : 'Créer le client' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(26, 32, 53, 0.5); backdrop-filter: blur(4px);
      z-index: 5000; display: flex; align-items: center; justify-content: center; padding: 24px;
    }
    .modal-content {
      background: #ffffff; width: 100%; max-width: 540px; border-radius: 16px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.15); display: flex; flex-direction: column;
      animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    .modal-header {
      padding: 24px 32px 16px; display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid #f0f0f0;
    }
    .modal-header h2 { font-size: 20px; font-weight: 700; margin: 0; color: #1a2035; }
    .close-btn { background: none; border: none; cursor: pointer; color: #676c73; transition: color 0.2s; }
    .close-btn:hover { color: #1a2035; }
    .modal-body {
      padding: 24px 32px; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;
    }
    .form-row { display: flex; gap: 16px; }
    .form-row .form-group { flex: 1; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 13px; font-weight: 600; color: #676c73; }
    .form-group input {
      padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px;
      color: #1a2035; outline: none; transition: all 0.2s;
    }
    .form-group input:focus { border-color: #005cad; box-shadow: 0 0 0 3px rgba(0, 92, 173, 0.1); }
    .modal-footer {
      padding: 16px 32px 24px; display: flex; gap: 12px; justify-content: flex-end;
      border-top: 1px solid #f0f0f0;
    }
    .btn-cancel {
      padding: 12px 20px; border: 1px solid #e2e8f0; border-radius: 10px; background: white;
      color: #676c73; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .btn-cancel:hover { background: #f8fafc; color: #1a2035; }
    .btn-confirm {
      padding: 12px 24px; border: none; border-radius: 10px;
      background: linear-gradient(135deg, #005cad 0%, #2075d0 100%);
      color: white; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .btn-confirm:hover:not(:disabled) { box-shadow: 0 6px 16px rgba(0, 92, 173, 0.3); transform: translateY(-1px); }
    .btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class CustomerCreateModalComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() customerCreated = new EventEmitter<Customer>();
  @Output() errorCreate = new EventEmitter<string>();

  isSubmitting = false;

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  };

  constructor(private customerService: CustomerService) {}

  isValid(): boolean {
    return !!this.formData.firstName.trim() && 
           !!this.formData.lastName.trim() && 
           !!this.formData.phone.trim();
  }

  close() {
    this.closeEvent.emit();
    // Reset form on next open
    setTimeout(() => {
        this.resetForm();
    }, 300);
  }

  resetForm() {
      this.formData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
      };
      this.isSubmitting = false;
  }

  submit() {
    if (!this.isValid()) return;
    
    this.isSubmitting = true;
    
    // UUID Generation for offline mode standard if needed is handled via backend if connected.
    // In strict offline, we would inject a temp string UUID. 
    // Here we just use the raw post directly over HTTP.

    this.customerService.create(this.formData as any).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        // The service Response wrapper often encapsulates data in generic objects.
        // E.g., res.data depending on BaseCrudService implementation. Actually BaseCrudService unpacks 'data' typically.
        const createdCustomer = res.data ? res.data : res;
        this.customerCreated.emit(createdCustomer);
        this.close();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error creating customer:', err);
        const errMsg = err?.error?.message || 'Erreur inconnue';
        this.errorCreate.emit('Erreur: Impossible de créer le client. ' + errMsg);
      }
    });
  }
}
