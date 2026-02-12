import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../core/services/cart.service';
import { SaleService } from '../../core/services/sale.service';
import { CustomerService } from '../../core/services/customer.service';
import { FormsModule } from '@angular/forms';
import { CheckoutRequest } from '../../core/models/sale.model';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount = 0;
  products: any[] = []; // Placeholder for products
  searchTerm = '';
  selectedCustomerId: string | null = null;

  constructor(
    private cartService: CartService,
    private saleService: SaleService,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.cartService.totalAmount;
    });

    // Mock products for now
    this.products = [
        { id: '1', name: 'Produit A', sku: 'SKU001', price: 10.0, taxRate: 20 },
        { id: '2', name: 'Produit B', sku: 'SKU002', price: 20.0, taxRate: 20 },
        { id: '3', name: 'Produit C', sku: 'SKU003', price: 15.5, taxRate: 5.5 },
    ];
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  checkout() {
    if (this.cartItems.length === 0) return;

    const request: CheckoutRequest = {
      customerId: this.selectedCustomerId || undefined,
      items: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      paymentMethod: 'CASH', // Default for now
      notes: 'Vente POS'
    };

    this.saleService.checkout(request).subscribe({
      next: (sale) => {
        console.log('Sale completed', sale);
        this.clearCart();
        alert('Vente validée !');
      },
      error: (err) => {
        console.error('Checkout failed', err);
        alert('Erreur lors de la vente');
      }
    });
  }
}
