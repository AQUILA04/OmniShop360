CREATE TABLE revision_info (
    id SERIAL PRIMARY KEY,
    revtstmp BIGINT,
    user_id VARCHAR(255),
    tenant_id UUID
);

CREATE TABLE stock_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL REFERENCES revision_info(id),
    revtype SMALLINT,
    tenant_id UUID,
    shop_id UUID,
    product_id UUID,
    variant_id UUID,
    quantity DECIMAL(19, 4),
    reserved_quantity DECIMAL(19, 4),
    min_stock_level DECIMAL(19, 4),
    max_stock_level DECIMAL(19, 4),
    last_restock_date TIMESTAMP,
    version BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (id, rev)
);

CREATE TABLE sales_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL REFERENCES revision_info(id),
    revtype SMALLINT,
    tenant_id UUID,
    shop_id UUID,
    customer_id UUID,
    sale_number VARCHAR(100),
    sale_date TIMESTAMP,
    subtotal DECIMAL(19, 4),
    tax_amount DECIMAL(19, 4),
    discount_amount DECIMAL(19, 4),
    total_amount DECIMAL(19, 4),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT,
    PRIMARY KEY (id, rev)
);

CREATE TABLE products_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL REFERENCES revision_info(id),
    revtype SMALLINT,
    tenant_id UUID,
    category_id UUID,
    sku VARCHAR(100),
    name VARCHAR(255),
    description TEXT,
    barcode VARCHAR(100),
    unit VARCHAR(50),
    cost_price DECIMAL(19, 4),
    selling_price DECIMAL(19, 4),
    tax_rate DECIMAL(5, 2),
    active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT,
    deleted BOOLEAN,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id, rev)
);

CREATE INDEX idx_stock_aud_rev ON stock_aud(rev);
CREATE INDEX idx_sales_aud_rev ON sales_aud(rev);
CREATE INDEX idx_products_aud_rev ON products_aud(rev);
CREATE INDEX idx_revision_info_tenant_id ON revision_info(tenant_id);
CREATE INDEX idx_revision_info_revtstmp ON revision_info(revtstmp);
