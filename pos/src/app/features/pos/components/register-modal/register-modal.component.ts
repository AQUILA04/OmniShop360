import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen">
      <div class="modal-content fade-in" [class.closing-mode]="mode === 'close'">
        
        <div class="modal-header">
          <h2>{{ mode === 'open' ? 'Ouverture de Caisse' : 'Clôture de Caisse' }}</h2>
          <button class="close-btn" *ngIf="!isForced" (click)="close.emit()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>

        <div class="modal-body">
          <p class="instruction-text">
            {{ mode === 'open' 
                ? 'Veuillez renseigner le fond de caisse initial avant de commencer les encaissements.' 
                : 'Veuillez compter votre caisse et indiquer le montant final.' }}
          </p>

          <div class="form-group">
            <label>Montant en caisse (Espèces)</label>
            <div class="amount-input-wrapper">
              <span class="currency">€</span>
              <input type="number" [(ngModel)]="amount" class="amount-input" min="0" step="0.01" />
            </div>
          </div>

          <div class="form-group" *ngIf="mode === 'close'">
            <div class="summary-box">
              <div class="summary-row">
                <span>Fond de caisse (Ouverture):</span>
                <span>{{ openingBalance | currency:'EUR' }}</span>
              </div>
              <div class="summary-row">
                <span>Ventes Espèces (Théorique):</span>
                <span>{{ expectedCashSales | currency:'EUR' }}</span>
              </div>
              <div class="summary-row total-expected">
                <span>Attendu:</span>
                <span>{{ (openingBalance + expectedCashSales) | currency:'EUR' }}</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Notes / Remarques</label>
            <textarea [(ngModel)]="notes" rows="2" class="notes-input" placeholder="Justification éventuelle (obligatoire si écart)"></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" *ngIf="!isForced" (click)="close.emit()">Annuler</button>
          <button class="btn-primary" [disabled]="amount === null || amount < 0" (click)="submit()">
            {{ mode === 'open' ? 'Ouvrir la Caisse' : 'Clôturer la Caisse' }}
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
      z-index: 1000; display: flex; align-items: center; justify-content: center;
    }
    .modal-content {
      background: #fff; width: 420px; border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2); overflow: hidden;
    }
    .fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    
    .modal-header {
      padding: 20px 24px; border-bottom: 1px solid #eee;
      display: flex; justify-content: space-between; align-items: center;
    }
    .modal-header h2 { margin: 0; font-size: 18px; color: #1a2035; }
    .close-btn { background: none; border: none; cursor: pointer; color: #9BA3AF; padding: 4px; }
    .close-btn:hover { color: #1a2035; }
    
    .modal-body { padding: 24px; }
    .instruction-text { font-size: 14px; color: #676C73; margin-top: 0; margin-bottom: 24px; line-height: 1.5; }
    
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: #1a2035; margin-bottom: 8px; }
    
    .amount-input-wrapper {
      position: relative; display: flex; align-items: center;
    }
    .currency {
      position: absolute; left: 16px; font-size: 20px; font-weight: 600; color: #676C73;
    }
    .amount-input {
      width: 100%; padding: 12px 16px 12px 40px; font-size: 24px; font-weight: 700; color: #1a2035;
      border: 2px solid #E8EDF5; border-radius: 12px; outline: none; transition: border-color 0.2s;
    }
    .amount-input:focus { border-color: #2075d0; }
    
    .notes-input {
      width: 100%; padding: 12px; font-size: 14px; border: 1px solid #E8EDF5; border-radius: 10px; resize: none; font-family: inherit; outline: none;
    }
    .notes-input:focus { border-color: #2075d0; }
    
    .summary-box {
      background: #F4F2FF; border-radius: 10px; padding: 16px; margin-bottom: 12px;
    }
    .summary-row {
      display: flex; justify-content: space-between; font-size: 13px; color: #555663; margin-bottom: 8px;
    }
    .summary-row.total-expected {
      margin-top: 12px; border-top: 1px dashed #C6D1D7; padding-top: 12px; font-weight: 700; color: #1a2035; font-size: 15px;
    }
    
    .modal-footer {
      padding: 16px 24px; border-top: 1px solid #eee; background: #fafafa;
      display: flex; justify-content: flex-end; gap: 12px;
    }
    
    .btn-cancel {
      padding: 10px 20px; border: none; background: transparent; color: #676C73; font-weight: 600; border-radius: 8px; cursor: pointer;
    }
    .btn-cancel:hover { background: #f0f0f0; }
    
    .btn-primary {
      padding: 10px 24px; border: none; background: linear-gradient(135deg, #005cad 0%, #2075d0 100%);
      color: #fff; font-weight: 600; border-radius: 8px; cursor: pointer; transition: opacity 0.2s;
    }
    .btn-primary:hover:not(:disabled) { opacity: 0.9; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class RegisterModalComponent {
  @Input() isOpen = false;
  @Input() mode: 'open' | 'close' = 'open';
  @Input() isForced = false; // If forced, user cannot close without submitting
  @Input() openingBalance = 0;
  @Input() expectedCashSales = 0;

  @Output() close = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<{ amount: number, notes: string }>();

  amount: number = 0;
  notes: string = '';

  submit() {
    this.submitEvent.emit({ amount: this.amount, notes: this.notes });
    this.amount = 0;
    this.notes = '';
  }
}
