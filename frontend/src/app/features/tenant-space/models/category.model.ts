export interface Category {
    id: string; // UUID
    name: string;
    code: string; // Added code
    description?: string;
    tenantId: string;
}

export interface CreateCategoryRequest {
    name: string;
    code: string; // Added code
    description?: string;
}

export interface CategoryResponse {
    id: string;
    name: string;
    code: string; // Added code
    description: string;
    tenantId: string;
}
