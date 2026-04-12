package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.SalePayment;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record SalePaymentResponse(
        UUID id,
        SalePayment.Method method,
        BigDecimal amount,
        String reference
) {
    public static SalePaymentResponse from(SalePayment payment) {
        return SalePaymentResponse.builder()
                .id(payment.getId())
                .method(payment.getMethod())
                .amount(payment.getAmount())
                .reference(payment.getReference())
                .build();
    }
}
