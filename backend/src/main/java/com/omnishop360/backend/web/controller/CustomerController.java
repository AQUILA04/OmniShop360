package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.CustomerService;
import com.omnishop360.backend.web.dto.CreateCustomerRequest;
import com.omnishop360.backend.web.dto.CustomerResponse;
import com.omnishop360.backend.web.dto.CustomerSearchDto;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.UpdateCustomerRequest;
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
@RequestMapping("/v1/customers")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Customers", description = "API pour la gestion des clients")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Créer un nouveau client", description = "Permet de créer un nouveau client")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Client créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<CustomerResponse> createCustomer(
            @Valid @RequestBody CreateCustomerRequest request) {
        log.info("Creating customer: {}", request.getEmail());
        CustomerResponse response = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{customerId}")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Modifier un client", description = "Permet de modifier les informations d'un client")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client modifié avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes"),
            @ApiResponse(responseCode = "404", description = "Client non trouvé")
    })
    public ResponseEntity<CustomerResponse> updateCustomer(
            @Parameter(description = "UUID du client")
            @PathVariable UUID customerId,
            @Valid @RequestBody UpdateCustomerRequest request) {
        log.info("Updating customer: {}", customerId);
        CustomerResponse response = customerService.updateCustomer(customerId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{customerId}")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Supprimer un client", description = "Permet de supprimer un client (soft delete)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Client supprimé avec succès"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes"),
            @ApiResponse(responseCode = "404", description = "Client non trouvé")
    })
    public ResponseEntity<Void> deleteCustomer(
            @Parameter(description = "UUID du client")
            @PathVariable UUID customerId) {
        log.info("Deleting customer: {}", customerId);
        customerService.deleteCustomer(customerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Lister tous les clients", description = "Récupère la liste paginée des clients avec recherche avancée")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des clients récupérée avec succès"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<PageResponse<CustomerResponse>> getCustomers(
            Pageable pageable,
            @Parameter(description = "Recherche par mot-clé (nom, prénom, email, téléphone)")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "Filtrer par email")
            @RequestParam(required = false) String email,
            @Parameter(description = "Filtrer par téléphone")
            @RequestParam(required = false) String phone,
            @Parameter(description = "Filtrer par statut actif")
            @RequestParam(required = false) Boolean active) {

        CustomerSearchDto searchDto = new CustomerSearchDto(null, keyword, email, phone, active);
        PageResponse<CustomerResponse> response = customerService.getCustomers(searchDto, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{customerId}")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Récupérer un client par ID", description = "Récupère les détails d'un client spécifique")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client récupéré avec succès"),
            @ApiResponse(responseCode = "404", description = "Client non trouvé"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<CustomerResponse> getCustomerById(
            @Parameter(description = "UUID du client")
            @PathVariable UUID customerId) {
        log.debug("Fetching customer: {}", customerId);
        CustomerResponse response = customerService.getCustomerById(customerId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/walk-in")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Récupérer ou créer le client divers")
    public ResponseEntity<CustomerResponse> getOrCreateWalkInCustomer() {
        return ResponseEntity.ok(customerService.getOrCreateWalkInCustomer());
    }
}
