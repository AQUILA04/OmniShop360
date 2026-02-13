export interface InventoryResponse {
  id: string;
  tenantId: string;
  shopId: string;
  productId: string;
  variantId?: string;
  productName: string;
  productSku: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  lastRestockDate?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  version: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  availableQuantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  lastRestockDate?: string;
}