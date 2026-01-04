package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.ShopService;
import com.omnishop360.backend.web.dto.AdminUserResponse;
import com.omnishop360.backend.web.dto.CreateShopAdminRequest;
import com.omnishop360.backend.web.dto.CreateShopRequest;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.ShopResponse;
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
@RequestMapping("/v1/shops")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Shops", description = "API pour la gestion des boutiques")
public class ShopController {

    private final ShopService shopService;

    @PostMapping
    @PreAuthorize("hasRole('tenant_admin')")
    @Operation(summary = "Créer une nouvelle boutique", description = "Permet au Tenant Admin de créer une nouvelle boutique")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Boutique créée avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<ShopResponse> createShop(
            @Valid @RequestBody CreateShopRequest request) {
        log.info("Creating shop: {}", request.getName());
        ShopResponse response = shopService.createShop(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin')")
    @Operation(summary = "Lister toutes les boutiques", description = "Récupère la liste paginée des boutiques du tenant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des boutiques récupérée avec succès"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<PageResponse<ShopResponse>> getAllShops(
            @Parameter(description = "Numéro de page (défaut: 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de page (défaut: 20, max: 100)")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Champ de tri (défaut: createdAt,desc)")
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @Parameter(description = "Recherche par nom ou code")
            @RequestParam(required = false) String search) {

        int pageSize = Math.min(size, 100);
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && "asc".equalsIgnoreCase(sortParams[1])
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortObj = Sort.by(direction, sortParams[0]);

        Pageable pageable = PageRequest.of(page, pageSize, sortObj);
        PageResponse<ShopResponse> response = shopService.getAllShops(pageable, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{shopId}")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin')")
    @Operation(summary = "Récupérer une boutique par ID", description = "Récupère les détails d'une boutique spécifique")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Boutique récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Boutique non trouvée"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<ShopResponse> getShopById(
            @Parameter(description = "UUID de la boutique")
            @PathVariable UUID shopId) {
        log.debug("Fetching shop: {}", shopId);
        ShopResponse response = shopService.getShopById(shopId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{shopId}/admins")
    @PreAuthorize("hasRole('tenant_admin')")
    @Operation(summary = "Créer un Shop Admin", description = "Permet au Tenant Admin de créer un Shop Admin et de l'assigner à une boutique")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Shop Admin créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes"),
            @ApiResponse(responseCode = "404", description = "Boutique non trouvée")
    })
    public ResponseEntity<AdminUserResponse> createShopAdmin(
            @Parameter(description = "UUID de la boutique")
            @PathVariable UUID shopId,
            @Valid @RequestBody CreateShopAdminRequest request) {
        log.info("Creating shop admin for shop: {}", shopId);
        request.setShopId(shopId);
        var user = shopService.createShopAdmin(request);
        AdminUserResponse response = AdminUserResponse.from(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

