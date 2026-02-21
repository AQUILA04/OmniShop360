package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Sale;
import com.omnishop360.backend.domain.entity.Shop;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.repository.SaleRepository;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.ExportFormat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

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
@DisplayName("ExportService Tests")
class ExportServiceTest {

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private ExportService exportService;

    private UUID tenantId;
    private UUID shopId;
    private Sale sale;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        shopId = UUID.randomUUID();
        Tenant tenant = new Tenant();
        tenant.setId(tenantId);
        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setName("Test Shop");
        shop.setTenant(tenant);
        sale = new Sale();
        sale.setId(UUID.randomUUID());
        sale.setSaleNumber("SALE-001");
        sale.setSaleDate(LocalDateTime.now());
        sale.setShop(shop);
        sale.setTenant(tenant);
        sale.setTotalAmount(new BigDecimal("100.00"));
        sale.setStatus(Sale.SaleStatus.COMPLETED);
    }

    @Test
    @DisplayName("Should export PDF for tenant_admin")
    void shouldExportPdfForTenantAdmin() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(() -> SecurityUtils.hasRole("shop_admin")).thenReturn(false);
            when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
            when(saleRepository.findAll(any(Specification.class), eq(PageRequest.of(0, 10000))))
                    .thenReturn(new PageImpl<>(List.of(sale)));

            byte[] result = exportService.exportSalesReport(
                    Optional.of(shopId), LocalDate.of(2025, 2, 1), LocalDate.of(2025, 2, 21), ExportFormat.PDF);

            assertNotNull(result);
            assertTrue(result.length > 0);
        }
    }

    @Test
    @DisplayName("Should export Excel for tenant_admin")
    void shouldExportExcelForTenantAdmin() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(() -> SecurityUtils.hasRole("shop_admin")).thenReturn(false);
            when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
            when(saleRepository.findAll(any(Specification.class), eq(PageRequest.of(0, 10000))))
                    .thenReturn(new PageImpl<>(List.of(sale)));

            byte[] result = exportService.exportSalesReport(
                    Optional.empty(), LocalDate.of(2025, 2, 1), LocalDate.of(2025, 2, 21), ExportFormat.EXCEL);

            assertNotNull(result);
            assertTrue(result.length > 0);
        }
    }

    @Test
    @DisplayName("Should export empty PDF when no sales")
    void shouldExportEmptyPdfWhenNoSales() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(() -> SecurityUtils.hasRole("shop_admin")).thenReturn(false);
            when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
            when(saleRepository.findAll(any(Specification.class), any(PageRequest.class)))
                    .thenReturn(new PageImpl<>(List.of()));

            byte[] result = exportService.exportSalesReport(
                    Optional.empty(), LocalDate.of(2025, 2, 1), LocalDate.of(2025, 2, 21), ExportFormat.PDF);

            assertNotNull(result);
            assertTrue(result.length > 0);
        }
    }

    @Test
    @DisplayName("Should throw when shop_admin has no shop")
    void shouldThrowWhenShopAdminHasNoShop() {
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(() -> SecurityUtils.hasRole("shop_admin")).thenReturn(true);
            when(userContextService.getCurrentUserShopId()).thenReturn(Optional.empty());

            assertThrows(IllegalArgumentException.class, () ->
                    exportService.exportSalesReport(Optional.empty(), LocalDate.now(), LocalDate.now(), ExportFormat.PDF));
        }
    }
}
