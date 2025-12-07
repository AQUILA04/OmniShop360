output "realm_id" {
  description = "The ID of the created realm"
  value       = keycloak_realm.omnishop360.id
}

output "frontend_client_id" {
  description = "The client ID for the frontend application"
  value       = keycloak_openid_client.frontend.client_id
}

output "pos_client_id" {
  description = "The client ID for the POS application"
  value       = keycloak_openid_client.pos.client_id
}

output "backend_client_id" {
  description = "The client ID for the backend application"
  value       = keycloak_openid_client.backend.client_id
}

output "backend_client_secret" {
  description = "The client secret for the backend application"
  value       = keycloak_openid_client.backend.client_secret
  sensitive   = true
}

output "superadmin_user_id" {
  description = "The ID of the superadmin user"
  value       = keycloak_user.superadmin.id
}

output "roles" {
  description = "Created roles"
  value = {
    superadmin    = keycloak_role.superadmin.name
    tenant_admin  = keycloak_role.tenant_admin.name
    shop_admin    = keycloak_role.shop_admin.name
    stock_manager = keycloak_role.stock_manager.name
    cashier       = keycloak_role.cashier.name
    accountant    = keycloak_role.accountant.name
  }
}
