package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Stock;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

@Builder
public record StockResponse(
        UUID id,
        UUID productId,
        String productName,
        String productSku,
        UUID variantId,
        String variantName,
        String variantSku,
        BigDecimal quantity,
        BigDecimal availableQuantity,
        BigDecimal minStockLevel,
        BigDecimal maxStockLevel,
        boolean lowStock,
        BigDecimal sellingPrice
) {
    public static StockResponse from(Stock stock) {
        if (Objects.isNull(stock)) {
            return null;
        }

        boolean lowStock = stock.getMinStockLevel() != null 
                && stock.getAvailableQuantity() != null 
                && stock.getAvailableQuantity().compareTo(stock.getMinStockLevel()) < 0;
        
        BigDecimal sellingPrice = null;
        if (stock.getVariant() != null && stock.getVariant().getSellingPrice() != null) {
            sellingPrice = stock.getVariant().getSellingPrice();
        } else if (stock.getProduct() != null && stock.getProduct().getSellingPrice() != null) {
            sellingPrice = stock.getProduct().getSellingPrice();
        }
        return StockResponse.builder()
                .id(stock.getId())
                .productId(stock.getProduct().getId())
                .productName(stock.getProduct().getName())
                .productSku(stock.getProduct().getSku())
                .variantId(stock.getVariant() != null ? stock.getVariant().getId() : null)
                .variantName(stock.getVariant() != null ? stock.getVariant().getName() : null)
                .variantSku(stock.getVariant() != null ? stock.getVariant().getSku() : null)
                .quantity(stock.getQuantity())
                .availableQuantity(stock.getAvailableQuantity())
                .minStockLevel(stock.getMinStockLevel())
                .maxStockLevel(stock.getMaxStockLevel())
                .lowStock(lowStock)
                .sellingPrice(sellingPrice)
                .build();
    }
}
