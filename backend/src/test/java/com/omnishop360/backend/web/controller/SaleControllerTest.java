package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.entity.Sale;
import com.omnishop360.backend.domain.service.SaleService;
import com.omnishop360.backend.web.dto.CheckoutRequest;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.SaleResponse;
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
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SaleController Tests")
class SaleControllerTest {

    @Mock
    private SaleService saleService;

    @InjectMocks
    private SaleController saleController;

    private CheckoutRequest checkoutRequest;
    private SaleResponse saleResponse;
    private UUID saleId;
    private UUID productId;
    private UUID customerId;

    @BeforeEach
    void setUp() {
        saleId = UUID.randomUUID();
        productId = UUID.randomUUID();
        customerId = UUID.randomUUID();

        CheckoutRequest.CheckoutItem item = CheckoutRequest.CheckoutItem.builder()
                .productId(productId)
                .quantity(new BigDecimal("2.0"))
                .build();

        checkoutRequest = CheckoutRequest.builder()
                .items(List.of(item))
                .customerId(customerId)
                .paymentMethod(Sale.PaymentMethod.CASH)
                .discountAmount(BigDecimal.ZERO)
                .build();

        saleResponse = SaleResponse.builder()
                .id(saleId)
                .saleNumber("SALE-20250124-123456")
                .shopId(UUID.randomUUID())
                .shopName("Test Shop")
                .customerId(customerId)
                .saleDate(java.time.LocalDateTime.now())
                .subtotal(new BigDecimal("100.00"))
                .taxAmount(new BigDecimal("20.00"))
                .discountAmount(BigDecimal.ZERO)
                .totalAmount(new BigDecimal("120.00"))
                .paymentMethod(Sale.PaymentMethod.CASH)
                .paymentStatus(Sale.PaymentStatus.PAID)
                .status(Sale.SaleStatus.COMPLETED)
                .items(List.of())
                .build();
    }

    @Test
    @DisplayName("Should checkout successfully")
    void shouldCheckoutSuccessfully() {
        when(saleService.checkout(any(CheckoutRequest.class))).thenReturn(saleResponse);

        ResponseEntity<SaleResponse> response = saleController.checkout(checkoutRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(saleResponse, response.getBody());
        verify(saleService).checkout(any(CheckoutRequest.class));
    }

    @Test
    @DisplayName("Should get sales successfully")
    void shouldGetSalesSuccessfully() {
        PageResponse<SaleResponse> pageResponse = PageResponse.<SaleResponse>builder()
                .content(List.of(saleResponse))
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(20)
                        .number(0)
                        .totalElements(1L)
                        .totalPages(1)
                        .build())
                .build();

        when(saleService.getSales(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<SaleResponse>> response = saleController.getSales(
                0, 20, "saleDate,desc", null, null, null, null, null, null, null);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getContent().size());
        verify(saleService).getSales(any(), any());
    }

    @Test
    @DisplayName("Should get sales with all search parameters")
    void shouldGetSalesWithAllSearchParameters() {
        PageResponse<SaleResponse> pageResponse = PageResponse.<SaleResponse>builder()
                .content(List.of(saleResponse))
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(20)
                        .number(0)
                        .totalElements(1L)
                        .totalPages(1)
                        .build())
                .build();

        when(saleService.getSales(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<SaleResponse>> response = saleController.getSales(
                0, 20, "saleDate,asc", customerId, "test", Sale.PaymentMethod.CASH,
                Sale.PaymentStatus.PAID, Sale.SaleStatus.COMPLETED,
                LocalDate.now().minusDays(7), LocalDate.now());

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(saleService).getSales(any(), any());
    }

    @Test
    @DisplayName("Should limit page size to 100")
    void shouldLimitPageSizeTo100() {
        PageResponse<SaleResponse> pageResponse = PageResponse.<SaleResponse>builder()
                .content(List.of())
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(100)
                        .number(0)
                        .totalElements(0L)
                        .totalPages(0)
                        .build())
                .build();

        when(saleService.getSales(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<SaleResponse>> response = saleController.getSales(
                0, 200, "saleDate,desc", null, null, null, null, null, null, null);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(saleService).getSales(any(), any());
    }

    @Test
    @DisplayName("Should get sale by id successfully")
    void shouldGetSaleByIdSuccessfully() {
        when(saleService.getSaleById(any(UUID.class))).thenReturn(saleResponse);

        ResponseEntity<SaleResponse> response = saleController.getSaleById(saleId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(saleResponse, response.getBody());
        verify(saleService).getSaleById(saleId);
    }
}
