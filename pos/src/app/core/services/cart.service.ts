import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string;
  variantName?: string;
  price: number;
  quantity: number;
  taxRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();
  
  private promoCodeDetails: { code: string, type: 'PERCENTAGE' | 'FIXED_AMOUNT', value: number } | null = null;

  addToCart(product: any, quantity: number = 1) {
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.itemsSubject.next([...currentItems]);
    } else {
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        price: product.price,
        quantity: quantity,
        taxRate: product.taxRate || 0
      };
      this.itemsSubject.next([...currentItems, newItem]);
    }
  }

  removeFromCart(productId: string) {
    const currentItems = this.itemsSubject.value;
    this.itemsSubject.next(currentItems.filter(item => item.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    const currentItems = this.itemsSubject.value;
    const item = currentItems.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.itemsSubject.next([...currentItems]);
      }
    }
  }

  clearCart() {
    this.itemsSubject.next([]);
    this.promoCodeDetails = null;
  }

  applyPromo(code: string, type: 'PERCENTAGE' | 'FIXED_AMOUNT', value: number) {
    this.promoCodeDetails = { code, type, value };
    // trigger recalculation if someone is listening to totalAmount, we can just push next to items
    this.itemsSubject.next([...this.itemsSubject.value]);
  }

  getPromoDetails() {
    return this.promoCodeDetails;
  }

  get rawSubtotal(): number {
    return this.itemsSubject.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  get discountAmount(): number {
    if (!this.promoCodeDetails) return 0;
    
    if (this.promoCodeDetails.type === 'FIXED_AMOUNT') {
      return this.promoCodeDetails.value;
    } else {
      // PERCENTAGE
      return this.rawSubtotal * (this.promoCodeDetails.value / 100);
    }
  }

  get totalAmount(): number {
    const total = this.rawSubtotal - this.discountAmount;
    return total > 0 ? total : 0;
  }

  get totalItems(): number {
      return this.itemsSubject.value.reduce((count, item) => count + item.quantity, 0);
  }
}
