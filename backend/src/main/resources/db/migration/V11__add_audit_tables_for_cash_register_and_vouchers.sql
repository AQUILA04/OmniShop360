CREATE TABLE IF NOT EXISTS cash_register_sessions_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL REFERENCES revision_info(id),
    revtype SMALLINT,
    tenant_id UUID,
    shop_id UUID,
    opened_by VARCHAR(255),
    opened_at TIMESTAMP,
    opening_float DECIMAL(19, 4),
    closed_by VARCHAR(255),
    closed_at TIMESTAMP,
    expected_cash_amount DECIMAL(19, 4),
    counted_cash_amount DECIMAL(19, 4),
    remainder_amount DECIMAL(19, 4),
    status VARCHAR(50),
    version BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (id, rev)
);

CREATE TABLE IF NOT EXISTS voucher_codes_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL REFERENCES revision_info(id),
    revtype SMALLINT,
    tenant_id UUID,
    shop_id UUID,
    customer_id UUID,
    source_session_id UUID,
    redeemed_sale_id UUID,
    code VARCHAR(100),
    original_amount DECIMAL(19, 4),
    remaining_amount DECIMAL(19, 4),
    issued_at TIMESTAMP,
    redeemed_at TIMESTAMP,
    status VARCHAR(50),
    version BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (id, rev)
);

CREATE TABLE IF NOT EXISTS sale_payments_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL REFERENCES revision_info(id),
    revtype SMALLINT,
    sale_id UUID,
    tenant_id UUID,
    method VARCHAR(50),
    amount DECIMAL(19, 4),
    reference VARCHAR(255),
    created_at TIMESTAMP,
    PRIMARY KEY (id, rev)
);

CREATE INDEX IF NOT EXISTS idx_cash_register_sessions_aud_rev ON cash_register_sessions_aud(rev);
CREATE INDEX IF NOT EXISTS idx_voucher_codes_aud_rev ON voucher_codes_aud(rev);
CREATE INDEX IF NOT EXISTS idx_sale_payments_aud_rev ON sale_payments_aud(rev);
