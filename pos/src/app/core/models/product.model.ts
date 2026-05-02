export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    category: string;
    taxRate: number;
    imageUrl?: string;
    stockLevel?: number;
}
