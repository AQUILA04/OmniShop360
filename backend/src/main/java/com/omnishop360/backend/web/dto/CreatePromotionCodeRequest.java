package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.PromotionCode;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record CreatePromotionCodeRequest(
        String code,
        @NotNull(message = "Discount type is required")
        PromotionCode.DiscountType discountType,
        @NotNull(message = "Discount value is required")
        @DecimalMin(value = "0.0001", message = "Discount value must be greater than 0")
        BigDecimal discountValue,
        @DecimalMin(value = "0.0001", message = "Max discount amount must be greater than 0")
        BigDecimal maxDiscountAmount,
        LocalDateTime startsAt,
        LocalDateTime endsAt,
        Boolean allowWithPriceLevel,
        Boolean active,
        UUID shopId
) {
}
