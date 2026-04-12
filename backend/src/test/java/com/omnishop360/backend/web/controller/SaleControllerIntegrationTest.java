package com.omnishop360.backend.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omnishop360.backend.domain.entity.Sale;
import com.omnishop360.backend.domain.service.SaleService;
import com.omnishop360.backend.domain.service.StockService;
import com.omnishop360.backend.web.dto.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
class SaleControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SaleService saleService;

    @MockitoBean
    private StockService stockService;

    @Test
    @WithMockUser(authorities = "ROLE_cashier")
    @DisplayName("POST /v1/sales/checkout should return created")
    void shouldCheckout() throws Exception {
        UUID saleId = UUID.randomUUID();
        CheckoutRequest request = CheckoutRequest.builder()
                .items(List.of(CheckoutRequest.CheckoutItem.builder()
                        .productId(UUID.randomUUID())
                        .quantity(new BigDecimal("1"))
                        .build()))
                .payments(List.of(CheckoutRequest.PaymentItem.builder()
                        .method(CheckoutRequest.SalePaymentMethod.CASH)
                        .amount(new BigDecimal("100"))
                        .build()))
                .build();
        SaleResponse response = SaleResponse.builder()
                .id(saleId)
                .saleNumber("SALE-001")
                .saleDate(LocalDateTime.now())
                .shopId(UUID.randomUUID())
                .shopName("Shop")
                .paymentMethod(Sale.PaymentMethod.CASH)
                .paymentStatus(Sale.PaymentStatus.PAID)
                .status(Sale.SaleStatus.COMPLETED)
                .subtotal(new BigDecimal("100"))
                .taxAmount(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .promoDiscountAmount(BigDecimal.ZERO)
                .voucherAmount(BigDecimal.ZERO)
                .totalAmount(new BigDecimal("100"))
                .items(List.of())
                .payments(List.of())
                .build();
        when(saleService.checkout(any())).thenReturn(response);

        mockMvc.perform(post("/v1/sales/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(saleId.toString()));
    }

    @Test
    @WithMockUser(authorities = "ROLE_cashier")
    @DisplayName("GET /v1/sales/{id}/receipt should return receipt")
    void shouldGetReceipt() throws Exception {
        SaleResponse sale = SaleResponse.builder()
                .id(UUID.randomUUID())
                .saleNumber("SALE-001")
                .saleDate(LocalDateTime.now())
                .shopId(UUID.randomUUID())
                .shopName("Shop")
                .subtotal(new BigDecimal("100"))
                .taxAmount(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .promoDiscountAmount(BigDecimal.ZERO)
                .voucherAmount(BigDecimal.ZERO)
                .totalAmount(new BigDecimal("100"))
                .paymentMethod(Sale.PaymentMethod.CASH)
                .paymentStatus(Sale.PaymentStatus.PAID)
                .status(Sale.SaleStatus.COMPLETED)
                .items(List.of())
                .payments(List.of())
                .build();
        when(saleService.getReceipt(any(), any())).thenReturn(ReceiptResponse.builder().format(ReceiptFormat.A4).sale(sale).build());

        mockMvc.perform(get("/v1/sales/" + UUID.randomUUID() + "/receipt").param("format", "A4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.format").value("A4"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin")
    @DisplayName("POST /v1/sales/promotions should return created")
    void shouldCreatePromotionCode() throws Exception {
        CreatePromotionCodeRequest request = new CreatePromotionCodeRequest(
                "PROMO1000",
                com.omnishop360.backend.domain.entity.PromotionCode.DiscountType.FIXED,
                new BigDecimal("1000"),
                new BigDecimal("1000"),
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(2),
                false,
                true,
                null
        );
        PromotionCodeResponse response = PromotionCodeResponse.builder()
                .id(UUID.randomUUID())
                .code("PROMO1000")
                .discountType(com.omnishop360.backend.domain.entity.PromotionCode.DiscountType.FIXED)
                .discountValue(new BigDecimal("1000"))
                .active(true)
                .build();
        when(saleService.createPromotionCode(any())).thenReturn(response);

        mockMvc.perform(post("/v1/sales/promotions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("PROMO1000"));
    }
}
