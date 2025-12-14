package com.omnishop360.backend.web.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("HealthController Tests")
class HealthControllerTest {

    private final HealthController healthController = new HealthController();

    @Test
    @DisplayName("Should return health status UP")
    void shouldReturnHealthStatusUp() {
        ResponseEntity<Map<String, String>> response = healthController.health();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
        assertEquals("OmniShop360 API is running", response.getBody().get("message"));
    }

    @Test
    @DisplayName("Should return response with correct structure")
    void shouldReturnResponseWithCorrectStructure() {
        ResponseEntity<Map<String, String>> response = healthController.health();

        assertNotNull(response);
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("status"));
        assertTrue(response.getBody().containsKey("message"));
        assertEquals(2, response.getBody().size());
    }
}

