import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../../core/services/cart.service';

@Component({
    selector: 'app-payment-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="payment-modal" *ngIf="isOpen">
      <div class="payment-modal-content">
        <!-- Header -->
        <div class="payment-header">
          <h2 class="payment-title">Mode de paiement</h2>
          <button class="close-btn" (click)="close()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Amount Display -->
        <div class="amount-display">
          <span class="amount-label">Montant à payer</span>
          <span class="amount-value">{{ total | currency:'EUR':'symbol':'1.2-2' }}</span>
        </div>

        <!-- Numpad -->
        <div class="numpad-section">
          <div class="numpad-display">
            <span class="currency">€</span>
            <input type="text" [(ngModel)]="enteredAmount" class="numpad-input" readonly>
          </div>
          <div class="numpad-grid">
            <button class="numpad-btn" *ngFor="let num of numpadNumbers" (click)="appendDigit(num)">{{ num }}</button>
            <button class="numpad-btn numpad-btn-clear" (click)="clearAmount()">C</button>
            <button class="numpad-btn" (click)="appendDigit('0')">0</button>
            <button class="numpad-btn numpad-btn-backspace" (click)="backspace()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 4H8L1 12L8 20H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 14L14 10M14 14L18 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="payment-methods-section">
          <span class="section-label">Méthode de paiement</span>
          <div class="payment-methods-grid">
            <button 
              *ngFor="let method of paymentMethods" 
              class="payment-method-btn"
              [class.payment-method-selected]="selectedMethod === method.id"
              (click)="selectMethod(method.id)"
            >
              <span class="payment-method-icon" [innerHTML]="method.icon"></span>
              <span class="payment-method-name">{{ method.name }}</span>
            </button>
          </div>
        </div>

        <!-- Cash Display (when cash selected) -->
        <div class="cash-display" *ngIf="selectedMethod === 'CASH' && parseFloat(enteredAmount) > total">
          <span class="cash-label">Monnaie à rendre</span>
          <span class="cash-value">{{ getChange() | currency:'EUR':'symbol':'1.2-2' }}</span>
        </div>

        <!-- Actions -->
        <div class="payment-actions">
          <button class="btn-cancel" (click)="close()">Annuler</button>
          <button 
            class="btn-confirm" 
            (click)="confirm()"
            [disabled]="!canConfirm()"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2"/>
              <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Valider {{ total | currency:'EUR':'symbol':'1.2-2' }}
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .payment-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(25, 27, 38, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal-backdrop);
      padding: var(--space-4);
    }

    .payment-modal-content {
      background-color: var(--color-surface);
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 420px;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalSlideUp 0.3s ease-out;
    }

    @keyframes modalSlideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .payment-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4);
      border-bottom: none;
    }

    .payment-title {
      font-size: var(--font-size-h2);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0;
    }

    .close-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .close-btn:hover {
      background-color: var(--color-surface-container-low);
      color: var(--color-text-primary);
    }

    .amount-display {
      text-align: center;
      padding: var(--space-6) var(--space-4);
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
      color: var(--color-text-on-primary);
    }

    .amount-label {
      display: block;
      font-size: var(--font-size-small);
      opacity: 0.9;
      margin-bottom: var(--space-1);
    }

    .amount-value {
      font-size: var(--font-size-display);
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-tight);
    }

    .numpad-section {
      padding: var(--space-4);
    }

    .numpad-display {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: var(--space-4);
      background-color: var(--color-surface-container-low);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-4);
    }

    .currency {
      font-size: var(--font-size-h2);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-secondary);
      margin-right: var(--space-2);
    }

    .numpad-input {
      font-size: var(--font-size-display);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      text-align: right;
      border: none;
      background: transparent;
      outline: none;
      width: 100%;
    }

    .numpad-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-3);
    }

    .numpad-btn {
      height: var(--touch-target-min);
      font-size: var(--font-size-h2);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      background-color: var(--color-surface-container-low);
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .numpad-btn:hover {
      background-color: var(--color-primary-light);
    }

    .numpad-btn:active {
      transform: scale(0.95);
    }

    .numpad-btn-clear {
      background-color: var(--color-error-light);
      color: var(--color-error);
    }

    .numpad-btn-backspace {
      background-color: var(--color-surface-container-low);
      color: var(--color-text-secondary);
    }

    .payment-methods-section {
      padding: var(--space-4);
      padding-top: 0;
    }

    .section-label {
      display: block;
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-3);
    }

    .payment-methods-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-3);
    }

    .payment-method-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      min-height: var(--touch-target-min);
      padding: var(--space-4);
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      background-color: var(--color-surface-container-low);
      border: 2px solid transparent;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .payment-method-btn:hover {
      border-color: var(--color-primary);
      background-color: var(--color-primary-light);
    }

    .payment-method-selected {
      border-color: var(--color-primary);
      background-color: var(--color-primary-light);
    }

    .payment-method-icon {
      font-size: 24px;
    }

    .payment-method-name {
      font-size: var(--font-size-caption);
    }

    .cash-display {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4);
      margin: 0 var(--space-4);
      background-color: var(--color-success-light);
      border-radius: var(--radius-lg);
    }

    .cash-label {
      font-size: var(--font-size-small);
      color: var(--color-success);
    }

    .cash-value {
      font-size: var(--font-size-h2);
      font-weight: var(--font-weight-bold);
      color: var(--color-success);
    }

    .payment-actions {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-4);
    }

    .btn-cancel {
      flex: 1;
      min-height: var(--touch-target-min);
      padding: var(--space-4);
      font-size: var(--font-size-body);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      background-color: var(--color-surface-container-low);
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-cancel:hover {
      background-color: var(--color-error-light);
      color: var(--color-error);
    }

    .btn-confirm {
      flex: 2;
      min-height: var(--touch-target-min);
      padding: var(--space-4);
      font-size: var(--font-size-body);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-on-primary);
      background: linear-gradient(135deg, var(--color-success) 0%, #45a87a 100%);
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }

    .btn-confirm:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(81, 188, 143, 0.4);
    }

    .btn-confirm:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 640px) {
      .payment-modal-content {
        max-height: 95vh;
        border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        max-width: 100%;
      }
    }
  `]
})
export class PaymentModalComponent {
    @Input() isOpen = false;
    @Input() total = 0;
    @Input() subtotal = 0;
    @Input() tax = 0;
    @Input() cartItems: CartItem[] = [];

    @Output() closeEvent = new EventEmitter<void>();
    @Output() checkoutEvent = new EventEmitter<any>();

    selectedMethod = 'CASH';
    enteredAmount = '0';

    numpadNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    paymentMethods = [
      { 
        id: 'CASH', 
        name: 'Espèces',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3688 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
      },
      { 
        id: 'CARD', 
        name: 'Carte',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M1 10H23" stroke="currentColor" stroke-width="2"/></svg>'
      },
      { 
        id: 'MOBILE', 
        name: 'Mobile',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="2"/><path d="M12 18H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
      },
      { 
        id: 'MULTI', 
        name: 'Multi-paiements',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      }
    ];

    selectMethod(method: string) {
        this.selectedMethod = method;
        if (method === 'CARD' || method === 'MOBILE') {
            this.enteredAmount = this.total.toFixed(2);
        }
    }

    appendDigit(digit: string) {
        if (this.enteredAmount === '0') {
            this.enteredAmount = digit;
        } else {
            this.enteredAmount += digit;
        }
    }

    clearAmount() {
        this.enteredAmount = '0';
    }

    backspace() {
        if (this.enteredAmount.length > 1) {
            this.enteredAmount = this.enteredAmount.slice(0, -1);
        } else {
            this.enteredAmount = '0';
        }
    }

    parseFloat(value: string): number {
        return parseFloat(value) || 0;
    }

    getChange(): number {
        return this.parseFloat(this.enteredAmount) - this.total;
    }

    canConfirm(): boolean {
        if (this.selectedMethod === 'CASH') {
            return this.parseFloat(this.enteredAmount) >= this.total;
        }
        return true;
    }

    close() {
        this.closeEvent.emit();
    }

    confirm() {
        const payment = {
            method: this.selectedMethod,
            amount: this.parseFloat(this.enteredAmount),
            total: this.total
        };
        this.checkoutEvent.emit(payment);
    }
}
