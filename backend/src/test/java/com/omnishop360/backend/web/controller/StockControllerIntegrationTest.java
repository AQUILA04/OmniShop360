package com.omnishop360.backend.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omnishop360.backend.domain.service.StockService;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.StockMovementRequest;
import com.omnishop360.backend.web.dto.StockResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class StockControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private StockService stockService;

    @Test
    @WithMockUser(authorities = "ROLE_stock_manager")
    @DisplayName("POST /v1/stock/movements should return created")
    void shouldAddStock() throws Exception {
        StockMovementRequest request = StockMovementRequest.builder()
                .productId(UUID.randomUUID())
                .quantity(new BigDecimal("10"))
                .unitCost(new BigDecimal("100"))
                .build();
        StockResponse response = StockResponse.builder().id(UUID.randomUUID()).quantity(new BigDecimal("10")).build();
        when(stockService.addStock(any())).thenReturn(response);

        mockMvc.perform(post("/v1/stock/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    @WithMockUser(authorities = "ROLE_stock_manager")
    @DisplayName("GET /v1/stock/inventory should return page")
    void shouldGetInventory() throws Exception {
        PageResponse<StockResponse> page = PageResponse.<StockResponse>builder()
                .content(List.of(StockResponse.builder().id(UUID.randomUUID()).productName("P").build()))
                .page(PageResponse.PageInfo.builder().size(20).number(0).totalElements(1L).totalPages(1).build())
                .build();
        when(stockService.getInventory(any(), any())).thenReturn(page);

        mockMvc.perform(get("/v1/stock/inventory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }
}
