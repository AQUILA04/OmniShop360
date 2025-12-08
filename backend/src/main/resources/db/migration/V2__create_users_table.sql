-- ============================================
-- OmniShop360 - Create Users Table and Add Status Column to Tenants
-- Version: 2.0
-- Description: Create users table and add status column to tenants table
-- ============================================

-- Add status column to tenants table (derived from active and deleted)
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS status VARCHAR(50);

-- Update status based on active and deleted columns
UPDATE tenants SET status = 
    CASE 
        WHEN deleted = true THEN 'DELETED'
        WHEN active = true THEN 'ACTIVE'
        ELSE 'SUSPENDED'
    END
WHERE status IS NULL;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    keycloak_id VARCHAR(255) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMP,
    CONSTRAINT uk_user_email_tenant UNIQUE (tenant_id, email)
);

CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_keycloak_id ON users(keycloak_id);
CREATE INDEX idx_users_active ON users(active);
CREATE INDEX idx_users_deleted ON users(deleted);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE tenants 
ALTER COLUMN name TYPE VARCHAR(255) 
USING name::text;

