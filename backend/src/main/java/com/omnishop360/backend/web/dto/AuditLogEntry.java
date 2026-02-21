package com.omnishop360.backend.web.dto;

import java.time.Instant;
import java.util.UUID;

public record AuditLogEntry(
        int revisionId,
        Instant timestamp,
        String userId,
        String actionType,
        String entityType,
        UUID entityId
) {
}
