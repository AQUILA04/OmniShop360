package com.omnishop360.backend.web.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record StockMovementRequest(
        @NotNull(message = "Product ID is required")
        UUID productId,
        
        UUID variantId,
        
        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be positive")
        BigDecimal quantity,
        
        BigDecimal unitCost,
        
        String notes
) {
}
