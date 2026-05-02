package com.omnishop360.backend.web.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record StockSearchDto(
        UUID shopId,
        UUID productId,
        UUID variantId,
        String keyword,
        String productCode,
        String productName,
        UUID categoryId,
        Boolean lowStock
) {
}
