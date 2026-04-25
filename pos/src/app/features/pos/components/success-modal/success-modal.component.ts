import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-success-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="success-screen" *ngIf="isOpen">
      <div class="success-content">
        <div class="success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2"/>
            <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <h2 class="success-title">Paiement réussi !</h2>
        <p class="success-subtitle">Transaction terminée avec succès</p>
        
        <div class="ticket-info">
          <span class="ticket-label">Ticket</span>
          <span class="ticket-number">#{{ ticketNumber }}</span>
        </div>

        <div class="amount-display">
          <span class="amount-label">Montant payé</span>
          <span class="amount-value">{{ totalAmount | currency:'EUR':'symbol':'1.2-2' }}</span>
        </div>

        <div class="payment-info" *ngIf="change > 0">
          <span class="change-label">Monnaie rendue</span>
          <span class="change-value">{{ change | currency:'EUR':'symbol':'1.2-2' }}</span>
        </div>

        <div class="success-actions">
          <button class="action-btn print-btn" (click)="onPrint()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 9V2H18V9M6 18H18V22H6V18ZM6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Imprimer Ticket
          </button>
          <button class="action-btn invoice-btn" (click)="onPrintInvoice()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Facture A4
          </button>
          <button class="action-btn primary-btn" (click)="onNewSale()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Nouvelle Vente
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .success-screen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--color-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal);
      padding: var(--space-6);
    }

    .success-content {
      width: 100%;
      max-width: 400px;
      text-align: center;
      animation: fadeInUp 0.4s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .success-icon {
      width: 120px;
      height: 120px;
      background-color: var(--color-success-light);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-6);
      color: var(--color-success);
      animation: successPop 0.5s ease-out;
    }

    @keyframes successPop {
      0% {
        transform: scale(0);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }

    .success-title {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin: 0 0 var(--space-2) 0;
    }

    .success-subtitle {
      font-size: var(--font-size-body);
      color: var(--color-text-secondary);
      margin: 0 0 var(--space-6) 0;
    }

    .ticket-info {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-3) var(--space-6);
      background-color: var(--color-surface-container-low);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-6);
    }

    .ticket-label {
      font-size: var(--font-size-caption);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-1);
    }

    .ticket-number {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-bold);
      font-family: monospace;
      color: var(--color-text-primary);
    }

    .amount-display {
      padding: var(--space-6);
      background: linear-gradient(135deg, var(--color-success) 0%, #45a87a 100%);
      border-radius: var(--radius-xl);
      margin-bottom: var(--space-3);
    }

    .amount-label {
      display: block;
      font-size: var(--font-size-small);
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: var(--space-2);
    }

    .amount-value {
      font-size: var(--font-size-display);
      font-weight: var(--font-weight-bold);
      color: white;
      letter-spacing: var(--letter-spacing-tight);
    }

    .payment-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4);
      background-color: var(--color-surface-container-low);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-8);
    }

    .change-label {
      font-size: var(--font-size-small);
      color: var(--color-text-secondary);
    }

    .change-value {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-bold);
      color: var(--color-success);
    }

    .success-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      min-height: var(--touch-target-min);
      padding: var(--space-4);
      font-family: var(--font-family-base);
      font-size: var(--font-size-body);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .print-btn {
      background-color: var(--color-surface-container-low);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
    }

    .print-btn:hover {
      background-color: var(--color-surface);
      border-color: var(--color-primary);
    }

    .invoice-btn {
      background-color: var(--color-surface-container-low);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
    }

    .invoice-btn:hover {
      background-color: var(--color-surface);
      border-color: var(--color-primary);
    }

    .primary-btn {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
      color: var(--color-text-on-primary);
      border: none;
      box-shadow: 0 4px 12px rgba(47, 126, 218, 0.3);
    }

    .primary-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(47, 126, 218, 0.4);
    }

    .primary-btn:active {
      transform: scale(0.98);
    }
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
