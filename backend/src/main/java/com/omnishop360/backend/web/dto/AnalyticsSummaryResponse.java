package com.omnishop360.backend.web.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record AnalyticsSummaryResponse(
        BigDecimal totalRevenue,
        long transactionCount,
        BigDecimal averageBasket,
        LocalDate periodFrom,
        LocalDate periodTo,
        List<SalesEvolutionEntry> salesEvolution,
        List<TopProductEntry> topProducts
) {
}
