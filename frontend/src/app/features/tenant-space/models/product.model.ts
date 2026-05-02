export interface ProductVariant {
    id?: string;
    sku: string;
    size?: string;
    color?: string;
    additionalInfo?: string;
    stock?: number;
}

export interface Product {
    id: string;
    tenantId: string;
    name: string;
    sku: string;
    description?: string;
    category: string;
    imageUrl?: string;

    // Pricing
    purchasePrice?: number; // Restricted (Tenant Admin only)
    salePrice: number;

    hasVariants: boolean;
    variants?: ProductVariant[];

    createdAt?: string;
    updatedAt?: string;
}
