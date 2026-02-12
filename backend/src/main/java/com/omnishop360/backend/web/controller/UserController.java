package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.UserService;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.UserResponse;
import com.omnishop360.backend.web.dto.UserSearchDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Users", description = "API pour la gestion des utilisateurs")
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('superadmin', 'tenant_admin')")
    @Operation(summary = "Lister les utilisateurs",
               description = "Récupère la liste paginée des utilisateurs. Superadmin voit tous les utilisateurs, Tenant Admin voit ceux de son tenant.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des utilisateurs récupérée avec succès"),
            @ApiResponse(responseCode = "403", description = "Permissions insuffisantes")
    })
    public ResponseEntity<PageResponse<UserResponse>> getUsers(
            Pageable pageable,
            @Parameter(description = "Recherche par mot-clé (prénom, nom, email)")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "Filtrer par email")
            @RequestParam(required = false) String email,
            @Parameter(description = "Filtrer par statut actif")
            @RequestParam(required = false) Boolean active,
            @Parameter(description = "Filtrer par tenant (superadmin uniquement)")
            @RequestParam(required = false) UUID tenantId,
            @Parameter(description = "Filtrer par boutique")
            @RequestParam(required = false) UUID shopId) {

        UserSearchDto searchDto = UserSearchDto.builder()
                .keyword(keyword)
                .email(email)
                .active(active)
                .tenantId(tenantId)
                .shopId(shopId)
                .build();

        PageResponse<UserResponse> response = userService.getUsers(searchDto, pageable);
        return ResponseEntity.ok(response);
    }
}
