CREATE TABLE users_aud (
    id UUID NOT NULL,
    rev INTEGER NOT NULL REFERENCES revision_info(id),
    revtype SMALLINT,
    tenant_id UUID,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    keycloak_id VARCHAR(255),
    active BOOLEAN,
    shop_id UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT,
    deleted BOOLEAN,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id, rev)
);

CREATE INDEX idx_users_aud_rev ON users_aud(rev);
