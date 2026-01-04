package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Product;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private UUID id;
    private String name;
    private String sku;
    private String description;
    private UUID categoryId;
    private String categoryName;
    private String barcode;
    private String unit;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private BigDecimal taxRate;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProductVariantResponse> variants;

    public static ProductResponse from(Product product) {
        if (product == null) {
            return null;
        }

        ProductResponse.ProductResponseBuilder builder = ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .sku(product.getSku())
                .description(product.getDescription())
                .barcode(product.getBarcode())
                .unit(product.getUnit())
                .sellingPrice(product.getSellingPrice())
                .taxRate(product.getTaxRate())
                .active(product.getActive())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt());

        if (product.getCategory() != null) {
            builder.categoryId(product.getCategory().getId())
                   .categoryName(product.getCategory().getName());
        }

        if (SecurityUtils.isTenantAdmin()) {
            builder.costPrice(product.getCostPrice());
        } else {
            builder.costPrice(null);
        }

        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            builder.variants(product.getVariants().stream()
                    .map(ProductVariantResponse::from)
                    .collect(Collectors.toList()));
        } else {
            builder.variants(new ArrayList<>());
        }

        return builder.build();
    }
}

