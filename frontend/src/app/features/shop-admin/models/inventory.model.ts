export interface InventoryResponse {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string;
  variantName?: string;
  variantSku?: string;
  quantity: number;
  availableQuantity: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  lowStock: boolean;
}
