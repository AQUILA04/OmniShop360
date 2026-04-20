ALTER TABLE promotion_codes
    ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES shops(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_promotion_codes_shop_id ON promotion_codes(shop_id);
