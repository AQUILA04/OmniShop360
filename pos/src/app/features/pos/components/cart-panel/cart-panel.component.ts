import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cart-panel">

      <!-- ① Header -->
      <div class="panel-header">
        <h2 class="panel-title">PANIER ACTUEL</h2>
        <button class="icon-btn" title="Nouveau client">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            <line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="22" y1="11" x2="16" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- ② Customer card -->
      <div class="customer-card">
        <div class="customer-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 21V19a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="customer-info">
          <span class="customer-name">{{ customerName }}</span>
          <span class="customer-badge">Client Divers</span>
        </div>
        <button class="edit-btn" title="Modifier client">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- ③ Items scroll area -->
      <div class="cart-items">
        <!-- Empty state -->
        <div *ngIf="cartItems.length === 0" class="empty-cart">
          <div class="empty-icon-wrap">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293A1 1 0 0 0 5.414 17H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <p class="empty-title">Panier vide</p>
          <span class="empty-hint">Ajoutez des produits depuis la grille</span>
        </div>

        <!-- Cart item -->
        <div *ngFor="let item of cartItems" class="cart-item">
          <!-- Thumbnail -->
          <div class="item-thumb" [style.background]="getItemGradient(item.productName)">
            <span class="item-initial">{{ item.productName.charAt(0) }}</span>
          </div>

          <!-- Details -->
          <div class="item-details">
            <div class="item-name">{{ item.productName }}</div>
            <div class="item-unit">{{ item.price | currency:'EUR':'symbol':'1.2-2' }} / unité</div>
          </div>

          <!-- Qty + total -->
          <div class="item-controls">
            <div class="qty-controls">
              <button class="qty-btn" (click)="updateQuantity.emit({id: item.productId, qty: item.quantity - 1})">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </button>
              <span class="qty-val">{{ item.quantity }}</span>
              <button class="qty-btn" (click)="updateQuantity.emit({id: item.productId, qty: item.quantity + 1})">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="item-total">{{ (item.price * item.quantity) | currency:'EUR':'symbol':'1.2-2' }}</div>
          </div>
        </div>
      </div>

      <!-- ④ Promo section -->
      <div class="promo-area">
        <div *ngIf="!promoOpen" class="promo-trigger" (click)="promoOpen = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M1 10H23" stroke="currentColor" stroke-width="2"/>
          </svg>
          Ajouter Promo
        </div>
        <div *ngIf="promoOpen" class="promo-input-row">
          <input
            type="text"
            placeholder="Code promo"
            class="promo-field"
            [(ngModel)]="promoCode"
            (keyup.enter)="applyPromo()"
          >
          <button class="promo-apply-btn" (click)="applyPromo()">Appliquer</button>
        </div>
      </div>

      <!-- ⑤ Footer summary card -->
      <div class="cart-footer">
        <!-- Summary rows -->
        <div class="summary-block">
          <div class="summary-line">
            <span class="s-label">Sous-total</span>
            <span class="s-value">{{ subtotal | currency:'EUR':'symbol':'1.2-2' }}</span>
          </div>
          <div class="summary-line">
            <span class="s-label">Taxe (10%)</span>
            <span class="s-value">{{ tax | currency:'EUR':'symbol':'1.2-2' }}</span>
          </div>
          <div class="summary-line discount-line" *ngIf="discount > 0">
            <span class="s-label success-text">Remise appliquée</span>
            <span class="s-value success-text">-{{ discount | currency:'EUR':'symbol':'1.2-2' }}</span>
          </div>
        </div>

        <!-- Total row -->
        <div class="total-block">
          <span class="total-label">TOTAL À PAYER</span>
          <span class="total-amount">{{ total | currency:'EUR':'symbol':'1.2-2' }}</span>
        </div>

        <!-- Actions -->
        <div class="actions-row">
          <button
            class="trash-btn"
            (click)="clearCart.emit()"
            [disabled]="cartItems.length === 0"
            title="Vider le panier"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <button
            class="pay-btn"
            (click)="checkout.emit()"
            [disabled]="cartItems.length === 0"
          >
            PAYER {{ total | currency:'EUR':'symbol':'1.2-2' }}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .cart-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #FFFFFF;
      overflow: hidden;
      height: 100%;
    }

    /* ① Header */
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 14px;
      flex-shrink: 0;
    }

    .panel-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.13em;
      color: #1a2035;
      margin: 0;
      text-transform: uppercase;
    }

    .icon-btn {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: none;
      border: none;
      cursor: pointer;
      color: #005cad;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 150ms;
    }

    .icon-btn:hover {
      background: #d5e3ff;
    }

    /* ② Customer card */
    .customer-card {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 16px 14px;
      padding: 11px 14px;
      background: #F4F2FF;
      border-radius: 14px;
      flex-shrink: 0;
    }

    .customer-avatar {
      width: 36px;
      height: 36px;
      background: #d5e3ff;
      color: #005cad;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .customer-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .customer-name {
      font-size: 13px;
      font-weight: 600;
      color: #1a2035;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .customer-badge {
      font-size: 11px;
      color: #676C73;
    }

    .edit-btn {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      background: none;
      border: none;
      cursor: pointer;
      color: #676C73;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 150ms;
      flex-shrink: 0;
    }

    .edit-btn:hover {
      color: #005cad;
      background: rgba(0, 92, 173, 0.08);
    }

    /* ③ Items */
    .cart-items {
      flex: 1;
      overflow-y: auto;
      padding: 0 16px 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scrollbar-width: thin;
      scrollbar-color: #E8EDF5 transparent;
    }

    /* Empty */
    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 0;
      gap: 10px;
      text-align: center;
    }

    .empty-icon-wrap {
      color: #C6D1D7;
    }

    .empty-title {
      font-size: 14px;
      font-weight: 600;
      color: #555663;
      margin: 0;
    }

    .empty-hint {
      font-size: 12px;
      color: #9BA3AF;
    }

    /* Cart item card */
    .cart-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: #F4F2FF;
      border-radius: 14px;
      transition: box-shadow 150ms;
    }

    .cart-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    }

    /* Thumbnail */
    .item-thumb {
      width: 46px;
      height: 46px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .item-initial {
      font-size: 18px;
      font-weight: 800;
      color: rgba(255,255,255,0.92);
      text-shadow: 0 1px 3px rgba(0,0,0,0.15);
      text-transform: uppercase;
    }

    .item-details {
      flex: 1;
      min-width: 0;
    }

    .item-name {
      font-size: 13px;
      font-weight: 600;
      color: #1a2035;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 2px;
    }

    .item-unit {
      font-size: 11px;
      color: #9BA3AF;
    }

    /* Controls column */
    .item-controls {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      flex-shrink: 0;
    }

    .qty-controls {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #FFFFFF;
      border-radius: 999px;
      padding: 3px 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .qty-btn {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #555663;
      transition: all 150ms;
    }

    .qty-btn:hover {
      background: #d5e3ff;
      color: #005cad;
    }

    .qty-val {
      font-size: 13px;
      font-weight: 600;
      color: #1a2035;
      min-width: 16px;
      text-align: center;
    }

    .item-total {
      font-size: 13px;
      font-weight: 700;
      color: #1a2035;
    }

    /* ④ Promo */
    .promo-area {
      padding: 6px 16px 8px;
      flex-shrink: 0;
    }

    .promo-trigger {
      width: 100%;
      padding: 13px;
      border: 1.5px dashed rgba(0, 92, 173, 0.3);
      border-radius: 14px;
      background: none;
      color: #005cad;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 200ms;
      font-family: inherit;
    }

    .promo-trigger:hover {
      background: #d5e3ff;
      border-style: solid;
    }

    .promo-input-row {
      display: flex;
      gap: 8px;
    }

    .promo-field {
      flex: 1;
      padding: 10px 14px;
      border: none;
      border-radius: 10px;
      background: #F4F2FF;
      font-size: 13px;
      color: #1a2035;
      outline: none;
      font-family: inherit;
    }

    .promo-field:focus {
      box-shadow: 0 0 0 2px rgba(0, 92, 173, 0.2);
    }

    .promo-apply-btn {
      padding: 10px 16px;
      border: none;
      border-radius: 10px;
      background: #d5e3ff;
      color: #005cad;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 150ms;
      white-space: nowrap;
      font-family: inherit;
    }

    .promo-apply-btn:hover {
      background: #005cad;
      color: #fff;
    }

    /* ⑤ Footer */
    .cart-footer {
      background: #F4F2FF;
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -6px 24px rgba(25, 27, 38, 0.06);
      padding: 20px 20px 18px;
      flex-shrink: 0;
    }

    .summary-block {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-bottom: 16px;
    }

    .summary-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .s-label {
      font-size: 13px;
      color: #676C73;
    }

    .s-value {
      font-size: 13px;
      font-weight: 500;
      color: #1a2035;
    }

    .success-text {
      color: #1a7a4a !important;
    }

    .total-block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      margin-bottom: 16px;
      border-top: 1px solid rgba(0,0,0,0.06);
    }

    .total-label {
      font-size: 12px;
      font-weight: 700;
      color: #1a2035;
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }

    .total-amount {
      font-size: 30px;
      font-weight: 800;
      color: #005cad;
      letter-spacing: -0.02em;
      line-height: 1;
    }

    /* Actions */
    .actions-row {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .trash-btn {
      width: 54px;
      height: 56px;
      border-radius: 14px;
      background: #FDECEC;
      color: #D93E3E;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 200ms;
    }

    .trash-btn:hover:not(:disabled) {
      background: #D93E3E;
      color: #fff;
      transform: scale(1.05);
    }

    .trash-btn:disabled {
      opacity: 0.38;
      cursor: not-allowed;
    }

    .pay-btn {
      flex: 1;
      height: 56px;
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, #005cad 0%, #2075d0 100%);
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 200ms;
      box-shadow: 0 4px 16px rgba(0, 92, 173, 0.35);
      font-family: inherit;
    }

    .pay-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(0, 92, 173, 0.45);
    }

    .pay-btn:active:not(:disabled) {
      transform: scale(0.98);
    }

    .pay-btn:disabled {
      opacity: 0.42;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  `]
})
export class CartPanelComponent {
  @Input() cartItems: CartItem[] = [];
  @Input() total: number = 0;
  @Input() customerName: string = 'Client Divers';

  promoCode = '';
  promoOpen = false;
  discount = 0;

  get subtotal(): number {
    return this.total / 1.1;
  }

  get tax(): number {
    return this.total - this.subtotal;
  }

  @Output() updateQuantity = new EventEmitter<{ id: string, qty: number }>();
  @Output() removeItem = new EventEmitter<string>();
  @Output() clearCart = new EventEmitter<void>();
  @Output() checkout = new EventEmitter<void>();

  applyPromo() {
    console.log('Applying promo:', this.promoCode);
    this.promoOpen = false;
  }

  getItemGradient(name: string): string {
    const gradients = [
      'linear-gradient(145deg, #4A2B1A 0%, #7A4A30 100%)',
      'linear-gradient(145deg, #1A3B5C 0%, #2E6094 100%)',
      'linear-gradient(145deg, #1A4A2B 0%, #2E7A4A 100%)',
      'linear-gradient(145deg, #4A1A3B 0%, #7A2E60 100%)',
      'linear-gradient(145deg, #4A3B1A 0%, #7A6030 100%)',
      'linear-gradient(145deg, #1A4A4A 0%, #2E7A7A 100%)',
    ];
    return gradients[name.length % gradients.length];
  }
}
