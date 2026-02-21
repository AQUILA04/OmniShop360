package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Shop;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("UserResponse Tests")
class UserResponseTest {

    @Test
    @DisplayName("Should create UserResponse from User entity")
    void shouldCreateUserResponseFromUser() {
        UUID tenantId = UUID.randomUUID();
        UUID shopId = UUID.randomUUID();
        Tenant tenant = new Tenant();
        tenant.setId(tenantId);
        tenant.setCompanyName("ACME Corp");
        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setName("Shop Paris");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setTenant(tenant);
        user.setShop(shop);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@test.com");
        user.setKeycloakId("keycloak-123");
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        UserResponse response = UserResponse.from(user);

        assertNotNull(response);
        assertEquals(user.getId(), response.getId());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertEquals("john.doe@test.com", response.getEmail());
        assertEquals("keycloak-123", response.getKeycloakId());
        assertTrue(response.getActive());
        assertEquals(tenantId, response.getTenantId());
        assertEquals("ACME Corp", response.getTenantCompanyName());
        assertEquals(shopId, response.getShopId());
        assertEquals("Shop Paris", response.getShopName());
        assertEquals(user.getCreatedAt(), response.getCreatedAt());
    }

    @Test
    @DisplayName("Should create UserResponse from User without shop")
    void shouldCreateUserResponseFromUserWithoutShop() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        tenant.setCompanyName("ACME Corp");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setTenant(tenant);
        user.setShop(null);
        user.setFirstName("Jane");
        user.setLastName("Smith");
        user.setEmail("jane@test.com");
        user.setKeycloakId("keycloak-456");
        user.setActive(true);

        UserResponse response = UserResponse.from(user);

        assertNotNull(response);
        assertEquals("Jane", response.getFirstName());
        assertNull(response.getShopId());
        assertNull(response.getShopName());
    }

    @Test
    @DisplayName("Should return null when User is null")
    void shouldReturnNullWhenUserIsNull() {
        UserResponse response = UserResponse.from(null);
        assertNull(response);
    }

    @Test
    @DisplayName("Should create UserResponse with role when from(User, role) is used")
    void shouldCreateUserResponseWithRole() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        tenant.setCompanyName("ACME Corp");
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setTenant(tenant);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john@test.com");
        user.setKeycloakId("keycloak-789");
        user.setActive(true);

        UserResponse response = UserResponse.from(user, "tenant_admin");

        assertNotNull(response);
        assertEquals("tenant_admin", response.getRole());
        assertEquals("John", response.getFirstName());
    }

    @Test
    @DisplayName("Should create UserResponse with null role when from(User) is used")
    void shouldCreateUserResponseWithNullRoleWhenFromUserOnly() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setTenant(tenant);
        user.setFirstName("Jane");
        user.setEmail("jane@test.com");
        user.setKeycloakId("keycloak-999");

        UserResponse response = UserResponse.from(user);

        assertNotNull(response);
        assertNull(response.getRole());
    }
}
