package com.omnishop360.backend.web.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record TopProductEntry(
        UUID productId,
        String productName,
        String sku,
        BigDecimal quantitySold,
        BigDecimal totalAmount
) {
}
