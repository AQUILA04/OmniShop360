package com.omnishop360.backend.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Contrôleur de santé de l'API
 * 
 * Exemple d'utilisation des annotations Swagger/OpenAPI
 */
@RestController
@RequestMapping("/v1/public/health")
@Tag(name = "Health", description = "Endpoints de santé de l'API")
public class HealthController {

    @GetMapping
    @Operation(
        summary = "Vérifier le statut de l'API",
        description = "Retourne le statut de santé de l'API. Cet endpoint est public et ne nécessite pas d'authentification."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "API opérationnelle",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Map.class)
            )
        )
    })
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "OmniShop360 API is running"
        ));
    }
}

