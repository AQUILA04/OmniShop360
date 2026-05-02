import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../../core/services/cart.service';

interface PaymentLine {
  method: string;
  amount: number;
  reference?: string;
  phoneNumber?: string;
  checkNumber?: string;
  ownerName?: string;
  customerNumber?: string;
}

@Component({
    selector: 'app-payment-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="payment-modal" *ngIf="isOpen">
      <div class="payment-modal-content">
        <!-- Header -->
        <div class="payment-header">
          <h2 class="payment-title">Multi-paiement</h2>
          <button class="close-btn" (click)="close()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="flex-row" style="display: flex;">

          <div class="left-panel" style="flex: 1; border-right: 1px solid #eee; padding-right: 16px;">
            <!-- Amount Display -->
            <div class="amount-display">
              <span class="amount-label">Reste à payer</span>
              <span class="amount-value">{{ remainingAmount | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>

            <!-- Numpad & Method -->
            <div class="method-selector">
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

            <div class="numpad-section" *ngIf="selectedMethod">
              <div class="numpad-display">
                <span class="currency">€</span>
                <input type="text" [(ngModel)]="enteredAmount" class="numpad-input" readonly>
              </div>

              <!-- Metadata fields -->
              <div class="payment-metadata" *ngIf="selectedMethod === 'MOBILE'">
                <input type="text" [(ngModel)]="phoneNumber" placeholder="Numéro de téléphone" class="metadata-input">
                <input type="text" [(ngModel)]="operationRef" placeholder="Référence de l'opération" class="metadata-input">
              </div>
              <div class="payment-metadata" *ngIf="selectedMethod === 'CARD'">
                <input type="text" [(ngModel)]="operationRef" placeholder="Référence de la transaction" class="metadata-input">
              </div>
              <div class="payment-metadata" *ngIf="selectedMethod === 'CHECK'">
                <input type="text" [(ngModel)]="checkNumber" placeholder="Numéro du chèque" class="metadata-input">
                <input type="text" [(ngModel)]="ownerName" placeholder="Propriétaire du chèque" class="metadata-input">
                <input type="text" [(ngModel)]="customerNumber" placeholder="Numéro de client" class="metadata-input">
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
              <button class="btn-add-payment" (click)="addPayment()" [disabled]="parseFloat(enteredAmount) <= 0 || !isMetadataValid()">Ajouter ce paiement</button>
            </div>
            
          </div>

          <div class="right-panel" style="flex: 1; padding-left: 16px; display: flex; flex-direction: column;">
            <h3 style="font-size: 14px; margin-top: 10px;">Paiements saisis</h3>
            <div class="payments-list" style="flex: 1; overflow-y: auto;">
              <div class="empty-list" *ngIf="payments.length === 0" style="color: #999; font-size: 13px; text-align: center; margin-top: 20px;">
                Aucun paiement n'a encore été saisi.
              </div>
              <div class="payment-line" *ngFor="let p of payments; let i = index" style="display: flex; justify-content: space-between; background: #f9f9f9; padding: 10px; border-radius: 8px; margin-bottom: 8px;">
                <span>{{ getMethodName(p.method) }}</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <strong>{{ p.amount | currency:'EUR':'symbol':'1.2-2' }}</strong>
                  <button (click)="removePayment(i)" style="border: none; background: transparent; color: #D93E3E; cursor: pointer;">✕</button>
                </div>
              </div>
            </div>

            <!-- Cash Display (when change is positive) -->
            <div class="cash-display" *ngIf="remainingAmount < 0" style="margin-top: auto;">
              <span class="cash-label">Monnaie à rendre</span>
              <span class="cash-value">{{ -remainingAmount | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>

            <!-- Actions -->
            <div class="payment-actions" style="margin-top: 16px;">
              <button class="btn-cancel" (click)="close()">Annuler</button>
              <button 
                class="btn-confirm" 
                (click)="confirm()"
                [disabled]="remainingAmount > 0"
              >
                Valider
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
    styles: [`
    .payment-modal {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(25, 27, 38, 0.4); display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 20px;
    }
    .payment-modal-content {
      background-color: #fff; border-radius: 16px; width: 100%; max-width: 650px;
      padding: 16px; animation: modalSlideUp 0.3s ease-out;
    }
    @keyframes modalSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    
    .payment-header { display: flex; align-items: justify; justify-content: space-between; margin-bottom: 16px; }
    .payment-title { font-size: 18px; font-weight: 600; margin: 0; }
    .close-btn { background: none; border: none; cursor: pointer; color: #888; }
    
    .amount-display { text-align: center; padding: 16px; background: linear-gradient(135deg, #005cad 0%, #2075d0 100%); color: #fff; border-radius: 12px; margin-bottom: 16px; }
    .amount-label { display: block; font-size: 12px; opacity: 0.9; margin-bottom: 4px; }
    .amount-value { font-size: 24px; font-weight: 700; }
    
    .payment-methods-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px; }
    .payment-method-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; border: 2px solid transparent; border-radius: 12px; background: #f4f5f7; cursor: pointer; transition: all 0.2s; }
    .payment-method-btn.payment-method-selected { border-color: #005cad; background: #d5e3ff; }
    .payment-method-icon { font-size: 20px; margin-bottom: 4px; }
    .payment-method-name { font-size: 12px; font-weight: 500; }
    
    .numpad-display { display: flex; align-items: center; justify-content: flex-end; padding: 10px; background: #f4f5f7; border-radius: 8px; margin-bottom: 12px; }
    .numpad-input { font-size: 24px; font-weight: 700; border: none; background: transparent; text-align: right; width: 100%; outline: none; color: #333; }
    .numpad-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
    .numpad-btn { height: 44px; font-size: 18px; font-weight: 600; background: #f4f5f7; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .numpad-btn:hover { background: #e0e0e0; }
    .numpad-btn-clear { background: #feebeb; color: #d93e3e; }
    
    .btn-add-payment { width: 100%; padding: 12px; background: #005cad; color: #fff; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: opacity 0.2s; }
    .btn-add-payment:disabled { opacity: 0.5; cursor: not-allowed; }

    .payment-metadata { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
    .metadata-input { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
    .metadata-input:focus { border-color: #005cad; }
    
    .cash-display { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #e6f4ea; border-radius: 8px; }
    .cash-label { font-size: 12px; color: #1a7a4a; }
    .cash-value { font-size: 20px; font-weight: 700; color: #1a7a4a; }
    
    .payment-actions { display: flex; gap: 8px; }
    .btn-cancel { flex: 1; padding: 12px; border: none; background: #f4f5f7; border-radius: 8px; cursor: pointer; font-weight: 600; color: #666; }
    .btn-confirm { flex: 2; padding: 12px; border: none; background: #1a7a4a; border-radius: 8px; cursor: pointer; font-weight: 600; color: #fff; }
    .btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
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

    selectedMethod: string | null = null;
    enteredAmount = '0';
    payments: PaymentLine[] = [];

    numpadNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    paymentMethods = [
      { id: 'CASH', name: 'Espèces', icon: '💶' },
      { id: 'CARD', name: 'Carte', icon: '💳' },
      { id: 'MOBILE', name: 'Mobile', icon: '📱' },
      { id: 'CHECK', name: 'Chèque', icon: '🖋️' }
    ];

    // Metadata fields
    operationRef = '';
    phoneNumber = '';
    checkNumber = '';
    ownerName = '';
    customerNumber = '';

    get remainingAmount(): number {
      const paid = this.payments.reduce((sum, p) => sum + p.amount, 0);
      return this.total - paid;
    }

    getMethodName(id: string) {
      return this.paymentMethods.find(m => m.id === id)?.name || id;
    }

    ngOnChanges() {
        if (this.isOpen) {
            this.payments = [];
            this.selectedMethod = null;
            this.enteredAmount = '0';
        }
    }

    selectMethod(method: string) {
        this.selectedMethod = method;
        const remainder = this.remainingAmount > 0 ? this.remainingAmount : 0;
        this.enteredAmount = remainder.toFixed(2);
    }

    appendDigit(digit: string) {
        if (this.enteredAmount === '0' || this.enteredAmount === '0.00') {
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

    isMetadataValid(): boolean {
        if (this.selectedMethod === 'MOBILE') {
            return this.phoneNumber.trim().length > 0 && this.operationRef.trim().length > 0;
        }
        if (this.selectedMethod === 'CARD') {
            return this.operationRef.trim().length > 0;
        }
        if (this.selectedMethod === 'CHECK') {
            return this.checkNumber.trim().length > 0 && this.ownerName.trim().length > 0 && this.customerNumber.trim().length > 0;
        }
        return true;
    }

    addPayment() {
      if (!this.selectedMethod) return;
      const amount = this.parseFloat(this.enteredAmount);
      if (amount <= 0 || !this.isMetadataValid()) return;

      const paymentLine: PaymentLine = { method: this.selectedMethod, amount };
      
      if (this.selectedMethod === 'MOBILE') {
          paymentLine.phoneNumber = this.phoneNumber;
          paymentLine.reference = this.operationRef;
      } else if (this.selectedMethod === 'CARD') {
          paymentLine.reference = this.operationRef;
      } else if (this.selectedMethod === 'CHECK') {
          paymentLine.checkNumber = this.checkNumber;
          paymentLine.ownerName = this.ownerName;
          paymentLine.customerNumber = this.customerNumber;
      }

      this.payments.push(paymentLine);
      this.selectedMethod = null;
      this.enteredAmount = '0';
      this.operationRef = '';
      this.phoneNumber = '';
      this.checkNumber = '';
      this.ownerName = '';
      this.customerNumber = '';
    }

    removePayment(index: number) {
      this.payments.splice(index, 1);
    }

    close() {
        this.closeEvent.emit();
    }

    confirm() {
        if (this.remainingAmount > 0) return;
        
        // Return full payments array in checkout event
        this.checkoutEvent.emit({
            payments: this.payments,
            total: this.total,
            method: 'MIXED' // Legacy parameter fallback
        });
    }
}
