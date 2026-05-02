export interface StockMovementRequest {
  productId: string;
  variantId?: string;
  shopId: string;
  movementType: 'RECEIPT' | 'SALE' | 'ADJUSTMENT' | 'RETURN' | 'TRANSFER';
  quantity: number;
  unitCost?: number;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
}

export interface StockMovementResponse {
  id: string;
  tenantId: string;
  shopId: string;
  productId: string;
  variantId?: string;
  movementType: 'RECEIPT' | 'SALE' | 'ADJUSTMENT' | 'RETURN' | 'TRANSFER';
  quantity: number;
  unitCost?: number;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
  movementDate: string; // ISO date string
  createdAt: string; // ISO date string
  createdBy?: string;
}

export interface CreateStockMovementRequest {
  productId: string;
  variantId?: string;
  shopId: string;
  movementType: 'RECEIPT' | 'SALE' | 'ADJUSTMENT' | 'RETURN' | 'TRANSFER';
  quantity: number;
  unitCost?: number;
  notes?: string;
}