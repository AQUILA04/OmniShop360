package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.ProductService;
import com.omnishop360.backend.web.dto.CreateProductRequest;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.ProductResponse;
import com.omnishop360.backend.web.dto.UpdateProductRequest;
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
@RequestMapping("/v1/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Products", description = "API pour la gestion du catalogue de produits")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('tenant_admin')")
    @Operation(summary = "Créer un nouveau produit", description = "Permet au Tenant Admin de créer un produit dans le catalogue maître")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Produit créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request) {
        log.info("Creating product: {}", request.getName());
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'stock_manager')")
    @Operation(summary = "Lister tous les produits", description = "Récupère la liste paginée des produits du catalogue maître")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des produits récupérée avec succès"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<PageResponse<ProductResponse>> getAllProducts(
            @Parameter(description = "Numéro de page (défaut: 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de page (défaut: 20, max: 100)")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Champ de tri (défaut: createdAt,desc)")
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @Parameter(description = "Recherche par nom ou SKU")
            @RequestParam(required = false) String search) {

        int pageSize = Math.min(size, 100);
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && "asc".equalsIgnoreCase(sortParams[1])
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortObj = Sort.by(direction, sortParams[0]);

        Pageable pageable = PageRequest.of(page, pageSize, sortObj);
        PageResponse<ProductResponse> response = productService.getAllProducts(pageable, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{productId}")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'stock_manager')")
    @Operation(summary = "Récupérer un produit par ID", description = "Récupère les détails d'un produit spécifique")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Produit récupéré avec succès"),
            @ApiResponse(responseCode = "404", description = "Produit non trouvé"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<ProductResponse> getProductById(
            @Parameter(description = "UUID du produit")
            @PathVariable UUID productId) {
        log.debug("Fetching product: {}", productId);
        ProductResponse response = productService.getProductById(productId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('tenant_admin')")
    @Operation(summary = "Modifier un produit", description = "Met à jour les informations d'un produit du catalogue")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Produit modifié avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes"),
            @ApiResponse(responseCode = "404", description = "Produit non trouvé")
    })
    public ResponseEntity<ProductResponse> updateProduct(
            @Parameter(description = "UUID du produit") @PathVariable UUID productId,
            @Valid @RequestBody UpdateProductRequest request) {
        log.info("Updating product: {}", productId);
        ProductResponse response = productService.updateProduct(productId, request);
        return ResponseEntity.ok(response);
    }
}

