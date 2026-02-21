package com.omnishop360.backend.web.dto;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record AuditLogSearchDto(
        UUID tenantId,
        Instant fromDate,
        Instant toDate,
        String userId,
        String entityType
) {
}
