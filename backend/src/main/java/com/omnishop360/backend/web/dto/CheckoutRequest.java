package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Sale;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Builder
public record CheckoutRequest(
        UUID customerId,
        
        @NotEmpty(message = "Items are required")
        @Valid
        List<CheckoutItem> items,
        
        @NotNull(message = "Payment method is required")
        Sale.PaymentMethod paymentMethod,
        
        BigDecimal discountAmount,
        
        String notes
) {
    @Builder
    public record CheckoutItem(
            @NotNull(message = "Product ID is required")
            UUID productId,
            
            UUID variantId,
            
            @NotNull(message = "Quantity is required")
            BigDecimal quantity
    ) {
    }
}
