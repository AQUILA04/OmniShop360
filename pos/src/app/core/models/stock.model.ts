export interface StockResponse {
    id: string;
    productId: string;
    productName: string;
    productSku: string;
    variantId?: string;
    variantName?: string;
    variantSku?: string;
    quantity: number;
    availableQuantity: number;
    minStockLevel: number;
    maxStockLevel: number;
    lowStock: boolean;
    sellingPrice: number;
}

export interface StockSearchDto {
    keyword?: string;
}
