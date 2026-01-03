package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.CategoryService;
import com.omnishop360.backend.web.dto.CategoryResponse;
import com.omnishop360.backend.web.dto.CreateCategoryRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/categories")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Categories", description = "API pour la gestion des catégories de produits")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('tenant_admin')")
    @Operation(summary = "Créer une nouvelle catégorie", description = "Permet au Tenant Admin de créer une nouvelle catégorie")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Catégorie créée avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CreateCategoryRequest request) {
        log.info("Creating category: {}", request.getName());
        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin')")
    @Operation(summary = "Lister toutes les catégories", description = "Récupère la liste de toutes les catégories du tenant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des catégories récupérée avec succès"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> response = categoryService.getAllCategories();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{categoryId}")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin')")
    @Operation(summary = "Récupérer une catégorie par ID", description = "Récupère les détails d'une catégorie spécifique")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Catégorie récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Catégorie non trouvée"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<CategoryResponse> getCategoryById(
            @Parameter(description = "UUID de la catégorie")
            @PathVariable UUID categoryId) {
        log.debug("Fetching category: {}", categoryId);
        CategoryResponse response = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(response);
    }
}

