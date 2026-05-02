import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-success-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="modal-overlay" *ngIf="isOpen">
      <div class="modal-content">
        <div class="success-icon-container">
          <div class="success-icon-bg">
            <svg class="success-icon" width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <h2 class="success-title">Paiement réussi !</h2>
        <p class="success-subtitle">La transaction a été traitée avec succès</p>
        
        <div class="receipt-summary">
          <div class="summary-meta">
             <span class="meta-label">Ticket</span>
             <span class="meta-value ticket-number">#{{ ticketNumber }}</span>
          </div>

          <div class="summary-amount">
            <span class="amount-label">Montant payé</span>
            <span class="amount-value">{{ totalAmount | currency:'EUR':'symbol':'1.2-2' }}</span>
          </div>

          <div class="summary-meta change-row" *ngIf="change > 0">
             <span class="meta-label">Monnaie rendue</span>
             <span class="meta-value return">{{ change | currency:'EUR':'symbol':'1.2-2' }}</span>
          </div>
        </div>

        <div class="modal-actions">
          <div class="secondary-actions">
            <button class="action-btn" (click)="onPrint()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9V2H18V9M6 18H18V22H6V18ZM6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Imprimer
            </button>
            <button class="action-btn" (click)="onPrintInvoice()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Facture
            </button>
          </div>
          <button class="btn-primary-large" (click)="onNewSale()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouvelle Vente
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(26, 32, 53, 0.5); backdrop-filter: blur(8px);
      z-index: 5000; display: flex; align-items: center; justify-content: center;
      padding: 24px;
    }

    .modal-content {
      background: #ffffff; width: 100%; max-width: 440px; border-radius: 20px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.15); padding: 40px 32px 32px;
      text-align: center; animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    .success-icon-container { display: flex; justify-content: center; margin-bottom: 24px; }
    
    .success-icon-bg {
      width: 80px; height: 80px; border-radius: 50%;
      background-color: #10B981; /* Pure solid success green */
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.35);
      animation: popBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      transform: scale(0);
    }
    
    .success-icon { color: white; stroke-dasharray: 100; stroke-dashoffset: 100; animation: dash 0.6s ease-out 0.2s forwards; }

    @keyframes popBounce { to { transform: scale(1); } }
    @keyframes dash { to { stroke-dashoffset: 0; } }

    .success-title { font-size: 24px; font-weight: 800; color: #1a2035; margin: 0 0 8px 0; font-family: 'Inter', sans-serif; }
    .success-subtitle { font-size: 14px; color: #676c73; margin: 0 0 32px 0; }

    .receipt-summary {
      background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px;
      margin-bottom: 32px; display: flex; flex-direction: column; gap: 16px;
    }

    .summary-meta {
       display: flex; justify-content: space-between; align-items: center;
       padding-bottom: 16px; border-bottom: 1px dashed #CBD5E1;
    }
    .summary-meta.change-row {
       padding-bottom: 0; padding-top: 16px; border-bottom: none; border-top: 1px dashed #CBD5E1;
    }

    .meta-label { font-size: 13px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; }
    .meta-value { font-size: 14px; font-weight: 600; color: #0F172A; }
    .ticket-number { font-family: monospace; background: #EEF2F6; padding: 4px 8px; border-radius: 6px; letter-spacing: 0.5px; }
    .meta-value.return { color: #059669; font-size: 18px; font-weight: 800; }

    .summary-amount { display: flex; flex-direction: column; gap: 4px; padding: 8px 0; }
    .amount-label { font-size: 13px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; }
    .amount-value { font-size: 42px; font-weight: 800; color: #10B981; letter-spacing: -1px; line-height: 1; }

    .modal-actions { display: flex; flex-direction: column; gap: 12px; }
    
    .secondary-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    .action-btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 14px; font-size: 14px; font-weight: 600; border-radius: 12px;
      background: white; border: 1px solid #E2E8F0; color: #334155;
      cursor: pointer; transition: all 0.2s ease;
    }
    .action-btn:hover { background: #F8FAFC; border-color: #CBD5E1; color: #0F172A; }

    .btn-primary-large {
       display: flex; align-items: center; justify-content: center; gap: 8px;
       width: 100%; padding: 16px; font-size: 16px; font-weight: 700;
       border-radius: 12px; border: none; cursor: pointer; color: white;
       background: linear-gradient(135deg, #005cad 0%, #2075d0 100%);
       box-shadow: 0 8px 20px rgba(32, 117, 208, 0.3); transition: all 0.2s;
    }
    .btn-primary-large:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(32, 117, 208, 0.4); }
    .btn-primary-large:active { transform: translateY(0); }
  `]
})
export class SuccessModalComponent {
    @Input() isOpen = false;
    @Input() ticketNumber = '';
    @Input() totalAmount = 0;
    @Input() paymentMethod = 'Espèces';
    @Input() transactionDate = new Date();
    @Input() change = 0;

    @Output() print = new EventEmitter<void>();
    @Output() printInvoice = new EventEmitter<void>();
    @Output() newSale = new EventEmitter<void>();

    onPrint() {
        this.print.emit();
    }

    onPrintInvoice() {
        this.printInvoice.emit();
    }

    onNewSale() {
        this.newSale.emit();
    }
}
