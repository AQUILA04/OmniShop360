package com.omnishop360.backend.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record OpenCashRegisterSessionRequest(
        @NotNull(message = "Opening float is required")
        @DecimalMin(value = "0.0000", message = "Opening float must be positive or zero")
        BigDecimal openingFloat
) {
}
