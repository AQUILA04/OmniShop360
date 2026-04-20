package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.PromotionCode;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record PromotionCodeResponse(
        UUID id,
        String code,
        PromotionCode.DiscountType discountType,
        BigDecimal discountValue,
        BigDecimal maxDiscountAmount,
        Boolean active,
        Boolean allowWithPriceLevel,
        LocalDateTime startsAt,
        LocalDateTime endsAt,
        UUID shopId
) {
    public static PromotionCodeResponse from(PromotionCode promotionCode) {
        return PromotionCodeResponse.builder()
                .id(promotionCode.getId())
                .code(promotionCode.getCode())
                .discountType(promotionCode.getDiscountType())
                .discountValue(promotionCode.getDiscountValue())
                .maxDiscountAmount(promotionCode.getMaxDiscountAmount())
                .active(promotionCode.getActive())
                .allowWithPriceLevel(promotionCode.getAllowWithPriceLevel())
                .startsAt(promotionCode.getStartsAt())
                .endsAt(promotionCode.getEndsAt())
                .shopId(promotionCode.getShop() != null ? promotionCode.getShop().getId() : null)
                .build();
    }
}
