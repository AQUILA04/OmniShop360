package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.StockService;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.StockMovementRequest;
import com.omnishop360.backend.web.dto.StockResponse;
import com.omnishop360.backend.web.dto.StockSearchDto;
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
@RequestMapping("/v1/stock")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Stock", description = "API pour la gestion des stocks et inventaires")
public class StockController {

    private final StockService stockService;

    @PostMapping("/movements")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin')")
    @Operation(summary = "Enregistrer une réception de marchandises", 
               description = "Permet d'ajouter du stock à une boutique (réception)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Réception enregistrée avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes"),
            @ApiResponse(responseCode = "404", description = "Produit ou boutique non trouvé")
    })
    public ResponseEntity<StockResponse> addStock(
            @Valid @RequestBody StockMovementRequest request) {
        log.info("Receiving stock: productId={}, quantity={}", request.productId(), request.quantity());
        StockResponse response = stockService.addStock(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/inventory")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin')")
    @Operation(summary = "Consulter l'inventaire", 
               description = "Récupère la liste paginée des stocks de la boutique")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Inventaire récupéré avec succès"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<PageResponse<StockResponse>> getInventory(
            @Parameter(description = "Numéro de page (défaut: 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de page (défaut: 20, max: 100)")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Champ de tri (défaut: product.name,asc)")
            @RequestParam(defaultValue = "product.name,asc") String sort,
            @Parameter(description = "ID du produit")
            @RequestParam(required = false) UUID productId,
            @Parameter(description = "ID de la variante")
            @RequestParam(required = false) UUID variantId,
            @Parameter(description = "Recherche par nom ou SKU")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "Filtrer les stocks bas")
            @RequestParam(required = false) Boolean lowStock) {

        int pageSize = Math.min(size, 100);
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && "desc".equalsIgnoreCase(sortParams[1])
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortParams[0]);
        Pageable pageable = PageRequest.of(page, pageSize, sortObj);

        StockSearchDto searchDto = StockSearchDto.builder()
                .productId(productId)
                .variantId(variantId)
                .keyword(keyword)
                .lowStock(lowStock)
                .build();

        PageResponse<StockResponse> response = stockService.getInventory(searchDto, pageable);
        return ResponseEntity.ok(response);
    }
}
