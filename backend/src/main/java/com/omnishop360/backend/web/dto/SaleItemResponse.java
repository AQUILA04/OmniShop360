package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.SaleItem;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record SaleItemResponse(
        UUID id,
        UUID productId,
        String productName,
        String productSku,
        UUID variantId,
        String variantName,
        String variantSku,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal taxRate,
        BigDecimal discountAmount,
        BigDecimal subtotal,
        BigDecimal taxAmount,
        BigDecimal totalAmount
) {
    public static SaleItemResponse from(SaleItem item) {
        return SaleItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productSku(item.getProduct().getSku())
                .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                .variantName(item.getVariant() != null ? item.getVariant().getName() : null)
                .variantSku(item.getVariant() != null ? item.getVariant().getSku() : null)
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .taxRate(item.getTaxRate())
                .discountAmount(item.getDiscountAmount())
                .subtotal(item.getSubtotal())
                .taxAmount(item.getTaxAmount())
                .totalAmount(item.getTotalAmount())
                .build();
    }
}
