-- ============================================
-- OmniShop360 - Add missing columns to product_variants
-- Version: 4.0
-- Description: Add created_by and updated_by columns to product_variants table
-- ============================================

ALTER TABLE product_variants 
ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

