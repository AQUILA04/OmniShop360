export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  tenantId?: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  keycloakId?: string;
  active?: boolean;
  tenantId?: string;
  shopId?: string;
  createdAt?: string;
}
