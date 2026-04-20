package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.CashRegisterSession;
import lombok.Builder;

@Builder
public record CashRegisterSessionSearchDto(
        CashRegisterSession.Status status
) {
}
