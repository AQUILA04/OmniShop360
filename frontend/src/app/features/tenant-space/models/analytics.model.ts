export interface AnalyticsSummaryResponse {
    totalRevenue: number;
    transactionCount: number;
    averageBasket: number;
    periodFrom: string;
    periodTo: string;
    salesEvolution: SalesEvolutionEntry[];
    topProducts: TopProductEntry[];
}

export interface SalesEvolutionEntry {
    day: string;
    totalAmount: number;
    transactionCount: number;
}

export interface TopProductEntry {
    productId: string;
    productName: string;
    sku: string;
    quantitySold: number;
    totalAmount: number;
}

export type ExportFormat = 'PDF' | 'EXCEL';
