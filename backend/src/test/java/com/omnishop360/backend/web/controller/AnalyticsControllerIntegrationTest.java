package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.AnalyticsService;
import com.omnishop360.backend.domain.service.ExportService;
import com.omnishop360.backend.web.dto.AnalyticsSummaryResponse;
import com.omnishop360.backend.web.dto.SalesEvolutionEntry;
import com.omnishop360.backend.web.dto.TopProductEntry;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("AnalyticsController Integration Tests")
class AnalyticsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnalyticsService analyticsService;

    @MockBean
    private ExportService exportService;

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin")
    @DisplayName("GET /v1/analytics/summary should return 200 for tenant_admin")
    void shouldReturnSummaryForTenantAdmin() throws Exception {
        AnalyticsSummaryResponse summary = new AnalyticsSummaryResponse(
                new BigDecimal("1000.00"),
                5L,
                new BigDecimal("200.00"),
                LocalDate.of(2025, 2, 1),
                LocalDate.of(2025, 2, 21),
                List.of(new SalesEvolutionEntry(LocalDate.of(2025, 2, 1), new BigDecimal("200.00"), 1L)),
                List.of(new TopProductEntry(null, "Product A", "SKU-A", new BigDecimal("10"), new BigDecimal("500.00"))));
        when(analyticsService.getSummary(any(), any(), any())).thenReturn(summary);

        mockMvc.perform(get("/v1/analytics/summary")
                        .param("fromDate", "2025-02-01")
                        .param("toDate", "2025-02-21"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRevenue").value(1000.00))
                .andExpect(jsonPath("$.transactionCount").value(5))
                .andExpect(jsonPath("$.averageBasket").value(200.00))
                .andExpect(jsonPath("$.periodFrom").value("2025-02-01"))
                .andExpect(jsonPath("$.periodTo").value("2025-02-21"))
                .andExpect(jsonPath("$.salesEvolution").isArray())
                .andExpect(jsonPath("$.topProducts").isArray());
    }

    @Test
    @WithMockUser(authorities = "ROLE_shop_admin")
    @DisplayName("GET /v1/analytics/summary should return 200 for shop_admin")
    void shouldReturnSummaryForShopAdmin() throws Exception {
        when(analyticsService.getSummary(any(), any(), any())).thenReturn(
                new AnalyticsSummaryResponse(BigDecimal.ZERO, 0L, BigDecimal.ZERO, LocalDate.now(), LocalDate.now(), List.of(), List.of()));

        mockMvc.perform(get("/v1/analytics/summary"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("GET /v1/analytics/summary should return 403 without required role")
    void shouldReturn403ForUnauthorizedUser() throws Exception {
        mockMvc.perform(get("/v1/analytics/summary"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin")
    @DisplayName("GET /v1/analytics/export should return PDF for tenant_admin")
    void shouldReturnPdfExportForTenantAdmin() throws Exception {
        when(exportService.exportSalesReport(any(), any(), any(), any())).thenReturn(new byte[]{'P', 'D', 'F'});

        mockMvc.perform(get("/v1/analytics/export")
                        .param("format", "PDF")
                        .param("fromDate", "2025-02-01")
                        .param("toDate", "2025-02-21"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("attachment")))
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString(".pdf")));
    }

    @Test
    @WithMockUser(authorities = "ROLE_cashier")
    @DisplayName("GET /v1/analytics/export should return Excel for cashier")
    void shouldReturnExcelExportForCashier() throws Exception {
        when(exportService.exportSalesReport(any(), any(), any(), any())).thenReturn(new byte[]{1, 2, 3});

        mockMvc.perform(get("/v1/analytics/export")
                        .param("format", "EXCEL"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString(".xlsx")));
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("GET /v1/analytics/export should return 403 without required role")
    void shouldReturn403ForExportUnauthorizedUser() throws Exception {
        mockMvc.perform(get("/v1/analytics/export").param("format", "PDF"))
                .andExpect(status().isForbidden());
    }
}
