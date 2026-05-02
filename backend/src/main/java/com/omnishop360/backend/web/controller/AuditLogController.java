package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.AuditLogService;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.AuditLogEntry;
import com.omnishop360.backend.web.dto.AuditLogSearchDto;
import com.omnishop360.backend.web.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.UUID;

@RestController
@RequestMapping("/v1/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "API journaux d'audit (US-019)")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasAnyRole('superadmin', 'tenant_admin')")
    @Operation(summary = "Lister les logs d'audit", description = "Liste paginée des modifications (Stock, Sale, Product, User)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<PageResponse<AuditLogEntry>> getAuditLogs(
            org.springframework.data.domain.Pageable pageable,
            @Parameter(description = "Date de début (yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @Parameter(description = "Date de fin (yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @Parameter(description = "Filtrer par utilisateur (Keycloak sub)")
            @RequestParam(required = false) String userId,
            @Parameter(description = "Filtrer par type d'entité: Stock, Sale, Product, User")
            @RequestParam(required = false) String entityType,
            @Parameter(description = "Filtrer par tenant (superadmin uniquement)")
            @RequestParam(required = false) UUID tenantId) {
        Instant from = fromDate != null ? fromDate.atStartOfDay(ZoneOffset.UTC).toInstant() : null;
        Instant to = toDate != null ? toDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant() : null;
        UUID effectiveTenantId = SecurityUtils.isSuperAdmin() ? tenantId : null;
        AuditLogSearchDto searchDto = AuditLogSearchDto.builder()
                .tenantId(effectiveTenantId)
                .fromDate(from)
                .toDate(to)
                .userId(userId)
                .entityType(entityType)
                .build();
        PageResponse<AuditLogEntry> response = auditLogService.getAuditLogs(searchDto, pageable);
        return ResponseEntity.ok(response);
    }
}
