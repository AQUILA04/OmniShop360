import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cart-panel-container">

      <!-- ① PANIER ACTUEL header — like the mockup -->
      <div class="panel-title-bar">
        <h2 class="panel-title">PANIER ACTUEL</h2>
        <button class="icon-btn-sm" title="Nouveau client">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 21V19a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="customer-info">
          <span class="customer-name">{{ customerName }}</span>
          <span class="customer-loyalty">Client Divers</span>
        </div>
        <button class="edit-btn" title="Modifier client">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- ③ Items List -->
      <div class="cart-items">
        <!-- Empty state -->
        <div *ngIf="cartItems.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293A1 1 0 0 0 5.414 17H19M17 13L16.293 13.707A1 1 0 0 0 16.586 15H19M9 21H9.01M15 21H15.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="empty-title">Le panier est vide</p>
          <span class="empty-hint">Ajoutez des produits depuis la grille</span>
        </div>

        <!-- Cart items — match mockup layout exactly -->
        <div *ngFor="let item of cartItems" class="cart-item-card">
          <!-- Thumbnail -->
          <div class="item-thumb" [style.background]="getItemGradient(item.productName)">
            <span class="item-thumb-letter">{{ item.productName.charAt(0) }}</span>
          </div>

          <!-- Name + unit price -->
          <div class="item-details">
            <div class="item-name">{{ item.productName }}</div>
            <div class="item-unit-price">{{ item.price | currency:'EUR':'symbol':'1.2-2' }} / unité</div>
          </div>

          <!-- Qty controls + line total -->
          <div class="item-right">
            <div class="qty-pill">
              <button class="qty-btn-pill" (click)="updateQuantity.emit({id: item.productId, qty: item.quantity - 1})">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </button>
              <span class="qty-num">{{ item.quantity }}</span>
              <button class="qty-btn-pill" (click)="updateQuantity.emit({id: item.productId, qty: item.quantity + 1})">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="item-line-total">{{ (item.price * item.quantity) | currency:'EUR':'symbol':'1.2-2' }}</div>
          </div>
        </div>
      </div>

      <!-- ④ Promo — dashed border button like mockup -->
      <div class="promo-section" *ngIf="!promoOpen">
        <button class="promo-btn" (click)="promoOpen = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M1 10H23" stroke="currentColor" stroke-width="2"/>
          </svg>
          Ajouter Promo
        </button>
      </div>
      <div class="promo-input-section" *ngIf="promoOpen">
        <input type="text" placeholder="Code Promo" class="promo-input" [(ngModel)]="promoCode">
        <button class="btn-apply" (click)="applyPromo()">Appliquer</button>
      </div>

      <!-- ⑤ Summary + Actions footer -->
      <div class="cart-footer">
        <div class="summary-rows">
          <div class="summary-row">
            <span class="summary-label">Sous-total</span>
            <span class="summary-value">{{ subtotal | currency:'EUR':'symbol':'1.2-2' }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Taxe (10%)</span>
            <span class="summary-value">{{ tax | currency:'EUR':'symbol':'1.2-2' }}</span>
          </div>
          <div class="summary-row discount-row" *ngIf="discount > 0">
            <span class="summary-label text-success">Remise</span>
            <span class="summary-value text-success">-{{ discount | currency:'EUR':'symbol':'1.2-2' }}</span>
          </div>
        </div>

        <!-- TOTAL — big blue like mockup -->
        <div class="total-row">
          <span class="total-label">TOTAL À PAYER</span>
          <span class="total-amount">{{ total | currency:'EUR':'symbol':'1.2-2' }}</span>
        </div>

        <!-- Actions: 🗑 small red square + PAYER BLUE button -->
        <div class="action-row">
          <button class="btn-trash" (click)="clearCart.emit()" [disabled]="cartItems.length === 0" title="Vider le panier">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="btn-pay-primary" (click)="checkout.emit()" [disabled]="cartItems.length === 0">
            PAYER {{ total | currency:'EUR':'symbol':'1.2-2' }}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* ============================================
       Cart Panel — Pixel-matched to Mockup
       ============================================ */

    /* Host element MUST participate in the flex chain */
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .cart-panel-container {
      /* flex:1 fills the host, not height:100% which can overflow */
      flex: 1;
      display: flex;
      flex-direction: column;
      /* Cart body = WHITE — the gray footer card pops against this */
      background-color: var(--color-surface);
      overflow: hidden;
    }

    /* ① Title bar — white */
    .panel-title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-5) var(--space-5) var(--space-4);
      flex-shrink: 0;
      background-color: var(--color-surface);
    }

    .panel-title {
      font-size: 11px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      letter-spacing: 0.12em;
      margin: 0;
      text-transform: uppercase;
    }

    .icon-btn-sm {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color var(--transition-fast);
    }

    .icon-btn-sm:hover {
      background-color: var(--color-primary-light);
    }

    /* ② Customer card — subtle lavender card on white bg */
    .customer-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin: 0 var(--space-4) var(--space-3);
      padding: var(--space-3) var(--space-4);
      background-color: var(--color-surface-container-low);
      border-radius: var(--radius-xl);
      flex-shrink: 0;
    }

    .customer-avatar {
      width: 38px;
      height: 38px;
      background-color: var(--color-primary-light);
      color: var(--color-primary);
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
    }

    .customer-name {
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      line-height: 1.2;
    }

    .customer-loyalty {
      font-size: var(--font-size-caption);
      color: var(--color-text-secondary);
    }

    .edit-btn {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-sm);
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
    }

    .edit-btn:hover {
      color: var(--color-primary);
      background-color: rgba(0, 92, 173, 0.08);
    }

    /* ③ Cart items scroll area — white bg */
    .cart-items {
      flex: 1;
      overflow-y: auto;
      padding: 0 var(--space-4) var(--space-3);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      background-color: var(--color-surface);
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-10) 0;
      gap: var(--space-3);
    }

    .empty-icon {
      color: var(--color-text-secondary);
      opacity: 0.4;
    }

    .empty-title {
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0;
    }

    .empty-hint {
      font-size: var(--font-size-caption);
      color: var(--color-text-secondary);
      text-align: center;
    }

    /* Item card — on white bg, lavender card */
    .cart-item-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background-color: var(--color-surface-container-low);
      border-radius: var(--radius-lg);
    }

    /* Thumbnail */
    .item-thumb {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-thumb-letter {
      font-size: 20px;
      font-weight: 700;
      color: rgba(255,255,255,0.9);
      text-transform: uppercase;
    }

    /* Name + unit price */
    .item-details {
      flex: 1;
      min-width: 0;
    }

    /* Name — 14px semibold, near-black (not gray!) */
    .item-name {
      font-size: 14px;
      font-weight: var(--font-weight-semibold);
      color: #1a2035;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 2px;
    }

    /* "x,xx€ / unité" — 12px regular gray */
    .item-unit-price {
      font-size: 12px;
      font-weight: var(--font-weight-regular);
      color: var(--color-text-secondary);
    }

    /* Right side: qty pill + total */
    .item-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--space-2);
      flex-shrink: 0;
    }

    /* Qty pill matching mockup: (−) 2 (+) */
    .qty-pill {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background-color: var(--color-surface);
      border-radius: var(--radius-full);
      padding: 4px 8px;
      box-shadow: var(--shadow-card);
    }

    .qty-btn-pill {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-primary);
      transition: all var(--transition-fast);
    }

    .qty-btn-pill:hover {
      background-color: var(--color-primary-light);
      color: var(--color-primary);
    }

    .qty-num {
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      min-width: 16px;
      text-align: center;
    }

    /* Line total — 13px semibold, near-black */
    .item-line-total {
      font-size: 13px;
      font-weight: var(--font-weight-semibold);
      color: #1a2035;
    }

    /* ④ Promo — white bg */
    .promo-section {
      padding: var(--space-3) var(--space-4);
      flex-shrink: 0;
      background-color: var(--color-surface);
    }

    .promo-btn {
      width: 100%;
      padding: var(--space-4);
      border: 1.5px dashed rgba(0, 92, 173, 0.35);
      border-radius: var(--radius-xl);
      background: none;
      color: var(--color-primary);
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      transition: all var(--transition-base);
    }

    .promo-btn:hover {
      background-color: var(--color-primary-light);
    }

    .promo-input-section {
      display: flex;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      flex-shrink: 0;
      background-color: var(--color-surface);
    }

    .promo-input {
      flex: 1;
      padding: var(--space-3) var(--space-4);
      border: none;
      border-radius: var(--radius-md);
      background-color: var(--color-surface-container-low);
      font-size: var(--font-size-small);
      color: var(--color-text-primary);
      outline: none;
    }

    .promo-input:focus {
      box-shadow: 0 0 0 2px rgba(0, 92, 173, 0.2);
    }

    .btn-apply {
      padding: var(--space-3) var(--space-4);
      border: none;
      border-radius: var(--radius-md);
      background-color: var(--color-primary-light);
      color: var(--color-primary);
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
    }

    .btn-apply:hover {
      background-color: var(--color-primary);
      color: white;
    }


    /* === FOOTER CARD — THE PREMIUM DETAIL ===
       GRAY/LAVENDER card floating on WHITE body,
       rounded TOP corners only, soft upward shadow,
       padding-bottom: 0 = flush with panel edge */
    .cart-footer {
      background-color: var(--color-surface-container-low);
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -8px 32px rgba(25, 27, 38, 0.06);
      padding: var(--space-6) var(--space-5) var(--space-5);
      flex-shrink: 0;
    }

    /* Summary typography — exact mockup specs */
    .summary-rows {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      margin-bottom: var(--space-5);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* "Sous-total" / "Taxe" — 13px regular gray */
    .summary-label {
      font-size: 13px;
      font-weight: var(--font-weight-regular);
      color: var(--color-text-secondary);
    }

    /* Values "14,20€" — 13px medium, near-black */
    .summary-value {
      font-size: 13px;
      font-weight: var(--font-weight-medium);
      color: #1a2035;
    }

    .text-success {
      color: var(--color-success);
    }

    /* TOTAL row — exact mockup: bold label + huge blue amount */
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-5);
      padding-top: var(--space-4);
      border-top: none; /* No-line rule */
    }

    /* "TOTAL À PAYER" — 13px bold uppercase, near-black */
    .total-label {
      font-size: 13px;
      font-weight: var(--font-weight-bold);
      color: #1a2035;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    /* "15,62€" — 30px bold, primary blue, tight letter-spacing */
    .total-amount {
      font-size: 30px;
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
      letter-spacing: -0.02em;
      line-height: 1;
    }

    /* Action row: small trash + big PAYER */
    .action-row {
      display: flex;
      gap: var(--space-3);
      align-items: center;
    }

    /* Small red trash square button — matches mockup */
    .btn-trash {
      width: 56px;
      height: var(--touch-target-min);
      border-radius: var(--radius-xl);
      background-color: var(--color-error-light);
      color: var(--color-error);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all var(--transition-base);
    }

    .btn-trash:hover:not(:disabled) {
      background-color: var(--color-error);
      color: white;
    }

    .btn-trash:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* PAYER button — PRIMARY BLUE (not green!) matching mockup */
    .btn-pay-primary {
      flex: 1;
      min-height: var(--touch-target-min);
      padding: var(--space-4);
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-bold);
      color: white;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
      border: none;
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      box-shadow: 0 4px 16px rgba(0, 92, 173, 0.35);
    }

    .btn-pay-primary:hover:not(:disabled) {
      transform: scale(1.02);
      box-shadow: 0 8px 24px rgba(0, 92, 173, 0.45);
    }

    .btn-pay-primary:active:not(:disabled) {
      transform: scale(0.98);
    }

    .btn-pay-primary:disabled {
      opacity: 0.45;
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
    return this.total / 1.1; // 10% tax
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
      'linear-gradient(135deg, #6B4C3B 0%, #8B6355 100%)',
      'linear-gradient(135deg, #3B5B8C 0%, #4A7AB5 100%)',
      'linear-gradient(135deg, #4A7C59 0%, #5E9970 100%)',
      'linear-gradient(135deg, #7C4A6B 0%, #9E6089 100%)',
      'linear-gradient(135deg, #8C6B3B 0%, #B5894A 100%)',
      'linear-gradient(135deg, #3B7C7C 0%, #4A9E9E 100%)',
    ];
    return gradients[name.length % gradients.length];
  }
}
