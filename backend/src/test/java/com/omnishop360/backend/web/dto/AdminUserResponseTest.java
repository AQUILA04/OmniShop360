package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AdminUserResponse Tests")
class AdminUserResponseTest {

    @Test
    @DisplayName("Should create AdminUserResponse from User")
    void shouldCreateAdminUserResponseFromUser() {
        User user = new User();
        UUID userId = UUID.randomUUID();
        user.setId(userId);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@acme.com");
        user.setKeycloakId("keycloak-id-123");

        AdminUserResponse response = AdminUserResponse.from(user);

        assertNotNull(response);
        assertEquals(userId, response.getId());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertEquals("john.doe@acme.com", response.getEmail());
        assertEquals("keycloak-id-123", response.getKeycloakId());
    }

    @Test
    @DisplayName("Should return null when User is null")
    void shouldReturnNullWhenUserIsNull() {
        AdminUserResponse response = AdminUserResponse.from(null);
        assertNull(response);
    }
}

