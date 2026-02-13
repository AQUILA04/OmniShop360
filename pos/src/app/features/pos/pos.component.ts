import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { SaleService } from '../../core/services/sale.service';
import { CheckoutRequest } from '../../core/models/sale.model';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserProfile } from '../../core/models/user-profile.model';

// Components
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { CartPanelComponent } from './components/cart-panel/cart-panel.component';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';
import { ReceiptPreviewModalComponent } from './components/receipt-preview-modal/receipt-preview-modal.component';
import { Product } from '../../core/models/product.model';

// Icons
import { IconUserComponent } from '../../shared/components/icons/icon-user.component';
import { IconKeyComponent } from '../../shared/components/icons/icon-key.component';
import { IconBackOfficeComponent } from '../../shared/components/icons/icon-back-office.component';
import { IconLogoutComponent } from '../../shared/components/icons/icon-logout.component';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductGridComponent,
    CartPanelComponent,
    PaymentModalComponent,
    SuccessModalComponent,
    ReceiptPreviewModalComponent,
    RouterLink,
    IconUserComponent,
    IconKeyComponent,
    IconBackOfficeComponent,
    IconLogoutComponent
  ],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent implements OnInit, OnDestroy {
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
  isSuccessModalOpen = false;
  isReceiptPreviewOpen = false;
  lastSaleTicket = '';
  lastPaymentMethod = 'Cash';
  lastTransactionDate = new Date();

  // Header State
  currentDate = new Date();
  private dateInterval: any;
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

    this.dateInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 60000); // Update every minute
  }

  ngOnDestroy() {
    if (this.dateInterval) {
      clearInterval(this.dateInterval);
    }
  }

  loadUserProfile() {
    const claims = this.oauthService.getIdentityClaims() as UserProfile;
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
        this.lastSaleTicket = sale.saleNumber;
        this.lastPaymentMethod = method; // Store payment method
        this.lastTransactionDate = new Date(); // Store date
        this.closePaymentModal();
        // Do not clear cart immediately, wait for user to close success modal
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
    this.loadProducts(); // Refresh stock for the new sale
  }

  printReceipt() {
    // Legacy method, forwarding to preview
    this.openReceiptPreview();
  }

  openReceiptPreview() {
    this.isSuccessModalOpen = false; // Close success modal
    this.isReceiptPreviewOpen = true;  // Open preview modal
  }

  closeReceiptPreview() {
    this.isReceiptPreviewOpen = false;
  }
}
