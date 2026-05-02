export interface Sale {
  id: string;
  saleNumber: string;
  saleDate: string;
  shopId: string;
  shopName: string;
  customerId?: string;
  customerName?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'MOBILE' | 'MIXED';
  paymentStatus: 'PAID' | 'PENDING' | 'CANCELLED';
  status: 'COMPLETED' | 'CANCELLED' | 'RETURNED';
  notes?: string;
  createdAt: string;
  items: SaleItem[];
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string;
  variantName?: string;
  variantSku?: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountAmount: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export interface CheckoutRequest {
  customerId?: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  payments: {
    method: 'CASH' | 'CARD' | 'MOBILE' | 'CHECK' | 'CREDIT' | 'MIXED';
    amount: number;
    reference?: string;
    phoneNumber?: string;
    checkNumber?: string;
    ownerName?: string;
    customerNumber?: string;
  }[];
  promoCode?: string;
  discountAmount?: number;
  notes?: string;
}
