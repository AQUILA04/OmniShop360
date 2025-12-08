terraform {
  required_version = ">= 1.0"
  
  required_providers {
    keycloak = {
      source  = "mrparkers/keycloak"
      version = "~> 4.4"
    }
  }
}

provider "keycloak" {
  client_id     = "admin-cli"
  username      = var.keycloak_admin_username
  password      = var.keycloak_admin_password
  url           = var.keycloak_url
  initial_login = false
}

# Create OmniShop360 Realm
resource "keycloak_realm" "omnishop360" {
  realm             = "omnishop360"
  enabled           = true
  display_name      = "OmniShop 360"
  display_name_html = "<b>OmniShop</b> 360"

  # Only use login_theme since that's the only sub-theme we have
  # Account and email themes will use Keycloak defaults
  login_theme   = "omnishop360"
  #account_theme = "omnishop360"
  #email_theme   = "omnishop360"
  # account_theme and email_theme omitted - will use default "keycloak" theme

  # Security settings
  ssl_required                   = "external"
  password_policy                = "length(8) and digits(1) and lowerCase(1) and upperCase(1) and specialChars(1)"
  registration_allowed           = false
  registration_email_as_username = true
  edit_username_allowed          = false
  reset_password_allowed         = true
  remember_me                    = true
  verify_email                   = true
  login_with_email_allowed       = true
  duplicate_emails_allowed       = false

  # Token settings
  access_token_lifespan                 = "5m"
  access_token_lifespan_for_implicit_flow = "15m"
  sso_session_idle_timeout              = "30m"
  sso_session_max_lifespan              = "10h"
  offline_session_idle_timeout          = "720h"
  offline_session_max_lifespan          = "1440h"
  access_code_lifespan                  = "1m"
  access_code_lifespan_login            = "30m"
  access_code_lifespan_user_action      = "5m"

  # SMTP settings (optional, configure via variables)
  smtp_server {
    host              = var.smtp_host
    port              = var.smtp_port
    from              = var.smtp_from
    from_display_name = "OmniShop 360"
    
    # Correction: Utilisation de 'dynamic' pour éviter le plantage lorsque les identifiants SMTP sont vides
    dynamic "auth" {
      for_each = var.smtp_username != "" ? [1] : []
      content {
        username = var.smtp_username
        password = var.smtp_password
      }
    }
    
    ssl       = var.smtp_ssl
    starttls  = var.smtp_starttls
  }

  internationalization {
    supported_locales = [
      "en",
      "fr",
      "es"
    ]
    default_locale = "fr"
  }
}

# Create Roles
resource "keycloak_role" "superadmin" {
  realm_id    = keycloak_realm.omnishop360.id
  name        = "superadmin"
  description = "Super Administrator - Full platform access"
}

resource "keycloak_role" "tenant_admin" {
  realm_id    = keycloak_realm.omnishop360.id
  name        = "tenant_admin"
  description = "Tenant Administrator - Manage tenant and shops"
}

resource "keycloak_role" "shop_admin" {
  realm_id    = keycloak_realm.omnishop360.id
  name        = "shop_admin"
  description = "Shop Administrator - Manage shop operations"
}

resource "keycloak_role" "stock_manager" {
  realm_id    = keycloak_realm.omnishop360.id
  name        = "stock_manager"
  description = "Stock Manager - Manage inventory"
}

resource "keycloak_role" "cashier" {
  realm_id    = keycloak_realm.omnishop360.id
  name        = "cashier"
  description = "Cashier - POS operations"
}

resource "keycloak_role" "accountant" {
  realm_id    = keycloak_realm.omnishop360.id
  name        = "accountant"
  description = "Accountant - Financial reports access"
}

# Create Frontend Client
resource "keycloak_openid_client" "frontend" {
  realm_id  = keycloak_realm.omnishop360.id
  client_id = "omnishop-frontend"
  name      = "OmniShop Frontend"
  enabled   = true

  access_type           = "PUBLIC" # Corrigé: était "public"
  standard_flow_enabled = true
  implicit_flow_enabled = false
  direct_access_grants_enabled = false

  valid_redirect_uris = [
    "http://localhost:4200/*",
    "https://*.omnishop360.com/*",
    var.frontend_url != "" ? "${var.frontend_url}/*" : ""
  ]

  web_origins = [
    "http://localhost:4200",
    "https://*.omnishop360.com",
    var.frontend_url != "" ? var.frontend_url : ""
  ]

  login_theme = "omnishop360"
}

# Create POS Client
resource "keycloak_openid_client" "pos" {
  realm_id  = keycloak_realm.omnishop360.id
  client_id = "omnishop-pos"
  name      = "OmniShop POS"
  enabled   = true

  access_type           = "PUBLIC" # Corrigé: était "public"
  standard_flow_enabled = true
  implicit_flow_enabled = false
  direct_access_grants_enabled = false

  valid_redirect_uris = [
    "http://localhost:4201/*",
    "https://*.omnishop360.com/*",
    var.pos_url != "" ? "${var.pos_url}/*" : ""
  ]

  web_origins = [
    "http://localhost:4201",
    "https://*.omnishop360.com",
    var.pos_url != "" ? var.pos_url : ""
  ]

  login_theme = "omnishop360"
}

# Create Backend Client (Confidential)
resource "keycloak_openid_client" "backend" {
  realm_id  = keycloak_realm.omnishop360.id
  client_id = "omnishop-backend"
  name      = "OmniShop Backend"
  enabled   = true

  access_type                  = "CONFIDENTIAL"
  service_accounts_enabled     = true
  standard_flow_enabled        = false
  direct_access_grants_enabled = true

  # valid_redirect_uris cannot be set when standard_flow_enabled is false
  # Only needed for standard/implicit flows
}

# Get the realm-management client (system client for admin operations)
data "keycloak_openid_client" "realm_management" {
  realm_id  = keycloak_realm.omnishop360.id
  client_id = "realm-management"
}

# Assign manage-users client role to backend service account
resource "keycloak_openid_client_service_account_role" "backend_manage_users" {
  realm_id                = keycloak_realm.omnishop360.id
  service_account_user_id = keycloak_openid_client.backend.service_account_user_id
  client_id               = data.keycloak_openid_client.realm_management.id
  role                    = "manage-users"
}

# Assign view-users client role to backend service account
resource "keycloak_openid_client_service_account_role" "backend_view_users" {
  realm_id                = keycloak_realm.omnishop360.id
  service_account_user_id = keycloak_openid_client.backend.service_account_user_id
  client_id               = data.keycloak_openid_client.realm_management.id
  role                    = "view-users"
}

# Add tenant_id mapper to tokens
resource "keycloak_openid_user_attribute_protocol_mapper" "tenant_id_mapper" {
  realm_id  = keycloak_realm.omnishop360.id
  client_id = keycloak_openid_client.frontend.id
  name      = "tenant-id-mapper"

  user_attribute   = "tenant_id"
  claim_name       = "tenant_id"
  claim_value_type = "String"

  add_to_id_token     = true
  add_to_access_token = true
  add_to_userinfo     = true
}

# Add shop_id mapper to tokens
resource "keycloak_openid_user_attribute_protocol_mapper" "shop_id_mapper" {
  realm_id  = keycloak_realm.omnishop360.id
  client_id = keycloak_openid_client.frontend.id
  name      = "shop-id-mapper"

  user_attribute   = "shop_id"
  claim_name       = "shop_id"
  claim_value_type = "String"

  add_to_id_token     = true
  add_to_access_token = true
  add_to_userinfo     = true
}

# Create Superadmin User
resource "keycloak_user" "superadmin" {
  realm_id = keycloak_realm.omnishop360.id
  username = var.superadmin_username
  enabled  = true

  email          = var.superadmin_email
  email_verified = true
  first_name     = "Super"
  last_name      = "Admin"

  initial_password {
    value    = var.superadmin_initial_password
    temporary = true
  }
}

# Assign superadmin role
resource "keycloak_user_roles" "superadmin_roles" {
  realm_id = keycloak_realm.omnishop360.id
  user_id  = keycloak_user.superadmin.id

  role_ids = [
    keycloak_role.superadmin.id
  ]
}
