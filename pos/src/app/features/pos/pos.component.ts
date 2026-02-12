import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../core/services/cart.service';
import { SaleService } from '../../core/services/sale.service';
import { CheckoutRequest } from '../../core/models/sale.model';
import { Product } from '../../core/models/product.model';
import { OAuthService } from 'angular-oauth2-oidc';

// Components
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { CartPanelComponent } from './components/cart-panel/cart-panel.component';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductGridComponent,
    CartPanelComponent,
    PaymentModalComponent
  ],
  template: `
    <div class="pos-header">
      <div class="brand-section">
        <div class="logo-icon">🛍️</div>
        <div class="store-info">
            <span class="store-name">Main Store</span>
            <span class="register-info">Register 01 • Online</span>
        </div>
      </div>
      
      <div class="header-right">
        <!-- Date & Time -->
        <div class="datetime-section">
            <span class="time">{{ currentDate | date:'shortTime' }}</span>
            <span class="date">{{ currentDate | date:'mediumDate' }}</span>
        </div>

        <div class="user-profile-wrapper" (click)="toggleProfileMenu()">
            <div class="user-avatar-circle">
                <span>{{ cashierInitials }}</span>
            </div>
            <div class="cashier-info">
                <span class="cashier-name">{{ cashierName }}</span>
                <span class="cashier-role">{{ cashierRole }}</span>
            </div>
            <div class="chevron">⌄</div>

            <!-- Dropdown Menu -->
            <div class="profile-dropdown" *ngIf="isProfileMenuOpen">
                <div class="dropdown-item">
                    <!-- User SVG -->
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Profil
                </div>
                <div class="dropdown-item">
                    <!-- Key SVG -->
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 2L12 11M21 2H15M21 2V8M10 11.5C10 12.1934 9.86343 12.8799 9.59809 13.5204C9.33276 14.161 8.94389 14.7429 8.45355 15.2332C7.96321 15.7236 7.38131 16.1124 6.7408 16.3778C6.10029 16.6431 5.41378 16.7797 4.72044 16.7797C4.0271 16.7797 3.34059 16.6431 2.70008 16.3778C2.05957 16.1124 1.47767 15.7236 0.987332 15.2332C0.496994 14.7429 0.108125 14.161 -0.157209 13.5204C-0.422543 12.8799 -0.559109 12.1934 -0.559109 11.5C-0.559109 8.58629 1.80257 6.22415 4.72044 6.22415C6.17188 6.22415 7.48599 6.81238 8.45355 7.76685L10 6.22044L12 8.22044L10 10.2204L10 11.5Z" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <!-- Simplified key path mainly -->
                        <path d="M10 11C10 14.866 6.866 18 3 18C2.25 18 1.5 17.8 0.8 17.5" stroke="white" stroke-width="0"/> <!-- Clearing mask hack if needed, but let's stick to simple path -->
                        <path d="M15.5 5.5L11.5 9.5C10.7483 8.74832 9.77121 8.27581 8.73031 8.13627M8.13627 8.73031C8.27581 9.77121 8.74832 10.7483 9.5 11.5C9.5 11.5 11 10 12 9" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                         <path d="M7 11C7 13.2091 5.20914 15 3 15C0.790861 15 -1 13.2091 -1 11C-1 8.79086 0.790861 7 3 7C5.20914 7 7 8.79086 7 11Z" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                         <circle cx="3" cy="11" r="1" fill="#4B5563"/>
                         <path d="M11 7L13 9" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Changer mot de passe
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item text-danger" (click)="logout()">
                    <!-- Logout SVG -->
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Déconnexion
                </div>
            </div>
        </div>
      </div>
    </div>
    <div class="pos-layout">
      <!-- Left Side: Product Grid -->
      <div class="left-panel">
        <app-product-grid
          [products]="products"
          [categories]="categories"
          (addToCart)="addToCart($event)"
          (search)="onSearch($event)"
        ></app-product-grid>
      </div>

      <!-- Right Side: Cart Panel -->
      <div class="right-panel">
        <app-cart-panel
          [cartItems]="cartItems"
          [total]="totalAmount"
          (updateQuantity)="updateQuantity($event)"
          (removeItem)="removeFromCart($event)"
          (clearCart)="clearCart()"
          (checkout)="openPaymentModal()"
        ></app-cart-panel>
      </div>

      <!-- Overlays -->
      <app-payment-modal 
      [isOpen]="isPaymentModalOpen"
      [total]="totalAmount"
      [subtotal]="subtotal"
      [tax]="tax"
      [cartItems]="cartItems"
      (closeEvent)="closePaymentModal()"
      (checkoutEvent)="processCheckout($event)"
    ></app-payment-modal>
    </div>
  `,
  styles: [`
    .pos-header {
      height: 64px;
      background-color: var(--color-surface);
      color: var(--color-text-primary);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 var(--spacing-lg);
      border-bottom: 1px solid var(--color-border);
      z-index: 100;
      position: relative;
    }

    .brand-section {
       display: flex;
       align-items: center;
       gap: var(--spacing-md);
    }
    
    .logo-icon {
        background: var(--color-primary);
        color: white;
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }

    .store-info {
        display: flex;
        flex-direction: column;
    }

    .store-name {
      font-weight: 700;
      font-size: 16px;
      color: var(--color-text-primary);
    }

    .register-info {
        font-size: 12px;
        color: var(--color-text-secondary);
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 32px;
    }

    .datetime-section {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        text-align: right;
        padding-right: 32px;
        border-right: 1px solid var(--color-border);
    }

    .time {
        font-weight: 700;
        font-size: 16px;
        color: var(--color-text-primary);
    }
    
    .date {
        font-size: 12px;
        color: var(--color-text-secondary);
    }

    .user-profile-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: var(--radius-md);
        transition: background-color 0.2s;
        position: relative;
    }
    
    .user-profile-wrapper:hover {
        background-color: #F3F4F6;
    }

    .user-avatar-circle {
        width: 36px;
        height: 36px;
        background-color: #FFEDD5; /* Light Orange */
        color: #EA580C;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
    }

    .cashier-info {
        display: flex;
        flex-direction: column;
        text-align: left;
    }

    .cashier-name {
        font-weight: 600;
        font-size: 14px;
    }
    
    .cashier-role {
        font-size: 12px;
        color: var(--color-text-secondary);
    }
    
    .chevron {
        color: var(--color-text-secondary);
        font-size: 12px;
        margin-left: 4px;
    }

    .profile-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        width: 220px;
        background: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--color-border);
        padding: 8px 0;
        margin-top: 8px;
        z-index: 1000;
    }
    
    .dropdown-item {
        padding: 10px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        color: var(--color-text-primary);
        cursor: pointer;
        transition: background 0.1s;
    }
    
    .dropdown-item svg {
        min-width: 18px; /* Prevent shrinking */
    }
    
    .dropdown-item:hover {
        background-color: #F3F4F6;
    }
    
    .dropdown-divider {
        height: 1px;
        background-color: var(--color-border);
        margin: 6px 0;
    }
    
    .text-danger {
        color: var(--color-error);
    }

    .pos-layout {
      display: flex;
      height: calc(100vh - 64px);
      width: 100vw;
      overflow: hidden;
      background-color: var(--color-background);
    }

    .left-panel {
      flex: 65;
      height: 100%;
      overflow: hidden;
    }

    .right-panel {
      flex: 35;
      height: 100%;
      box-shadow: -4px 0 15px rgba(0,0,0,0.05);
      z-index: 10;
    }

    @media (max-width: 1024px) {
      .pos-layout {
        flex-direction: column;
      }
      
      .left-panel {
        flex: 1;
        overflow-y: auto;
      }

      .right-panel {
        height: auto;
        border-top: 1px solid var(--color-border);
      }
    }
  `]
})
export class PosComponent implements OnInit {
  // Cart Data
  cartItems: CartItem[] = [];
  products: Product[] = [];
  totalAmount = 0;

  get subtotal(): number {
    return this.totalAmount * 0.8333;
  }

  get tax(): number {
    return this.totalAmount - this.subtotal;
  }

  categories: string[] = ['Tous', 'Électronique', 'Accessoires', 'Mode', 'Maison'];

  isPaymentModalOpen = false;

  // Header State
  currentDate = new Date();
  isProfileMenuOpen = false;
  cashierName = 'Cashier';
  cashierRole = 'Cashier';
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

    setInterval(() => {
      this.currentDate = new Date();
    }, 60000); // Update every minute
  }

  loadUserProfile() {
    const claims: any = this.oauthService.getIdentityClaims();
    if (claims) {
      this.cashierName = claims['name'] || claims['preferred_username'] || 'Cashier';

      // Extract initials
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
        this.products = page.content.map(stock => ({
          id: stock.productId,
          name: stock.productName,
          sku: stock.productSku,
          price: stock.sellingPrice || 0,
          category: 'Général', // Placeholder
          taxRate: 0
        }));
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

  onSearch(term: string) {
    this.loadProducts(term);
  }

  addToCart(product: any) {
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

  openPaymentModal() {
    this.isPaymentModalOpen = true;
  }

  closePaymentModal() {
    this.isPaymentModalOpen = false;
  }

  processCheckout(paymentMethod: string) {
    if (this.cartItems.length === 0) return;

    const method = paymentMethod as 'CASH' | 'CARD' | 'MOBILE' | 'MIXED';

    const request: CheckoutRequest = {
      items: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      paymentMethod: method,
      notes: 'POS Sale'
    };

    console.log('Processing checkout with', paymentMethod);

    this.saleService.checkout(request).subscribe({
      next: (sale) => {
        console.log('Sale success', sale);
        this.closePaymentModal();
        this.clearCart();
        alert('Paiement accepté ! Ticket #' + sale.saleNumber);
      },
      error: (err) => {
        console.error('Sale error', err);
        alert('Erreur lors du paiement. Veuillez réessayer.');
      }
    });
  }
}
