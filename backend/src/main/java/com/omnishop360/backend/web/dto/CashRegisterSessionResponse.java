package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.CashRegisterSession;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record CashRegisterSessionResponse(
        UUID id,
        UUID shopId,
        String shopName,
        String openedBy,
        LocalDateTime openedAt,
        BigDecimal openingFloat,
        String closedBy,
        LocalDateTime closedAt,
        BigDecimal expectedCashAmount,
        BigDecimal countedCashAmount,
        BigDecimal remainderAmount,
        CashRegisterSession.Status status,
        String generatedVoucherCode
) {
    public static CashRegisterSessionResponse from(CashRegisterSession session, String generatedVoucherCode) {
        return CashRegisterSessionResponse.builder()
                .id(session.getId())
                .shopId(session.getShop().getId())
                .shopName(session.getShop().getName())
                .openedBy(session.getOpenedBy())
                .openedAt(session.getOpenedAt())
                .openingFloat(session.getOpeningFloat())
                .closedBy(session.getClosedBy())
                .closedAt(session.getClosedAt())
                .expectedCashAmount(session.getExpectedCashAmount())
                .countedCashAmount(session.getCountedCashAmount())
                .remainderAmount(session.getRemainderAmount())
                .status(session.getStatus())
                .generatedVoucherCode(generatedVoucherCode)
                .build();
    }
}
