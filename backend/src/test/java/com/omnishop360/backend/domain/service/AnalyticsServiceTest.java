package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.repository.SaleRepository;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.AnalyticsSummaryResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AnalyticsService Tests")
class AnalyticsServiceTest {

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private AnalyticsService analyticsService;

    private UUID tenantId;
    private UUID shopId;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        shopId = UUID.randomUUID();
    }

    @Test
    @DisplayName("Should return summary for tenant_admin with optional shop")
    void shouldReturnSummaryForTenantAdminWithOptionalShop() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(() -> SecurityUtils.hasRole("shop_admin")).thenReturn(false);

            when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
            Object[] summaryRow = new Object[]{new BigDecimal("1000.00"), 5L};
            when(saleRepository.findSummaryByTenantAndShopAndDateRange(eq(tenantId), eq(shopId), any(LocalDateTime.class), any(LocalDateTime.class)))
                    .thenReturn(summaryRow);
            when(saleRepository.findDailyRevenueByTenantAndShopAndDateRange(eq(tenantId), eq(shopId), any(LocalDateTime.class), any(LocalDateTime.class)))
                    .thenReturn(List.of());
            when(saleRepository.findTopProductsByTenantAndShopAndDateRange(eq(tenantId), eq(shopId), any(LocalDateTime.class), any(LocalDateTime.class), any(PageRequest.class)))
                    .thenReturn(List.of());

            AnalyticsSummaryResponse response = analyticsService.getSummary(
                    Optional.of(shopId), LocalDate.of(2025, 2, 1), LocalDate.of(2025, 2, 21));

            assertNotNull(response);
            assertEquals(new BigDecimal("1000.00"), response.totalRevenue());
            assertEquals(5L, response.transactionCount());
            assertEquals(0, new BigDecimal("200.00").compareTo(response.averageBasket()));
            assertEquals(LocalDate.of(2025, 2, 1), response.periodFrom());
            assertEquals(LocalDate.of(2025, 2, 21), response.periodTo());
            assertTrue(response.salesEvolution().isEmpty());
            assertTrue(response.topProducts().isEmpty());
        }
    }

    @Test
    @DisplayName("Should return summary for shop_admin with forced shop")
    void shouldReturnSummaryForShopAdminWithForcedShop() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(() -> SecurityUtils.hasRole("shop_admin")).thenReturn(true);
            when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
            when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);

            Object[] summaryRow = new Object[]{new BigDecimal("500.00"), 2L};
            when(saleRepository.findSummaryByTenantAndShopAndDateRange(eq(tenantId), eq(shopId), any(LocalDateTime.class), any(LocalDateTime.class)))
                    .thenReturn(summaryRow);
            when(saleRepository.findDailyRevenueByTenantAndShopAndDateRange(eq(tenantId), eq(shopId), any(LocalDateTime.class), any(LocalDateTime.class)))
                    .thenReturn(List.of());
            when(saleRepository.findTopProductsByTenantAndShopAndDateRange(eq(tenantId), eq(shopId), any(LocalDateTime.class), any(LocalDateTime.class), any(PageRequest.class)))
                    .thenReturn(List.of());

            AnalyticsSummaryResponse response = analyticsService.getSummary(
                    Optional.empty(), LocalDate.of(2025, 2, 1), LocalDate.of(2025, 2, 21));

            assertNotNull(response);
            assertEquals(new BigDecimal("500.00"), response.totalRevenue());
            assertEquals(2L, response.transactionCount());
        }
    }

    @Test
    @DisplayName("Should throw when shop_admin has no shop")
    void shouldThrowWhenShopAdminHasNoShop() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(() -> SecurityUtils.hasRole("shop_admin")).thenReturn(true);
            when(userContextService.getCurrentUserShopId()).thenReturn(Optional.empty());

            assertThrows(IllegalArgumentException.class, () ->
                    analyticsService.getSummary(Optional.empty(), LocalDate.now(), LocalDate.now()));
        }
    }

    @Test
    @DisplayName("Should return zero summary when no sales")
    void shouldReturnZeroSummaryWhenNoSales() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(() -> SecurityUtils.hasRole("shop_admin")).thenReturn(false);
            when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
            Object[] summaryRow = new Object[]{null, 0L};
            when(saleRepository.findSummaryByTenantAndShopAndDateRange(any(), any(), any(), any())).thenReturn(summaryRow);
            when(saleRepository.findDailyRevenueByTenantAndShopAndDateRange(any(), any(), any(), any())).thenReturn(List.of());
            when(saleRepository.findTopProductsByTenantAndShopAndDateRange(any(), any(), any(), any(), any())).thenReturn(List.of());

            AnalyticsSummaryResponse response = analyticsService.getSummary(
                    Optional.empty(), LocalDate.of(2025, 2, 1), LocalDate.of(2025, 2, 21));

            assertEquals(BigDecimal.ZERO, response.totalRevenue());
            assertEquals(0L, response.transactionCount());
            assertEquals(BigDecimal.ZERO, response.averageBasket());
        }
    }
}
