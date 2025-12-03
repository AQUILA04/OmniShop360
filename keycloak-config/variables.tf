variable "keycloak_url" {
  description = "Keycloak server URL"
  type        = string
  default     = "http://localhost:8080"
}

variable "keycloak_admin_username" {
  description = "Keycloak admin username"
  type        = string
  default     = "admin"
}

variable "keycloak_admin_password" {
  description = "Keycloak admin password"
  type        = string
  sensitive   = true
}

variable "superadmin_username" {
  description = "Superadmin username"
  type        = string
  default     = "superadmin"
}

variable "superadmin_email" {
  description = "Superadmin email"
  type        = string
}

variable "superadmin_initial_password" {
  description = "Superadmin initial password (will be required to change on first login)"
  type        = string
  sensitive   = true
}

variable "frontend_url" {
  description = "Frontend application URL"
  type        = string
  default     = ""
}

variable "pos_url" {
  description = "POS application URL"
  type        = string
  default     = ""
}

variable "backend_url" {
  description = "Backend API URL"
  type        = string
  default     = ""
}

variable "smtp_host" {
  description = "SMTP server host"
  type        = string
  default     = ""
}

variable "smtp_port" {
  description = "SMTP server port"
  type        = string
  default     = "587"
}

variable "smtp_from" {
  description = "SMTP from email address"
  type        = string
  default     = "noreply@omnishop360.com"
}

variable "smtp_username" {
  description = "SMTP username"
  type        = string
  default     = ""
}

variable "smtp_password" {
  description = "SMTP password"
  type        = string
  sensitive   = true
  default     = ""
}

variable "smtp_ssl" {
  description = "Enable SSL for SMTP"
  type        = bool
  default     = false
}

variable "smtp_starttls" {
  description = "Enable STARTTLS for SMTP"
  type        = bool
  default     = true
}
