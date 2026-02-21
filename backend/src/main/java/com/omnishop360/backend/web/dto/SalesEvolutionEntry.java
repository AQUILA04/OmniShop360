package com.omnishop360.backend.web.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SalesEvolutionEntry(
        LocalDate day,
        BigDecimal totalAmount,
        long transactionCount
) {
}
