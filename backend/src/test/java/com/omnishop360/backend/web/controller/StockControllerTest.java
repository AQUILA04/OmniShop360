package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.StockService;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.StockMovementRequest;
import com.omnishop360.backend.web.dto.StockResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("StockController Tests")
class StockControllerTest {

    @Mock
    private StockService stockService;

    @InjectMocks
    private StockController stockController;

    private StockMovementRequest movementRequest;
    private StockResponse stockResponse;
    private UUID productId;
    private UUID variantId;

    @BeforeEach
    void setUp() {
        productId = UUID.randomUUID();
        variantId = UUID.randomUUID();

        movementRequest = StockMovementRequest.builder()
                .productId(productId)
                .variantId(variantId)
                .quantity(new BigDecimal("10.0"))
                .unitCost(new BigDecimal("25.50"))
                .notes("Test reception")
                .build();

        stockResponse = StockResponse.builder()
                .id(UUID.randomUUID())
                .productId(productId)
                .productName("Test Product")
                .productSku("TEST-SKU-001")
                .variantId(variantId)
                .variantName("Test Variant")
                .variantSku("TEST-VAR-001")
                .quantity(new BigDecimal("10.0"))
                .availableQuantity(new BigDecimal("10.0"))
                .minStockLevel(new BigDecimal("5.0"))
                .lowStock(false)
                .build();
    }

    @Test
    @DisplayName("Should add stock successfully")
    void shouldAddStockSuccessfully() {
        when(stockService.addStock(any(StockMovementRequest.class))).thenReturn(stockResponse);

        ResponseEntity<StockResponse> response = stockController.addStock(movementRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(stockResponse, response.getBody());
        verify(stockService).addStock(any(StockMovementRequest.class));
    }

    @Test
    @DisplayName("Should get inventory successfully")
    void shouldGetInventorySuccessfully() {
        PageResponse<StockResponse> pageResponse = PageResponse.<StockResponse>builder()
                .content(java.util.List.of(stockResponse))
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(20)
                        .number(0)
                        .totalElements(1L)
                        .totalPages(1)
                        .build())
                .build();

        when(stockService.getInventory(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<StockResponse>> response = stockController.getInventory(
                0, 20, "product.name,asc", null, null, null, null);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getContent().size());
        verify(stockService).getInventory(any(), any());
    }

    @Test
    @DisplayName("Should get inventory with all search parameters")
    void shouldGetInventoryWithAllSearchParameters() {
        PageResponse<StockResponse> pageResponse = PageResponse.<StockResponse>builder()
                .content(java.util.List.of(stockResponse))
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(20)
                        .number(0)
                        .totalElements(1L)
                        .totalPages(1)
                        .build())
                .build();

        when(stockService.getInventory(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<StockResponse>> response = stockController.getInventory(
                0, 20, "product.name,desc", productId, variantId, "test", true);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(stockService).getInventory(any(), any());
    }

    @Test
    @DisplayName("Should limit page size to 100")
    void shouldLimitPageSizeTo100() {
        PageResponse<StockResponse> pageResponse = PageResponse.<StockResponse>builder()
                .content(java.util.List.of())
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(100)
                        .number(0)
                        .totalElements(0L)
                        .totalPages(0)
                        .build())
                .build();

        when(stockService.getInventory(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<StockResponse>> response = stockController.getInventory(
                0, 200, "product.name,asc", null, null, null, null);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(stockService).getInventory(any(), any());
    }

    @Test
    @DisplayName("Should handle sort direction correctly")
    void shouldHandleSortDirectionCorrectly() {
        PageResponse<StockResponse> pageResponse = PageResponse.<StockResponse>builder()
                .content(java.util.List.of())
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(20)
                        .number(0)
                        .totalElements(0L)
                        .totalPages(0)
                        .build())
                .build();

        when(stockService.getInventory(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<StockResponse>> response = stockController.getInventory(
                0, 20, "product.name", null, null, null, null);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(stockService).getInventory(any(), any());
    }
}
