-- ============================================
-- OmniShop360 - Add shop_id to users table
-- Version: 3.0
-- Description: Add shop_id column to users table for shop admin assignment
-- ============================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES shops(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_shop_id ON users(shop_id);

