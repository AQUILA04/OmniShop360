package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.TenantService;
import com.omnishop360.backend.web.dto.CreateTenantRequest;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.TenantResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/tenants")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Tenants", description = "API pour la gestion des tenants")
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    @PreAuthorize("hasRole('superadmin')")
    @Operation(summary = "Créer un nouveau tenant", description = "Permet au Super Admin de créer un nouveau Tenant et son administrateur principal")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Tenant créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<TenantResponse> createTenant(
            @Valid @RequestBody CreateTenantRequest request) {
        log.info("Creating tenant: {}", request.getCompanyName());
        TenantResponse response = tenantService.createTenant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('superadmin')")
    @Operation(summary = "Lister tous les tenants", description = "Récupère la liste paginée de tous les Tenants")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des tenants récupérée avec succès"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<PageResponse<TenantResponse>> getAllTenants(
            @Parameter(description = "Numéro de page (défaut: 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de page (défaut: 20, max: 100)")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Champ de tri (défaut: createdAt,desc)")
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @Parameter(description = "Recherche par nom d'entreprise")
            @RequestParam(required = false) String search) {

        int pageSize = Math.min(size, 100);
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && "asc".equalsIgnoreCase(sortParams[1])
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortObj = Sort.by(direction, sortParams[0]);

        Pageable pageable = PageRequest.of(page, pageSize, sortObj);
        PageResponse<TenantResponse> response = tenantService.getAllTenants(pageable, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{tenantId}")
    @PreAuthorize("hasRole('superadmin')")
    @Operation(summary = "Récupérer un tenant par ID", description = "Récupère les détails d'un Tenant spécifique")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tenant récupéré avec succès"),
            @ApiResponse(responseCode = "404", description = "Tenant non trouvé"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<TenantResponse> getTenantById(
            @Parameter(description = "UUID du tenant")
            @PathVariable UUID tenantId) {
        log.debug("Fetching tenant: {}", tenantId);
        TenantResponse response = tenantService.getTenantById(tenantId);
        return ResponseEntity.ok(response);
    }
}

