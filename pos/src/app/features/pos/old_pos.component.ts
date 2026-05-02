import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { SaleService } from '../../core/services/sale.service';
import { CheckoutRequest } from '../../core/models/sale.model';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserProfile } from '../../core/models/user-profile.model';

import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { CartPanelComponent } from './components/cart-panel/cart-panel.component';
import { PosSidebarComponent } from './components/pos-sidebar/pos-sidebar.component';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';
import { ReceiptPreviewModalComponent } from './components/receipt-preview-modal/receipt-preview-modal.component';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductGridComponent,
    CartPanelComponent,
    PosSidebarComponent,
    PaymentModalComponent,
    SuccessModalComponent,
    ReceiptPreviewModalComponent,
    RouterLink
  ],
  template: `
    <div class="pos-wrapper desktop-sidebar-layout">
      <!-- Desktop Sidebar -->
      <app-pos-sidebar></app-pos-sidebar>

      <div class="pos-main-content">
        <!-- Header -->
        <header class="pos-header">
        <div class="brand-section">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="store-info">
            <span class="store-name">{{ storeName }}</span>
            <span class="register-info">En ligne</span>
          </div>
        </div>

        <div class="header-right">
          <div class="datetime-section">
            <span class="time">{{ currentDate | date:'HH:mm' }}</span>
            <span class="date">{{ currentDate | date:'dd MMM yyyy' }}</span>
          </div>

          <div class="user-profile-wrapper" (click)="toggleProfileMenu()">
            <div class="user-avatar-circle">
              <span>{{ cashierInitials }}</span>
            </div>
            <div class="cashier-info">
              <span class="cashier-name">{{ cashierName }}</span>
              <span class="cashier-role">{{ cashierRole }}</span>
            </div>
            <span class="chevron">▼</span>

            <!-- Profile Dropdown -->
            <div class="profile-dropdown" *ngIf="isProfileMenuOpen">
              <div class="dropdown-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                </svg>
                Profil
              </div>
              <a routerLink="/back-office" class="dropdown-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                Back Office
              </a>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item text-danger" (click)="logout()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 17L21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Déconnexion
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="pos-layout">
        <!-- Left Panel: Product Grid -->
        <div class="pos-left-panel">
          <app-product-grid 
            [products]="products" 
            [categories]="categories" 
            (addToCart)="addToCart($event)"
            (search)="onSearch($event)">
          </app-product-grid>
        </div>

        <!-- Right Panel: Cart -->
        <div class="pos-right-panel">
          <app-cart-panel 
            [cartItems]="cartItems" 
            [total]="totalAmount"
            [customerName]="customerName"
            (updateQuantity)="updateQuantity($event)"
            (removeItem)="removeFromCart($event)"
            (clearCart)="clearCart()"
            (checkout)="openPaymentModal()">
          </app-cart-panel>
        </div>
      </div>

      <!-- Mobile: Floating Cart Bar -->
      <div class="floating-cart-bar" (click)="openMobileCart()">
        <div class="floating-cart-info">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.31658 15.6834 4.59345 16.3536 5.14645 16.3536H19" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="floating-cart-count">Panier ({{ cartItems.length }})</span>
        </div>
        <span class="floating-cart-total">{{ totalAmount | currency:'EUR':'symbol':'1.2-2' }}</span>
      </div>

      <!-- Mobile: Bottom Sheet Overlay -->
      <div class="bottom-sheet-overlay" *ngIf="isMobileCartOpen" (click)="closeMobileCart()"></div>
      
      <!-- Mobile: Bottom Sheet -->
      <div class="bottom-sheet" [class.open]="isMobileCartOpen">
        <div class="bottom-sheet-handle"></div>
        <div class="bottom-sheet-header">
          <h3 class="bottom-sheet-title">Votre Panier</h3>
          <button class="bottom-sheet-close" (click)="closeMobileCart()">×</button>
        </div>
        <app-cart-panel 
          [cartItems]="cartItems" 
          [total]="totalAmount"
          [customerName]="customerName"
          (updateQuantity)="updateQuantity($event)"
          (removeItem)="removeFromCart($event)"
          (clearCart)="clearCart()"
          (checkout)="openPaymentModal(); closeMobileCart();">
        </app-cart-panel>
      </div>

      <!-- Payment Modal -->
      <app-payment-modal 
        [isOpen]="isPaymentModalOpen" 
        [total]="totalAmount" 
        [subtotal]="subtotal" 
        [tax]="tax"
        [cartItems]="cartItems"
        (closeEvent)="closePaymentModal()"
        (checkoutEvent)="processCheckout($event)">
      </app-payment-modal>

      <!-- Success Modal -->
      <app-success-modal 
        [isOpen]="isSuccessModalOpen" 
        [ticketNumber]="lastSaleTicket" 
        [totalAmount]="totalAmount"
        [paymentMethod]="lastPaymentMethod"
        [transactionDate]="lastTransactionDate"
        [change]="lastChange"
        (print)="printReceipt()"
        (printInvoice)="printInvoice()"
        (newSale)="startNewSale()">
      </app-success-modal>

      <!-- Receipt Preview Modal -->
      <app-receipt-preview-modal 
        [isOpen]="isReceiptPreviewOpen" 
        [ticketNumber]="lastSaleTicket" 
        [totalAmount]="totalAmount"
        [paymentMethod]="lastPaymentMethod"
        [transactionDate]="lastTransactionDate"
        [cartItems]="cartItems"
        (close)="closeReceiptPreview()"
        (newSale)="startNewSale()">
      </app-receipt-preview-modal>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
      background-color: var(--color-background);
    }
    .pos-wrapper {
      display: flex;
      height: 100vh;
      width: 100vw;
    }
    .pos-main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      /* Ensures content resizes correctly */
      min-width: 0;
    }
    .pos-layout {
      flex: 1;
      display: flex;
      overflow: hidden;
      gap: var(--space-4);
      /* Right panel must be flush with bottom — no bottom padding */
      padding: 0 var(--space-4) 0 0;
    }
    .pos-left-panel {
      flex: 1;
      min-width: 0;
      padding: var(--space-4) 0;
    }
    .pos-right-panel {
      width: 380px;
      flex-shrink: 0;
      /* Flex column so app-cart-panel fills to the very bottom */
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .pos-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4) var(--space-6);
      background: transparent;
      margin-bottom: var(--space-2);
    }
  `]
})
export class PosComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  products: Product[] = [];
  totalAmount = 0;
  storeName = 'Boutique Paris';
  customerName = 'Client Divers';

  get subtotal(): number {
    return this.totalAmount * 0.8333;
  }

  get tax(): number {
    return this.totalAmount - this.subtotal;
  }

  categories: string[] = ['Tous', 'Alimentation', 'Boissons', 'Électronique', 'Hygiène', 'Divers'];

  isPaymentModalOpen = false;
  isSuccessModalOpen = false;
  isReceiptPreviewOpen = false;
  isMobileCartOpen = false;
  lastSaleTicket = '';
  lastPaymentMethod = 'Espèces';
  lastTransactionDate = new Date();
  lastChange = 0;

  currentDate = new Date();
  private dateInterval: any;
  isProfileMenuOpen = false;
  cashierName = 'Caissier';
  cashierRole = 'Caissier';
  cashierInitials = 'C';

  constructor(
    private cartService: CartService,
    private saleService: SaleService,
    private oauthService: OAuthService
  ) { }

  ngOnInit() {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.cartService.totalAmount;
    });

    this.loadProducts();
    this.loadUserProfile();

    this.dateInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }

  ngOnDestroy() {
    if (this.dateInterval) {
      clearInterval(this.dateInterval);
    }
  }

  loadUserProfile() {
    const claims = this.oauthService.getIdentityClaims() as UserProfile;
    if (claims) {
      this.cashierName = claims['name'] || claims['preferred_username'] || 'Caissier';

      const parts = this.cashierName.split(' ');
      if (parts.length >= 2) {
        this.cashierInitials = (parts[0][0] + parts[1][0]).toUpperCase();
      } else if (this.cashierName.length > 0) {
        this.cashierInitials = this.cashierName.substring(0, 2).toUpperCase();
      }
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout() {
    this.oauthService.logOut();
  }

  loadProducts(search?: string) {
    this.saleService.getProductsForSale(0, 50, search).subscribe({
      next: (page) => {
        this.products = page.content.map(stock => this.saleService.mapStockToProduct(stock));
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

  onSearch(term: string) {
    this.loadProducts(term);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(event: { id: string, qty: number }) {
    this.cartService.updateQuantity(event.id, event.qty);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  openMobileCart() {
    this.isMobileCartOpen = true;
  }

  closeMobileCart() {
    this.isMobileCartOpen = false;
  }

  openPaymentModal() {
    this.isPaymentModalOpen = true;
  }

  closePaymentModal() {
    this.isPaymentModalOpen = false;
  }

  processCheckout(payment: any) {
    if (this.cartItems.length === 0) return;

    const request: CheckoutRequest = {
      items: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      paymentMethod: payment.method as 'CASH' | 'CARD' | 'MOBILE' | 'MIXED',
      notes: 'POS Sale'
    };

    this.saleService.checkout(request).subscribe({
      next: (sale) => {
        this.lastSaleTicket = sale.saleNumber;
        this.lastPaymentMethod = payment.method;
        this.lastTransactionDate = new Date();
        this.lastChange = payment.amount - this.totalAmount;
        this.closePaymentModal();
        this.isSuccessModalOpen = true;
      },
      error: (err) => {
        console.error('Sale error', err);
        alert('Erreur lors du paiement. Veuillez réessayer.');
      }
    });
  }

  startNewSale() {
    this.isSuccessModalOpen = false;
    this.isReceiptPreviewOpen = false;
    this.clearCart();
    this.loadProducts();
  }

  printReceipt() {
    this.isSuccessModalOpen = false;
    this.isReceiptPreviewOpen = true;
  }

  printInvoice() {
    console.log('Printing invoice...');
  }

  openReceiptPreview() {
    this.isReceiptPreviewOpen = true;
  }

  closeReceiptPreview() {
    this.isReceiptPreviewOpen = false;
  }
}
