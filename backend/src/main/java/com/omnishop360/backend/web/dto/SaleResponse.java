package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Sale;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Builder
public record SaleResponse(
        UUID id,
        String saleNumber,
        LocalDateTime saleDate,
        UUID shopId,
        String shopName,
        UUID customerId,
        String customerName,
        BigDecimal subtotal,
        BigDecimal taxAmount,
        BigDecimal discountAmount,
        BigDecimal promoDiscountAmount,
        String promoCode,
        BigDecimal voucherAmount,
        String voucherCode,
        BigDecimal totalAmount,
        Sale.PaymentMethod paymentMethod,
        Sale.PaymentStatus paymentStatus,
        Sale.SaleStatus status,
        String notes,
        LocalDateTime createdAt,
        UUID cashRegisterSessionId,
        List<SalePaymentResponse> payments,
        List<SaleItemResponse> items
) {
    public static SaleResponse from(Sale sale) {
        if (Objects.isNull(sale)) {
            return null;
        }
        return SaleResponse.builder()
                .id(sale.getId())
                .saleNumber(sale.getSaleNumber())
                .saleDate(sale.getSaleDate())
                .shopId(sale.getShop().getId())
                .shopName(sale.getShop().getName())
                .customerId(sale.getCustomer() != null ? sale.getCustomer().getId() : null)
                .customerName(sale.getCustomer() != null 
                        ? (sale.getCustomer().getFirstName() + " " + sale.getCustomer().getLastName()).trim()
                        : null)
                .subtotal(sale.getSubtotal())
                .taxAmount(sale.getTaxAmount())
                .discountAmount(sale.getDiscountAmount())
                .promoDiscountAmount(sale.getPromoDiscountAmount())
                .promoCode(sale.getPromoCode())
                .voucherAmount(sale.getVoucherAmount())
                .voucherCode(sale.getVoucherCode())
                .totalAmount(sale.getTotalAmount())
                .paymentMethod(sale.getPaymentMethod())
                .paymentStatus(sale.getPaymentStatus())
                .status(sale.getStatus())
                .notes(sale.getNotes())
                .createdAt(sale.getCreatedAt())
                .cashRegisterSessionId(sale.getCashRegisterSession() != null ? sale.getCashRegisterSession().getId() : null)
                .payments(sale.getPayments().stream()
                        .map(SalePaymentResponse::from)
                        .toList())
                .items(sale.getItems().stream()
                        .map(SaleItemResponse::from)
                        .toList())
                .build();
    }
}
