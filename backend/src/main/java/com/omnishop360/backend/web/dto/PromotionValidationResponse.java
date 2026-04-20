package com.omnishop360.backend.web.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record PromotionValidationResponse(
        String code,
        BigDecimal discountAmount
) {
}
