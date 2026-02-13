import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutRequest } from '../../../../core/models/sale.model';
import { CartItem } from '../../../../core/services/cart.service';

@Component({
    selector: 'app-payment-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        
        <div class="modal-split-layout">
            <!-- LEFT COLUMN: Order Summary -->
            <div class="modal-sidebar">
                <div class="sidebar-header">
                    <span class="icon">🧾</span>
                    <span class="order-id">COMMANDE #{{ orderId }}</span>
                </div>

                <div class="order-items-list">
                    <div class="order-item" *ngFor="let item of cartItems">
                        <span class="item-name">{{ item.productName }}</span>
                        <span class="item-price">{{ (item.price * item.quantity) | currency:'EUR' }}</span>
                    </div>
                    <!-- Tax Row (if needed separately) -->
                    <div class="order-item text-secondary margin-top-sm">
                        <span>Taxe (20%)</span>
                        <span>{{ tax | currency:'EUR' }}</span>
                    </div>
                </div>

                <div class="order-total-section">
                    <span class="label">Total à payer</span>
                    <span class="amount">{{ total | currency:'EUR' }}</span>
                </div>
                
                <div class="sidebar-actions">
                     <button class="btn-text">⑂ Partager le paiement</button>
                     <button class="btn-text">🏷️ Ajouter une remise</button>
                </div>
            </div>

            <!-- RIGHT COLUMN: Payment Methods -->
            <div class="modal-main">
                <div class="main-header">
                    <div class="header-text">
                        <h2>Sélectionner le mode de paiement</h2>
                        <p class="subtitle">Choisissez comment le client souhaite payer.</p>
                    </div>
                    <button class="close-btn" (click)="close()">×</button>
                </div>

                <div class="payment-grid">
                    <div 
                        class="payment-card" 
                        [class.active]="selectedMethod === 'CARD'"
                        (click)="selectMethod('CARD')"
                    >
                        <div class="card-icon blue-bg">
                            <!-- Credit Card SVG -->
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M1 10H23" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <span class="method-name">Carte Bancaire</span>
                        <span class="method-desc">Visa, MC, Amex</span>
                        <span class="badge-default" *ngIf="selectedMethod === 'CARD'">DÉFAUT</span>
                    </div>

                    <div 
                        class="payment-card" 
                        [class.active]="selectedMethod === 'CASH'"
                        (click)="selectMethod('CASH')"
                    >
                         <div class="card-icon gray-bg">
                            <!-- Cash SVG -->
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 1V23" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3688 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <span class="method-name">Espèces</span>
                        <span class="method-desc">Montant exact ou rendu</span>
                    </div>

                    <div 
                        class="payment-card" 
                        [class.active]="selectedMethod === 'MOBILE'"
                        (click)="selectMethod('MOBILE')"
                    >
                         <div class="card-icon gray-bg">
                            <!-- Mobile SVG -->
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12H12.01" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M7 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21Z" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <span class="method-name">Mobile Money</span>
                        <span class="method-desc">Orange, MTN, Wave</span>
                    </div>
                     <div class="payment-card disabled">
                         <div class="card-icon gray-bg">
                            <!-- Gift SVG -->
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 12V22H4V12" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M22 7H2V12H22V7Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 22V7" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <span class="method-name text-muted">Carte Cadeau</span>
                        <span class="method-desc text-muted">Bientôt disponible</span>
                    </div>
                </div>

                <div class="modal-footer layout-row">
                    <button class="btn-text-danger" (click)="close()">✖ Annuler</button>
                    <div class="footer-right">
                        <button class="btn btn-secondary" (click)="close()">Mettre en attente</button>
                        <button class="btn btn-primary-dark" (click)="confirm()">Confirmer le Paiement</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(31, 41, 55, 0.7); /* Darker overlay */
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background-color: white;
      border-radius: var(--radius-lg);
      width: 900px;
      max-width: 95%;
      height: 600px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      animation: zoomIn 0.2s ease-out;
    }

    @keyframes zoomIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    .modal-split-layout {
        display: flex;
        height: 100%;
    }

    /* SIDEBAR (LEFT) */
    .modal-sidebar {
        width: 35%;
        background-color: #F8FAFC; /* Very light gray/blue */
        padding: 32px;
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--color-border);
    }
    
    .sidebar-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 32px;
        color: var(--color-text-secondary);
        font-weight: 600;
        font-size: 12px;
        letter-spacing: 1px;
    }
    
    .order-items-list {
        flex: 1;
        overflow-y: auto;
    }

    .order-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 14px;
        color: var(--color-text-primary);
    }
    
    .text-secondary {
        color: var(--color-text-secondary);
    }
    
    .margin-top-sm {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px dashed var(--color-border);
    }

    .order-total-section {
        margin-top: auto;
        padding-top: 32px;
    }
    
    .label {
        display: block;
        font-size: 14px;
        color: var(--color-text-secondary);
        margin-bottom: 4px;
    }
    
    .amount {
        font-size: 42px;
        font-weight: 800;
        color: #2563EB; /* Bright Blue */
        letter-spacing: -1px;
    }

    .sidebar-actions {
        display: flex;
        gap: 16px;
        margin-top: 24px;
    }
    
    .btn-text {
        background: none;
        border: none;
        color: #2563EB;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        padding: 0;
    }

    /* MAIN CONTENT (RIGHT) */
    .modal-main {
        width: 65%;
        padding: 32px 48px;
        display: flex;
        flex-direction: column;
    }

    .main-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 40px;
    }
    
    .header-text h2 {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 4px 0;
    }
    
    .subtitle {
        color: var(--color-text-secondary);
        font-size: 14px;
        margin: 0;
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: 4px;
        line-height: 1;
    }
    
    .payment-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-bottom: auto;
    }
    
    .payment-card {
        border: 2px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 24px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        position: relative;
    }
    
    .payment-card:hover {
        border-color: #BFDBFE;
    }
    
    .payment-card.active {
        border-color: #2563EB;
        background-color: #EFF6FF; /* Very light blue */
    }
    
    .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
    }
    
    .blue-bg { background-color: #DBEAFE; }
    .gray-bg { background-color: #F3F4F6; }
    
    .method-name {
        font-weight: 700;
        font-size: 16px;
        color: #111827;
        margin-bottom: 4px;
    }
    
    .method-desc {
        font-size: 12px;
        color: var(--color-text-secondary);
    }
    
    .badge-default {
        position: absolute;
        top: 12px;
        right: 12px;
        background-color: #2563EB;
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
    }
    
    .disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .text-muted {
        color: #9CA3AF;
    }

    .modal-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 32px;
        border-top: 1px solid var(--color-border);
    }
    
    .btn-text-danger {
        background: none;
        border: none;
        color: #EF4444;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .footer-right {
        display: flex;
        gap: 12px;
    }
    
    .btn-secondary {
        background: #F3F4F6;
        color: #374151;
        border: none;
        padding: 10px 20px;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
    }
    
    .btn-primary-dark {
        background: #111827; /* Near black */
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .btn-primary-dark:hover {
        background: black;
    }
    
  `]
})
export class PaymentModalComponent {
    @Input() isOpen = false;
    @Input() total = 0;
    @Input() subtotal = 0;
    @Input() tax = 0;
    @Input() cartItems: CartItem[] = [];
    @Input() orderId = Math.floor(Math.random() * 10000); // Random Order ID for display

    @Output() closeEvent = new EventEmitter<void>();
    @Output() checkoutEvent = new EventEmitter<string>();

    selectedMethod = 'CARD';

    selectMethod(method: string) {
        this.selectedMethod = method;
    }

    close() {
        this.closeEvent.emit();
    }

    confirm() {
        this.checkoutEvent.emit(this.selectedMethod);
    }
}
