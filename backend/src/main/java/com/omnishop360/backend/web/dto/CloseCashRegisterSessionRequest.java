package com.omnishop360.backend.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record CloseCashRegisterSessionRequest(
        @NotNull(message = "Counted cash amount is required")
        @DecimalMin(value = "0.0000", message = "Counted cash amount must be positive or zero")
        BigDecimal countedCashAmount,
        UUID customerIdForRemainder
) {
}
