import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-panel-container">
      <!-- Header -->
      <div class="cart-header">
        <div class="customer-section">
            <div class="customer-avatar">
                <!-- User SVG -->
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="customer-details">
                <span class="customer-name">Client de passage</span>
                <span class="customer-action">Modifier</span>
            </div>
        </div>
        <button class="icon-btn-ghost" (click)="clearCart.emit()" title="Vider le panier">
            <!-- Trash SVG -->
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
      </div>

      <!-- Items List -->
      <div class="cart-items">
        <div *ngIf="cartItems.length === 0" class="empty-state">
          <div class="empty-icon">
            <!-- Shopping Cart SVG -->
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.31658 15.6834 4.59345 16.3536 5.14645 16.3536H19M17 13L16.2929 13.7071C15.9024 14.0976 16.1792 14.7678 16.7322 14.7678H19M9 21H9.01M15 21H15.01M9.01 21C9.01 21.5523 8.56228 22 8.01 22C7.45772 22 7.01 21.5523 7.01 21C7.01 20.4477 7.45772 20 8.01 20C8.56228 20 9.01 20.4477 9.01 21ZM15.01 21C15.01 21.5523 14.5623 22 14.01 22C13.4577 22 13.01 21.5523 13.01 21C13.01 20.4477 13.4577 20 14.01 20C14.5623 20 15.01 20.4477 15.01 21Z" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p>Le panier est vide</p>
          <span class="hint">Scannez un produit ou sélectionnez-le dans la grille</span>
        </div>

        <div *ngFor="let item of cartItems" class="cart-item">
          <div class="item-info">
            <div class="item-name">{{ item.productName }}</div>
            <div class="item-meta">{{ item.price | currency:'EUR' }}</div>
          </div>
          
          <div class="item-controls">
            <button class="qty-btn" (click)="updateQuantity.emit({id: item.productId, qty: item.quantity - 1})">−</button>
            <span class="qty-value">{{ item.quantity }}</span>
            <button class="qty-btn" (click)="updateQuantity.emit({id: item.productId, qty: item.quantity + 1})">+</button>
          </div>
          
          <div class="item-total">
            {{ (item.price * item.quantity) | currency:'EUR' }}
          </div>
          
          <button class="remove-btn" (click)="removeItem.emit(item.productId)" title="Retirer">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Footer / Summary -->
      <div class="cart-footer">
        
        <!-- Discount Section -->
        <div class="discount-section">
            <input type="text" placeholder="Code Promo" class="discount-input">
            <button class="btn-apply">Appliquer</button>
        </div>

        <div class="summary-details">
            <div class="summary-row">
              <span>Sous-total</span>
              <span>{{ subtotal | currency:'EUR' }}</span>
            </div>
            <div class="summary-row text-secondary">
              <span>TVA (20%)</span>
              <span>{{ tax | currency:'EUR' }}</span>
            </div>
            <div class="summary-row text-success" *ngIf="false"> <!-- Placeholder for discount -->
              <span>Remise</span>
              <span>-€0.00</span>
            </div>
        </div>

        <div class="total-section">
            <div class="total-label">Total</div>
            <div class="total-amount">{{ total | currency:'EUR' }}</div>
        </div>

        <div class="actions-grid">
          <button class="btn btn-outline-danger" [disabled]="cartItems.length === 0" (click)="clearCart.emit()">
            Annuler
          </button>
          <button class="btn btn-outline-secondary" [disabled]="cartItems.length === 0">
            Devis
          </button>
          <button 
            class="btn btn-primary-large" 
            [disabled]="cartItems.length === 0"
            (click)="checkout.emit()"
          >
            PAYER {{ total | currency:'EUR' }} ➔
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-panel-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: white;
      border-left: 1px solid var(--color-border);
      box-shadow: -4px 0 16px rgba(0,0,0,0.05);
    }

    /* Header */
    .cart-header {
      padding: 16px 24px;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FAFAFA;
    }

    .customer-section {
        display: flex;
        align-items: center;
        gap: 12px;
        background: white;
        padding: 8px 12px;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        cursor: pointer;
        transition: all 0.2s;
    }

    .customer-section:hover {
        border-color: var(--color-primary);
    }

    .customer-avatar {
        background: #E0F2FE;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-primary); /* For SVG stroke if using currentcolor */
    }

    .customer-details {
        display: flex;
        flex-direction: column;
    }

    .customer-name {
        font-weight: 600;
        font-size: 14px;
        color: var(--color-text-primary);
    }

    .customer-action {
        font-size: 11px;
        color: var(--color-primary);
        font-weight: 500;
    }

    .icon-btn-ghost {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-secondary);
        transition: all 0.2s;
    }
    
    .icon-btn-ghost:hover {
        background-color: #FEF2F2;
        color: var(--color-error);
    }
    
    .icon-btn-ghost svg path {
        transition: stroke 0.2s;
    }
    
    .icon-btn-ghost:hover svg path {
        stroke: var(--color-error);
    }

    /* Items */
    .cart-items {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .empty-state {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary);
      text-align: center;
      padding: 32px;
    }

    .empty-icon {
        margin-bottom: 16px;
        opacity: 0.5;
    }

    .cart-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid var(--color-border);
      transition: background 0.1s;
    }

    .cart-item:hover {
        background: #F9FAFB;
    }

    .item-info {
      flex: 2;
      display: flex;
      flex-direction: column;
    }

    .item-name {
      font-weight: 600;
      color: var(--color-text-primary);
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .item-meta {
        font-size: 12px;
        color: var(--color-text-secondary);
    }

    .item-total {
      flex: 1;
      text-align: right;
      font-weight: 700;
      color: var(--color-text-primary);
    }
    
    .remove-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        margin-left: 4px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-secondary); /* Default grey */
        opacity: 0.6;
        transition: all 0.2s;
    }

    .remove-btn:hover {
        background-color: #FEF2F2;
        color: var(--color-error); /* Red on hover */
        opacity: 1;
    }

    .item-controls {
      display: flex;
      align-items: center;
      background-color: #F3F4F6;
      border-radius: 8px; /* Pill shape */
      padding: 2px;
      margin: 0 16px;
    }

    .qty-btn {
      width: 24px;
      height: 24px;
      border: none;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      color: var(--color-text-primary);
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .qty-btn:active {
        background: #E5E7EB;
    }

    .qty-value {
      width: 28px;
      text-align: center;
      font-weight: 600;
      font-size: 13px;
    }

    /* Footer */
    .cart-footer {
      padding: 24px;
      background-color: #FAFAFA;
      border-top: 1px solid var(--color-border);
    }

    .discount-section {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
    }

    .discount-input {
        flex: 1;
        padding: 10px 12px;
        border: 1px dashed var(--color-border);
        border-radius: var(--radius-md);
        background: white;
        outline: none;
        font-size: 14px;
    }
    
    .btn-apply {
        padding: 0 16px;
        background: white;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-weight: 600;
        color: var(--color-text-secondary);
    }

    .summary-details {
        margin-bottom: 24px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--color-text-secondary);
    }
    
    .total-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-top: 16px;
        border-top: 1px dashed var(--color-border);
    }
    
    .total-label {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text-primary);
    }
    
    .total-amount {
        font-size: 32px;
        font-weight: 800;
        color: var(--color-text-primary);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .btn {
        padding: 12px;
        border-radius: var(--radius-md);
        border: none;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.2s;
    }

    .btn-outline-danger {
        background: white;
        border: 1px solid #FECACA;
        color: #DC2626;
    }
    
    .btn-outline-danger:hover {
        background: #FEF2F2;
    }

    .btn-outline-secondary {
        background: white;
        border: 1px solid var(--color-border);
        color: var(--color-text-secondary);
    }
    
    .btn-outline-secondary:hover {
        background: #F3F4F6;
    }

    .btn-primary-large {
        grid-column: span 2;
        background-color: var(--color-success); /* Green for Pay */
        color: white;
        padding: 16px;
        font-size: 18px;
        border-radius: var(--radius-lg);
        box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.4);
    }
    
    .btn-primary-large:hover {
        background-color: #059669;
        transform: translateY(-1px);
    }
    
    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
    }
  `]
})
export class CartPanelComponent {
  @Input() cartItems: CartItem[] = [];
  @Input() total: number = 0;

  get subtotal(): number {
    return this.total * 0.8333; // Approx removal of 20% VAT (1/1.2)
  }

  get tax(): number {
    return this.total - this.subtotal;
  }

  @Output() updateQuantity = new EventEmitter<{ id: string, qty: number }>();
  @Output() removeItem = new EventEmitter<string>();
  @Output() clearCart = new EventEmitter<void>();
  @Output() checkout = new EventEmitter<void>();
}
