package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.entity.Sale;
import com.omnishop360.backend.domain.service.SaleService;
import com.omnishop360.backend.domain.service.StockService;
import com.omnishop360.backend.web.dto.CheckoutRequest;
import com.omnishop360.backend.web.dto.CreatePromotionCodeRequest;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.PromotionCodeResponse;
import com.omnishop360.backend.web.dto.ReceiptFormat;
import com.omnishop360.backend.web.dto.ReceiptResponse;
import com.omnishop360.backend.web.dto.SaleResponse;
import com.omnishop360.backend.web.dto.StockResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("SaleController Tests")
class SaleControllerTest {

    @Mock
    private SaleService saleService;

    @Mock
    private StockService stockService;

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
                PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "saleDate")), null, null, null, null, null, null, null);

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
                PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "saleDate")), customerId, "test", Sale.PaymentMethod.CASH,
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
                PageRequest.of(0, 200, Sort.by(Sort.Direction.DESC, "saleDate")), null, null, null, null, null, null, null);

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

    @Test
    @DisplayName("Should get products for sale successfully")
    void shouldGetProductsForSaleSuccessfully() {
        StockResponse stockItem = StockResponse.builder()
                .id(UUID.randomUUID())
                .productId(productId)
                .productName("Test Product")
                .productSku("TEST-SKU")
                .variantId(null)
                .variantName(null)
                .variantSku(null)
                .quantity(new BigDecimal("10.0"))
                .availableQuantity(new BigDecimal("10.0"))
                .minStockLevel(BigDecimal.ZERO)
                .maxStockLevel(null)
                .lowStock(false)
                .sellingPrice(new BigDecimal("29.99"))
                .build();
        PageResponse<StockResponse> pageResponse = PageResponse.<StockResponse>builder()
                .content(List.of(stockItem))
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(20)
                        .number(0)
                        .totalElements(1L)
                        .totalPages(1)
                        .build())
                .build();
        when(stockService.getInventory(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<StockResponse>> response = saleController.getProductsForSale(
                PageRequest.of(0, 20, Sort.by(Sort.Direction.ASC, "product.name")), "test", null, null, null);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getContent().size());
        assertEquals(new BigDecimal("29.99"), response.getBody().getContent().get(0).sellingPrice());
        verify(stockService).getInventory(any(), any());
    }

    @Test
    @DisplayName("Should get products for sale with pageable")
    void shouldGetProductsForSaleWithPageable() {
        PageResponse<StockResponse> pageResponse = PageResponse.<StockResponse>builder()
                .content(List.of())
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(20)
                        .number(0)
                        .totalElements(0L)
                        .totalPages(0)
                        .build())
                .build();
        when(stockService.getInventory(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<StockResponse>> response = saleController.getProductsForSale(
                PageRequest.of(0, 20, Sort.by(Sort.Direction.ASC, "product.name")), null, null, null, null);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(stockService).getInventory(any(), any());
    }

    @Test
    @DisplayName("Should get receipt successfully")
    void shouldGetReceiptSuccessfully() {
        ReceiptResponse receiptResponse = ReceiptResponse.builder()
                .format(ReceiptFormat.THERMAL)
                .sale(saleResponse)
                .build();
        when(saleService.getReceipt(saleId, ReceiptFormat.THERMAL)).thenReturn(receiptResponse);

        ResponseEntity<ReceiptResponse> response = saleController.getReceipt(saleId, ReceiptFormat.THERMAL);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(ReceiptFormat.THERMAL, response.getBody().format());
        verify(saleService).getReceipt(saleId, ReceiptFormat.THERMAL);
    }

    @Test
    @DisplayName("Should create promotion code successfully")
    void shouldCreatePromotionCodeSuccessfully() {
        CreatePromotionCodeRequest request = new CreatePromotionCodeRequest(
                "PROMO1000",
                com.omnishop360.backend.domain.entity.PromotionCode.DiscountType.FIXED,
                new BigDecimal("1000"),
                new BigDecimal("1000"),
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(3),
                false,
                true,
                null
        );
        PromotionCodeResponse promotionCodeResponse = PromotionCodeResponse.builder()
                .id(UUID.randomUUID())
                .code("PROMO1000")
                .discountType(com.omnishop360.backend.domain.entity.PromotionCode.DiscountType.FIXED)
                .discountValue(new BigDecimal("1000"))
                .active(true)
                .build();
        when(saleService.createPromotionCode(any())).thenReturn(promotionCodeResponse);

        ResponseEntity<PromotionCodeResponse> response = saleController.createPromotionCode(request);

        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("PROMO1000", response.getBody().code());
        verify(saleService).createPromotionCode(any());
    }
}
