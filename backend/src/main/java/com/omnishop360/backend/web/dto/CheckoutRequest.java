package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Sale;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
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

        Sale.PaymentMethod paymentMethod,

        @Valid
        List<PaymentItem> payments,

        BigDecimal discountAmount,

        String promoCode,

        String voucherCode,

        String notes
) {
    @Builder
    public record CheckoutItem(
            @NotNull(message = "Product ID is required")
            UUID productId,

            UUID variantId,

            @NotNull(message = "Quantity is required")
            @DecimalMin(value = "0.0001", message = "Quantity must be greater than 0")
            BigDecimal quantity,
            PriceLevel priceLevel
    ) {
    }

    @Builder
    public record PaymentItem(
            @NotNull(message = "Payment method is required")
            SalePaymentMethod method,
            @NotNull(message = "Payment amount is required")
            @DecimalMin(value = "0.0001", message = "Payment amount must be greater than 0")
            BigDecimal amount,
            String reference
    ) {
    }

    public enum PriceLevel {
        BASE, LEVEL_1, LEVEL_2, LEVEL_3
    }

    public enum SalePaymentMethod {
        CASH, CARD, MOBILE, VOUCHER
    }
}
