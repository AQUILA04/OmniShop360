import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { SaleService } from '../../core/services/sale.service';
import { CheckoutRequest } from '../../core/models/sale.model';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserProfile } from '../../core/models/user-profile.model';

import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';
import { ReceiptPreviewModalComponent } from './components/receipt-preview-modal/receipt-preview-modal.component';
import { Product } from '../../core/models/product.model';
import {ProductGridComponent} from "./components/product-grid/product-grid.component";
import { CartPanelComponent } from "./components/cart-panel/cart-panel.component";
import { PosSidebarComponent } from "./components/pos-sidebar/pos-sidebar.component";
import { RegisterModalComponent } from './components/register-modal/register-modal.component';
import { CustomerSelectorComponent, Customer } from './components/customer-selector/customer-selector.component';
import { CustomerCreateModalComponent } from './components/customer-create-modal/customer-create-modal.component';
import { CashDrawerService, CashDrawerSession } from '../../core/services/cash-drawer.service';
import { Customer as RealCustomer } from '../../core/models/customer.model';
import { AlertModalComponent } from '../../shared/components/alert-modal/alert-modal.component';

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
    RegisterModalComponent,
    CustomerSelectorComponent,
    CustomerCreateModalComponent,
    AlertModalComponent,
    RouterLink
  ],
  template: `
    <div class="pos-root">
      <!-- Sidebar -->
      <app-pos-sidebar></app-pos-sidebar>

      <!-- Main area -->
      <div class="pos-body">

        <!-- Header -->
        <header class="pos-header">
          <div class="header-left">
            <div class="store-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="store-details">
              <span class="store-name">{{ storeName }}</span>
              <span class="store-status">
                <span class="status-dot"></span>
                En ligne
              </span>
            </div>
          </div>

          <div class="header-right">
            <div class="datetime-pill">
              <span class="time-text">{{ currentDate | date:'HH:mm' }}</span>
              <span class="date-sep">·</span>
              <span class="date-text">{{ currentDate | date:'dd MMM yyyy' }}</span>
            </div>

            <div class="user-pill" (click)="toggleProfileMenu()">
              <div class="user-initials-circle">
                <span>{{ cashierInitials }}</span>
              </div>
              <div class="user-details">
                <span class="user-name">{{ cashierName }}</span>
                <span class="user-role">{{ cashierRole }}</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="chevron-icon">
                <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              <!-- Dropdown -->
              <div class="profile-dropdown" *ngIf="isProfileMenuOpen" (click)="$event.stopPropagation()">
                <div class="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Profil
                </div>
                <a routerLink="/back-office" class="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9L12 2L21 9V20C21 20.55 20.78 21.04 20.41 21.41C20.04 21.78 19.55 22 19 22H5C4.45 22 3.96 21.78 3.59 21.41C3.21 21.04 3 20.55 3 20V9Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Back Office
                </a>
                <div class="dropdown-item" (click)="triggerCloseRegister()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M16 11V7A4 4 0 008 7V11M5 9H19L20 21H4L5 9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Clôturer la Caisse
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item danger-item" (click)="logout()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 17L21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Déconnexion
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Content split -->
        <div class="pos-content">

          <!-- Left: Products -->
          <div class="products-panel">
            <app-product-grid
              [products]="products"
              [categories]="categories"
              [allowNegativeStock]="allowNegativeStock"
              (addToCart)="addToCart($event)"
              (search)="onSearch($event)">
            </app-product-grid>
          </div>

          <!-- Right: Cart -->
          <div class="cart-panel-wrapper">
            <div class="cart-customer-section" style="padding: 16px 16px 0;">
               <app-customer-selector (customerSelected)="onCustomerSelected($event)"></app-customer-selector>
            </div>
            <app-cart-panel
              [cartItems]="cartItems"
              [total]="totalAmount"
              [discountAmount]="discountAmount"
              [customerName]="customerName"
              (updateQuantity)="updateQuantity($event)"
              (removeItem)="removeFromCart($event)"
              (clearCart)="clearCart()"
              (applyPromoCode)="onApplyPromoCode($event)"
              (checkout)="openPaymentModal()"
              (newCustomer)="openCustomerCreateModal()"
              (editCustomer)="isCustomerSelectorOpen = true">
            </app-cart-panel>
          </div>
        </div>

        <!-- Mobile floating cart bar -->
        <div class="floating-cart-bar" (click)="openMobileCart()">
          <div class="fcb-left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.31658 15.6834 4.59345 16.3536 5.14645 16.3536H19" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Panier ({{ cartItems.length }})</span>
          </div>
          <span class="fcb-total">{{ totalAmount | currency:'EUR':'symbol':'1.2-2' }}</span>
        </div>
      </div>

      <!-- Mobile overlays -->
      <div class="sheet-overlay" *ngIf="isMobileCartOpen" (click)="closeMobileCart()"></div>
      <div class="bottom-sheet" [class.open]="isMobileCartOpen">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <h3>Votre Panier</h3>
          <button class="sheet-close" (click)="closeMobileCart()">×</button>
        </div>
        <app-cart-panel
          [cartItems]="cartItems"
          [total]="totalAmount"
          [discountAmount]="discountAmount"
          [customerName]="customerName"
          (updateQuantity)="updateQuantity($event)"
          (removeItem)="removeFromCart($event)"
          (clearCart)="clearCart()"
          (applyPromoCode)="onApplyPromoCode($event)"
          (checkout)="openPaymentModal(); closeMobileCart();"
          (newCustomer)="openCustomerCreateModal()"
          (editCustomer)="isCustomerSelectorOpen = true">
        </app-cart-panel>
      </div>

      <!-- Modals -->
      <app-payment-modal
        [isOpen]="isPaymentModalOpen"
        [total]="totalAmount"
        [subtotal]="subtotal"
        [tax]="tax"
        [cartItems]="cartItems"
        (closeEvent)="closePaymentModal()"
        (checkoutEvent)="processCheckout($event)">
      </app-payment-modal>

      <app-success-modal
        [isOpen]="isSuccessModalOpen"
        [ticketNumber]="lastSaleTicket"
        [totalAmount]="lastTotalAmount"
        [paymentMethod]="lastPaymentMethod"
        [transactionDate]="lastTransactionDate"
        [change]="lastChange"
        (print)="printReceipt()"
        (printInvoice)="printInvoice()"
        (newSale)="startNewSale()">
      </app-success-modal>

      <app-receipt-preview-modal
        [isOpen]="isReceiptPreviewOpen"
        [ticketNumber]="lastSaleTicket"
        [totalAmount]="lastTotalAmount"
        [paymentMethod]="lastPaymentMethod"
        [payments]="lastPayments"
        [transactionDate]="lastTransactionDate"
        [cartItems]="lastCartItems"
        [printFormat]="receiptFormat"
        (printFormatChange)="receiptFormat = $event"
        (close)="closeReceiptPreview()"
        (newSale)="startNewSale()">
      </app-receipt-preview-modal>

      <app-customer-create-modal
        [isOpen]="isCustomerCreateModalOpen"
        (closeEvent)="isCustomerCreateModalOpen = false"
        (customerCreated)="onCustomerCreated($event)"
        (errorCreate)="showAlert($event, 'error', 'Erreur de création')">
      </app-customer-create-modal>

      <app-register-modal
        [isOpen]="isRegisterModalOpen"
        [mode]="registerModalMode"
        [isForced]="isRegisterForced"
        [openingBalance]="activeSession?.openingFloat || 0"
        [expectedCashSales]="totalCashSales"
        (close)="closeRegisterModal()"
        (submitEvent)="onRegisterSubmit($event)">
      </app-register-modal>

      <app-alert-modal
        [isOpen]="isAlertOpen"
        [title]="alertTitle"
        [message]="alertMessage"
        [type]="alertType"
        (close)="isAlertOpen = false">
      </app-alert-modal>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    .pos-root {
      display: flex;
      height: 100vh;
      width: 100vw;
      background: #FBF8FF;
    }

    /* ===== MAIN BODY ===== */
    .pos-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      height: 100vh;
      overflow: hidden;
    }

    /* ===== HEADER ===== */
    .pos-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      background: #FFFFFF;
      box-shadow: 0 1px 0 rgba(0,0,0,0.06);
      flex-shrink: 0;
      position: relative;
      z-index: 10;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .store-logo-icon {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #005cad 0%, #2075d0 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .store-details {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .store-name {
      font-size: 14px;
      font-weight: 700;
      color: #1a2035;
    }

    .store-status {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: #676C73;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #1a7a4a;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .datetime-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #F4F2FF;
      border-radius: 999px;
    }

    .time-text {
      font-size: 14px;
      font-weight: 700;
      color: #1a2035;
    }

    .date-sep {
      font-size: 12px;
      color: #C6D1D7;
    }

    .date-text {
      font-size: 12px;
      color: #676C73;
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px 6px 6px;
      border-radius: 999px;
      background: #F4F2FF;
      cursor: pointer;
      position: relative;
      transition: background 150ms;
    }

    .user-pill:hover {
      background: #E8EDF5;
    }

    .user-initials-circle {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #005cad 0%, #2075d0 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #1a2035;
      line-height: 1;
    }

    .user-role {
      font-size: 11px;
      color: #9BA3AF;
    }

    .chevron-icon {
      color: #9BA3AF;
      flex-shrink: 0;
    }

    /* Dropdown */
    .profile-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      min-width: 200px;
      background: #FFFFFF;
      border-radius: 14px;
      box-shadow: 0 12px 40px rgba(25, 27, 38, 0.15), 0 1px 4px rgba(0,0,0,0.06);
      padding: 8px;
      z-index: 100;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      font-size: 13px;
      color: #555663;
      border-radius: 8px;
      cursor: pointer;
      transition: background 100ms;
      text-decoration: none;
    }

    .dropdown-item:hover {
      background: #F4F2FF;
    }

    .dropdown-divider {
      height: 1px;
      background: #F4F2FF;
      margin: 4px 0;
    }

    .danger-item {
      color: #D93E3E;
    }

    .danger-item:hover {
      background: #FDECEC;
    }

    /* ===== CONTENT AREA ===== */
    .pos-content {
      flex: 1;
      display: flex;
      overflow: hidden;
      padding: 0;
    }

    /* Products panel */
    .products-panel {
      flex: 1;
      min-width: 0;
      padding: 20px 16px 20px 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Cart panel */
    .cart-panel-wrapper {
      width: 360px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border-left: 1px solid rgba(0,0,0,0.05);
    }

    /* ===== MOBILE FLOATING CART ===== */
    .floating-cart-bar {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(135deg, #005cad 0%, #2075d0 100%);
      color: #fff;
      padding: 0 20px;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      z-index: 50;
    }

    .fcb-left {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }

    .fcb-total {
      font-size: 18px;
      font-weight: 700;
    }

    @media (max-width: 767px) {
      .floating-cart-bar { display: flex; }
      .cart-panel-wrapper { display: none; }
      .products-panel { padding-bottom: 80px; }
    }

    /* ===== BOTTOM SHEET ===== */
    .sheet-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 200;
    }

    .bottom-sheet {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      max-height: 85vh;
      background: #FFFFFF;
      border-radius: 20px 20px 0 0;
      z-index: 201;
      transform: translateY(100%);
      transition: transform 300ms ease;
      display: flex;
      flex-direction: column;
    }

    .bottom-sheet.open {
      transform: translateY(0);
    }

    .sheet-handle {
      width: 36px;
      height: 4px;
      background: #E8EDF5;
      border-radius: 999px;
      margin: 12px auto 0;
      flex-shrink: 0;
    }

    .sheet-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
    }

    .sheet-header h3 {
      font-size: 18px;
      font-weight: 700;
      color: #1a2035;
      margin: 0;
    }

    .sheet-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: #F4F2FF;
      color: #676C73;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class PosComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  products: Product[] = [];
  totalAmount = 0;
  storeName = 'Boutique Paris';
  customerName = 'Client Divers';
  selectedCustomer: Customer | null = null;
  allowNegativeStock = true; // For E.2
  discountAmount = 0; // For E.3

  get subtotal(): number { return (this.totalAmount + this.discountAmount) * 0.8333; }
  get tax(): number { return this.totalAmount - this.subtotal; }

  categories: string[] = ['Tous', 'Alimentation', 'Boissons', 'Électronique', 'Hygiène', 'Divers'];

  isPaymentModalOpen = false;
  isSuccessModalOpen = false;
  isReceiptPreviewOpen = false;
  isMobileCartOpen = false;
  isCustomerCreateModalOpen = false;
  isCustomerSelectorOpen = false;
  isProfileMenuOpen = false;
  isAlertOpen = false;
  alertTitle = '';
  alertMessage = '';
  alertType: 'error' | 'info' | 'success' = 'info';

  isRegisterModalOpen = false;
  registerModalMode: 'open' | 'close' = 'open';
  isRegisterForced = false;
  activeSession: CashDrawerSession | null = null;
  totalCashSales = 0; // Mock tracker for expected cash sales

  lastSaleTicket = '';
  lastPaymentMethod = 'Espèces';
  lastPayments: any[] = [];
  lastTransactionDate = new Date();
  lastChange = 0;
  lastTotalAmount = 0;
  lastCartItems: CartItem[] = [];
  receiptFormat: 'thermal' | 'A4' = 'thermal';

  currentDate = new Date();
  private dateInterval: any;
  cashierName = 'Caissier';
  cashierRole = 'Caissier';
  cashierInitials = 'C';

  constructor(
    private cartService: CartService,
    private saleService: SaleService,
    private oauthService: OAuthService,
    private cashDrawerService: CashDrawerService
  ) {}

  ngOnInit() {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.cartService.totalAmount;
      this.discountAmount = this.cartService.discountAmount;
    });

    this.loadProducts();
    this.loadUserProfile();
    this.checkRegisterSession();

    this.dateInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }

  checkRegisterSession() {
    this.cashDrawerService.checkSession().subscribe(session => {
      this.activeSession = session?.content[0] ?? null;
      if (!this.activeSession || this.activeSession.status === 'CLOSED') {
        this.openRegisterModal('open', true);
      }
    });
  }

  ngOnDestroy() {
    if (this.dateInterval) clearInterval(this.dateInterval);
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

  toggleProfileMenu() { this.isProfileMenuOpen = !this.isProfileMenuOpen; }
  logout() { this.oauthService.logOut(); }

  loadProducts(search?: string) {
    this.saleService.getProductsForSale(0, 50, search).subscribe({
      next: (page) => {
        this.products = page.content.map(stock => this.saleService.mapStockToProduct(stock));
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

  onSearch(term: string) { this.loadProducts(term); }
  addToCart(product: Product) { this.cartService.addToCart(product); }
  removeFromCart(productId: string) { this.cartService.removeFromCart(productId); }
  updateQuantity(event: { id: string, qty: number }) { this.cartService.updateQuantity(event.id, event.qty); }
  clearCart() { this.cartService.clearCart(); }
  openMobileCart() { this.isMobileCartOpen = true; }
  closeMobileCart() { this.isMobileCartOpen = false; }
  openPaymentModal() { this.isPaymentModalOpen = true; }
  closePaymentModal() { this.isPaymentModalOpen = false; }

  onApplyPromoCode(code: string) {
    // Dans la réalité, on vérifierait d'abord l'API. ICI ON MOCK:
    if (code === 'PROMO10') {
      this.cartService.applyPromo(code, 'PERCENTAGE', 10);
    } else if (code === '5OFF') {
      this.cartService.applyPromo(code, 'FIXED_AMOUNT', 5);
    } else {
      this.showAlert("Code d'offres invalide ou expiré", "error");
    }
  }

  openCustomerCreateModal() {
    this.isCustomerCreateModalOpen = true;
  }

  onCustomerCreated(customer: RealCustomer) {
    this.showAlert(`Client ${customer.firstName} ${customer.lastName} créé avec succès!`, 'success', 'Succès');
    const selectorCustomer: Customer = {
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone
    };
    this.onCustomerSelected(selectorCustomer); // Select this customer immediately
  }

  onCustomerSelected(customer: Customer) {
    this.selectedCustomer = customer;
    this.customerName = customer.name;
  }

  getPaymentMethodName(method: string): string {
    const mapping: Record<string, string> = {
      'CASH': 'Espèces',
      'CARD': 'Carte',
      'MOBILE': 'Mobile',
      'CHECK': 'Chèque',
      'MIXED': 'Mixte'
    };
    return mapping[method] || method;
  }

  processCheckout(paymentResult: any) {
    if (this.cartItems.length === 0) return;

    const request: CheckoutRequest = {
      customerId: this.selectedCustomer?.id,
      items: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      payments: paymentResult.payments || [{ method: paymentResult.method || 'CASH', amount: this.totalAmount }],
      discountAmount: this.discountAmount,
      promoCode: this.cartService.getPromoDetails()?.code,
      notes: 'POS Sale'
    };

    this.saleService.checkout(request).subscribe({
      next: (sale) => {
        this.lastSaleTicket = sale.saleNumber;
        const recordedPayments = request.payments && request.payments.length > 0
            ? request.payments 
            : [{ method: 'CASH', amount: this.totalAmount }];
        
        this.lastPayments = recordedPayments;
        // Keep lastPaymentMethod backward compatible string list if needed
        this.lastPaymentMethod = recordedPayments.map(p => this.getPaymentMethodName(p.method)).join(', ');
        
        this.lastTransactionDate = new Date();
        const totalPaid = recordedPayments.reduce((s,p) => s+p.amount, 0);
        this.lastChange = Math.max(0, totalPaid - this.totalAmount);
        this.lastTotalAmount = this.totalAmount;
        this.lastCartItems = [...this.cartItems];

        // Ensure cart is emptied immediately to remove floating bar
        this.clearCart();
        this.closeMobileCart();
        this.closePaymentModal();
        this.isSuccessModalOpen = true;
      },
      error: (err) => {
        console.error('Sale error', err);
        let errorMsg = "Erreur lors du paiement. Veuillez réessayer.";
        if (err.error && err.error.message) {
            errorMsg = err.error.message;
        }
        this.showAlert(errorMsg, "error", "Échec du paiement");
      }
    });
  }

  startNewSale() {
        this.isSuccessModalOpen = false;
        this.isReceiptPreviewOpen = false;
        // The cart is already cleared during checkout success
        this.loadProducts();
  }

  printReceipt() {
    this.receiptFormat = 'thermal';
    this.isSuccessModalOpen = false;
    this.isReceiptPreviewOpen = true;
  }

  printInvoice() { 
    this.receiptFormat = 'A4';
    this.isSuccessModalOpen = false;
    this.isReceiptPreviewOpen = true;
  }
  openReceiptPreview() { this.isReceiptPreviewOpen = true; }
  closeReceiptPreview() { this.isReceiptPreviewOpen = false; }

  // --- Cash Drawer Management ---
  openRegisterModal(mode: 'open' | 'close', forced = false) {
    this.registerModalMode = mode;
    this.isRegisterForced = forced;
    this.isRegisterModalOpen = true;
    this.isProfileMenuOpen = false;
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
  }

  triggerCloseRegister() {
    this.openRegisterModal('close', false);
  }

  onRegisterSubmit(event: { amount: number, notes: string }) {
    if (this.registerModalMode === 'open') {
      this.cashDrawerService.openDrawer(event.amount, event.notes).subscribe({
        next: (session) => {
          this.activeSession = session;
          this.isRegisterModalOpen = false;
        },
        error: (err) => console.error('Error opening register', err)
      });
    } else {
      this.cashDrawerService.closeDrawer(event.amount, event.notes).subscribe({
        next: (session) => {
          this.activeSession = null;
          this.isRegisterModalOpen = false;
          // Force re-opening
          this.showAlert('Caisse clôturée. Un récapitulatif a été imprimé.', 'info');
          this.checkRegisterSession();
        },
        error: (err) => console.error('Error closing register', err)
      });
    }
  }

  showAlert(message: string, type: 'error' | 'info' | 'success' = 'info', title: string = '') {
    this.alertMessage = message;
    this.alertType = type;
    this.alertTitle = title;
    this.isAlertOpen = true;
  }
}

