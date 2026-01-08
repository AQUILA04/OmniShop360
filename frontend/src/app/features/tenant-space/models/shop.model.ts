export interface Shop {
    id: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    active: boolean;
    userCount?: number;
    tenantId: string;
    createdAt?: string;
    updatedAt?: string;
}
