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
  }

  get totalAmount(): number {
    return this.itemsSubject.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  get totalItems(): number {
      return this.itemsSubject.value.reduce((count, item) => count + item.quantity, 0);
  }
}
