import { UserResponse } from '../../../shared/models/user.model';

export interface TenantResponse {
  id: string;
  companyName: string;
  contactEmail: string;
  status: TenantStatus;
  createdAt: string;
  updatedAt?: string;
  admin?: UserResponse;
  adminCount?: number;
  shopCount?: number;
}

export interface CreateTenantRequest {
  companyName: string;
  contactEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

export interface TenantQueryParams {
  page: number;
  size: number;
  sort: string;
  search?: string;
}
