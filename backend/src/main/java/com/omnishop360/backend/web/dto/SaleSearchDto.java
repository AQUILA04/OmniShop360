package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Sale;
import lombok.Builder;

import java.time.LocalDate;
import java.util.UUID;

@Builder
public record SaleSearchDto(
        UUID shopId,
        UUID customerId,
        String keyword,
        Sale.PaymentMethod paymentMethod,
        Sale.PaymentStatus paymentStatus,
        Sale.SaleStatus status,
        LocalDate fromDate,
        LocalDate toDate
) {
}
