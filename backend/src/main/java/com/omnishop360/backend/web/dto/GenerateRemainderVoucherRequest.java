package com.omnishop360.backend.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record GenerateRemainderVoucherRequest(
        @NotNull(message = "Cash register session ID is required")
        UUID cashRegisterSessionId,
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.0001", message = "Amount must be greater than 0")
        BigDecimal amount,
        UUID customerId
) {
}
