package com.omnishop360.backend.infrastructure.adapter;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("KeycloakAdapter Tests")
class KeycloakAdapterTest {

    @Test
    @DisplayName("Should initialize KeycloakAdapter with default values")
    void shouldInitializeKeycloakAdapterWithDefaultValues() {
        KeycloakAdapter adapter = new KeycloakAdapter(
                "http://localhost:8080",
                "test-realm",
                "test-client",
                "test-secret"
        );

        assertNotNull(adapter);
    }

    @Test
    @DisplayName("Should initialize KeycloakAdapter with empty client secret")
    void shouldInitializeKeycloakAdapterWithEmptyClientSecret() {
        KeycloakAdapter adapter = new KeycloakAdapter(
                "http://localhost:8080",
                "test-realm",
                "test-client",
                ""
        );

        assertNotNull(adapter);
    }
}

