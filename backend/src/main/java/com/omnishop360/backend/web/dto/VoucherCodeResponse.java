package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.VoucherCode;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record VoucherCodeResponse(
        UUID id,
        String code,
        BigDecimal originalAmount,
        BigDecimal remainingAmount,
        VoucherCode.Status status,
        UUID sourceSessionId,
        UUID customerId
) {
    public static VoucherCodeResponse from(VoucherCode voucherCode) {
        return VoucherCodeResponse.builder()
                .id(voucherCode.getId())
                .code(voucherCode.getCode())
                .originalAmount(voucherCode.getOriginalAmount())
                .remainingAmount(voucherCode.getRemainingAmount())
                .status(voucherCode.getStatus())
                .sourceSessionId(voucherCode.getSourceSession() != null ? voucherCode.getSourceSession().getId() : null)
                .customerId(voucherCode.getCustomer() != null ? voucherCode.getCustomer().getId() : null)
                .build();
    }
}
