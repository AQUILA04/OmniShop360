package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.repository.SaleRepository;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.AnalyticsSummaryResponse;
import com.omnishop360.backend.web.dto.SalesEvolutionEntry;
import com.omnishop360.backend.web.dto.TopProductEntry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private static final int TOP_PRODUCTS_LIMIT = 5;

    private final SaleRepository saleRepository;
    private final UserContextService userContextService;

    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse getSummary(
            Optional<UUID> shopIdParam,
            LocalDate fromDate,
            LocalDate toDate) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = resolveShopId(shopIdParam);
        LocalDateTime from = fromDate != null ? fromDate.atStartOfDay() : LocalDate.now().atStartOfDay();
        LocalDateTime to = (toDate != null ? toDate : LocalDate.now()).plusDays(1).atStartOfDay();

        Object[] summaryRow = saleRepository.findSummaryByTenantAndShopAndDateRange(tenantId, shopId, from, to);
        BigDecimal totalRevenue = toBigDecimal(summaryRow != null && summaryRow.length > 0 ? summaryRow[0] : null);
        long transactionCount = toLong(summaryRow != null && summaryRow.length > 1 ? summaryRow[1] : null);
        BigDecimal averageBasket = transactionCount > 0
                ? totalRevenue.divide(BigDecimal.valueOf(transactionCount), 4, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        List<Object[]> dailyRows = saleRepository.findDailyRevenueByTenantAndShopAndDateRange(tenantId, shopId, from, to);
        List<SalesEvolutionEntry> salesEvolution = mapDailyRows(dailyRows);

        List<Object[]> topRows = saleRepository.findTopProductsByTenantAndShopAndDateRange(
                tenantId, shopId, from, to, PageRequest.of(0, TOP_PRODUCTS_LIMIT));
        List<TopProductEntry> topProducts = mapTopProductRows(topRows);

        return new AnalyticsSummaryResponse(
                totalRevenue,
                transactionCount,
                averageBasket,
                fromDate != null ? fromDate : LocalDate.now(),
                toDate != null ? toDate : LocalDate.now(),
                salesEvolution,
                topProducts);
    }

    private UUID resolveShopId(Optional<UUID> shopIdParam) {
        if (SecurityUtils.hasRole("shop_admin")) {
            return userContextService.getCurrentUserShopId()
                    .orElseThrow(() -> new IllegalArgumentException("Shop Admin must be associated with a shop"));
        }
        return shopIdParam.orElse(null);
    }

    private List<SalesEvolutionEntry> mapDailyRows(List<Object[]> rows) {
        List<SalesEvolutionEntry> result = new ArrayList<>();
        for (Object[] row : rows) {
            LocalDate day = toLocalDate(row.length > 0 ? row[0] : null);
            if (day == null) {
                continue;
            }
            BigDecimal totalAmount = toBigDecimal(row.length > 1 ? row[1] : null);
            long count = toLong(row.length > 2 ? row[2] : null);
            result.add(new SalesEvolutionEntry(day, totalAmount, count));
        }
        return result;
    }

    private LocalDate toLocalDate(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof LocalDate ld) {
            return ld;
        }
        if (value instanceof java.sql.Date sqlDate) {
            return sqlDate.toLocalDate();
        }
        if (value instanceof java.util.Date utilDate) {
            return new java.sql.Timestamp(utilDate.getTime()).toLocalDateTime().toLocalDate();
        }
        throw new IllegalArgumentException("Cannot convert to LocalDate: " + value.getClass());
    }

    private List<TopProductEntry> mapTopProductRows(List<Object[]> rows) {
        List<TopProductEntry> result = new ArrayList<>();
        for (Object[] row : rows) {
            UUID productId = (UUID) row[0];
            String name = row[1] != null ? (String) row[1] : "";
            String sku = row[2] != null ? (String) row[2] : "";
            BigDecimal quantitySold = toBigDecimal(row.length > 3 ? row[3] : null);
            BigDecimal totalAmount = toBigDecimal(row.length > 4 ? row[4] : null);
            result.add(new TopProductEntry(productId, name, sku, quantitySold, totalAmount));
        }
        return result;
    }

    private static BigDecimal toBigDecimal(Object value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        if (value instanceof Object[] arr && arr.length > 0) {
            return toBigDecimal(arr[0]);
        }
        if (value instanceof BigDecimal bd) {
            return bd;
        }
        if (value instanceof Number n) {
            return BigDecimal.valueOf(n.doubleValue());
        }
        throw new IllegalArgumentException("Cannot convert to BigDecimal: " + value.getClass());
    }

    private static long toLong(Object value) {
        if (value == null) {
            return 0L;
        }
        if (value instanceof Object[] arr && arr.length > 0) {
            return toLong(arr[0]);
        }
        if (value instanceof Number n) {
            return n.longValue();
        }
        throw new IllegalArgumentException("Cannot convert to long: " + value.getClass());
    }
}
