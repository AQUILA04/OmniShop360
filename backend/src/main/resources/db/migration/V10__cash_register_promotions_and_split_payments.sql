ALTER TABLE shops
    ADD COLUMN IF NOT EXISTS allow_sale_without_stock BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS price_level_1 DECIMAL(19, 4),
    ADD COLUMN IF NOT EXISTS price_level_2 DECIMAL(19, 4),
    ADD COLUMN IF NOT EXISTS price_level_3 DECIMAL(19, 4);

CREATE TABLE IF NOT EXISTS cash_register_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    opened_by VARCHAR(255) NOT NULL,
    opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    opening_float DECIMAL(19, 4) NOT NULL,
    closed_by VARCHAR(255),
    closed_at TIMESTAMP,
    expected_cash_amount DECIMAL(19, 4),
    counted_cash_amount DECIMAL(19, 4),
    remainder_amount DECIMAL(19, 4),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cash_register_sessions_tenant_shop ON cash_register_sessions(tenant_id, shop_id);
CREATE INDEX IF NOT EXISTS idx_cash_register_sessions_status ON cash_register_sessions(status);

CREATE TABLE IF NOT EXISTS voucher_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    source_session_id UUID REFERENCES cash_register_sessions(id) ON DELETE SET NULL,
    redeemed_sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
    code VARCHAR(100) NOT NULL,
    original_amount DECIMAL(19, 4) NOT NULL,
    remaining_amount DECIMAL(19, 4) NOT NULL,
    issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    redeemed_at TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_voucher_code_tenant UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_voucher_codes_tenant_status ON voucher_codes(tenant_id, status);

CREATE TABLE IF NOT EXISTS promotion_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL,
    discount_type VARCHAR(50) NOT NULL,
    discount_value DECIMAL(19, 4) NOT NULL,
    max_discount_amount DECIMAL(19, 4),
    active BOOLEAN NOT NULL DEFAULT true,
    starts_at TIMESTAMP,
    ends_at TIMESTAMP,
    allow_with_price_level BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_promo_code_tenant UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_promotion_codes_tenant_active ON promotion_codes(tenant_id, active);

ALTER TABLE sales
    ADD COLUMN IF NOT EXISTS cash_register_session_id UUID REFERENCES cash_register_sessions(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS promo_code VARCHAR(100),
    ADD COLUMN IF NOT EXISTS promo_discount_amount DECIMAL(19, 4) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS voucher_code VARCHAR(100),
    ADD COLUMN IF NOT EXISTS voucher_amount DECIMAL(19, 4) NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_sales_cash_register_session_id ON sales(cash_register_session_id);

CREATE TABLE IF NOT EXISTS sale_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    method VARCHAR(50) NOT NULL,
    amount DECIMAL(19, 4) NOT NULL,
    reference VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sale_payments_sale_id ON sale_payments(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_payments_tenant_method ON sale_payments(tenant_id, method);
