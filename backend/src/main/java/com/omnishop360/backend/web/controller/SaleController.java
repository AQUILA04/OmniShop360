package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.entity.Sale;
import com.omnishop360.backend.domain.service.SaleService;
import com.omnishop360.backend.web.dto.CheckoutRequest;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.SaleResponse;
import com.omnishop360.backend.web.dto.SaleSearchDto;
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
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/v1/sales")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Sales", description = "API pour la gestion des ventes et transactions")
public class SaleController {

    private final SaleService saleService;

    @PostMapping("/checkout")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Finaliser une vente", 
               description = "Valide un panier, crée la vente et décrémente le stock")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Vente finalisée avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides ou stock insuffisant"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes"),
            @ApiResponse(responseCode = "404", description = "Produit ou boutique non trouvé")
    })
    public ResponseEntity<SaleResponse> checkout(
            @Valid @RequestBody CheckoutRequest request) {
        log.info("Processing checkout with {} items", request.items().size());
        SaleResponse response = saleService.checkout(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin')")
    @Operation(summary = "Lister les ventes", 
               description = "Récupère la liste paginée des ventes de la boutique")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des ventes récupérée avec succès"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<PageResponse<SaleResponse>> getSales(
            @Parameter(description = "Numéro de page (défaut: 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de page (défaut: 20, max: 100)")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Champ de tri (défaut: saleDate,desc)")
            @RequestParam(defaultValue = "saleDate,desc") String sort,
            @Parameter(description = "ID du client")
            @RequestParam(required = false) UUID customerId,
            @Parameter(description = "Recherche par numéro de vente, nom client, email, téléphone")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "Méthode de paiement")
            @RequestParam(required = false) Sale.PaymentMethod paymentMethod,
            @Parameter(description = "Statut de paiement")
            @RequestParam(required = false) Sale.PaymentStatus paymentStatus,
            @Parameter(description = "Statut de la vente")
            @RequestParam(required = false) Sale.SaleStatus status,
            @Parameter(description = "Date de début (format: yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @Parameter(description = "Date de fin (format: yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        int pageSize = Math.min(size, 100);
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && "asc".equalsIgnoreCase(sortParams[1])
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortObj = Sort.by(direction, sortParams[0]);
        Pageable pageable = PageRequest.of(page, pageSize, sortObj);

        SaleSearchDto searchDto = SaleSearchDto.builder()
                .customerId(customerId)
                .keyword(keyword)
                .paymentMethod(paymentMethod)
                .paymentStatus(paymentStatus)
                .status(status)
                .fromDate(fromDate)
                .toDate(toDate)
                .build();

        PageResponse<SaleResponse> response = saleService.getSales(searchDto, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{saleId}")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin')")
    @Operation(summary = "Récupérer une vente par ID", 
               description = "Récupère les détails d'une vente spécifique")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vente récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Vente non trouvée"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<SaleResponse> getSaleById(
            @Parameter(description = "UUID de la vente")
            @PathVariable UUID saleId) {
        log.debug("Fetching sale: {}", saleId);
        SaleResponse response = saleService.getSaleById(saleId);
        return ResponseEntity.ok(response);
    }
}
