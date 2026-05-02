package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.AnalyticsService;
import com.omnishop360.backend.domain.service.ExportService;
import com.omnishop360.backend.web.dto.AnalyticsSummaryResponse;
import com.omnishop360.backend.web.dto.ExportFormat;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "API tableaux de bord et indicateurs")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final ExportService exportService;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Synthèse analytics", description = "CA, nombre de transactions, panier moyen, évolution et top produits")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Synthèse récupérée avec succès"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<AnalyticsSummaryResponse> getSummary(
            @Parameter(description = "ID boutique (optionnel pour tenant_admin)")
            @RequestParam(required = false) UUID shopId,
            @Parameter(description = "Date de début (yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @Parameter(description = "Date de fin (yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        AnalyticsSummaryResponse response = analyticsService.getSummary(
                Optional.ofNullable(shopId), fromDate, toDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Exporter les ventes", description = "Génère un rapport PDF ou Excel des ventes sur la période")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fichier généré"),
            @ApiResponse(responseCode = "400", description = "Format invalide"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<byte[]> export(
            @Parameter(description = "Format: PDF ou EXCEL")
            @RequestParam ExportFormat format,
            @Parameter(description = "ID boutique (optionnel pour tenant_admin)")
            @RequestParam(required = false) UUID shopId,
            @Parameter(description = "Date de début (yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @Parameter(description = "Date de fin (yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        byte[] content = exportService.exportSalesReport(
                Optional.ofNullable(shopId), fromDate, toDate, format);
        String contentType = format == ExportFormat.PDF ? MediaType.APPLICATION_PDF_VALUE : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        String extension = format == ExportFormat.PDF ? "pdf" : "xlsx";
        String filename = "rapport-ventes-" + LocalDate.now() + "." + extension;
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(content);
    }
}
