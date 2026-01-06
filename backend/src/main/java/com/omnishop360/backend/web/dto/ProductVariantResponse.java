package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.ProductVariant;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {

    private UUID id;
    private String sku;
    private String name;
    private String barcode;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProductVariantResponse from(ProductVariant variant) {
        if (variant == null) {
            return null;
        }

        ProductVariantResponse.ProductVariantResponseBuilder builder = ProductVariantResponse.builder()
                .id(variant.getId())
                .sku(variant.getSku())
                .name(variant.getName())
                .barcode(variant.getBarcode())
                .sellingPrice(variant.getSellingPrice())
                .active(variant.getActive())
                .createdAt(variant.getCreatedAt())
                .updatedAt(variant.getUpdatedAt());

        if (SecurityUtils.isTenantAdmin()) {
            builder.costPrice(variant.getCostPrice());
        } else {
            builder.costPrice(null);
        }

        return builder.build();
    }
}

