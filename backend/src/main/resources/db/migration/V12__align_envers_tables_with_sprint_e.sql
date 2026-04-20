ALTER TABLE products_aud
    ADD COLUMN IF NOT EXISTS price_level_1 DECIMAL(19, 4),
    ADD COLUMN IF NOT EXISTS price_level_2 DECIMAL(19, 4),
    ADD COLUMN IF NOT EXISTS price_level_3 DECIMAL(19, 4);

ALTER TABLE sales_aud
    ADD COLUMN IF NOT EXISTS cash_register_session_id UUID,
    ADD COLUMN IF NOT EXISTS promo_code VARCHAR(100),
    ADD COLUMN IF NOT EXISTS promo_discount_amount DECIMAL(19, 4),
    ADD COLUMN IF NOT EXISTS voucher_code VARCHAR(100),
    ADD COLUMN IF NOT EXISTS voucher_amount DECIMAL(19, 4);
