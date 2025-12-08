package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.TenantStatus;
import com.omnishop360.backend.domain.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TenantResponse Tests")
class TenantResponseTest {

    @Test
    @DisplayName("Should create TenantResponse from Tenant with admins")
    void shouldCreateTenantResponseFromTenantWithAdmins() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        tenant.setCompanyName("ACME Corp");
        tenant.setContactEmail("contact@acme.com");
        tenant.setStatus(TenantStatus.ACTIVE);
        tenant.setCreatedAt(LocalDateTime.now());
        tenant.setUpdatedAt(LocalDateTime.now());

        User admin1 = new User();
        admin1.setId(UUID.randomUUID());
        admin1.setFirstName("John");
        admin1.setLastName("Doe");
        admin1.setEmail("john@acme.com");

        User admin2 = new User();
        admin2.setId(UUID.randomUUID());
        admin2.setFirstName("Jane");
        admin2.setLastName("Smith");
        admin2.setEmail("jane@acme.com");

        List<User> admins = List.of(admin1, admin2);
        tenant.setAdmins(admins);

        TenantResponse response = TenantResponse.from(tenant);

        assertNotNull(response);
        assertEquals(tenant.getId(), response.getId());
        assertEquals("ACME Corp", response.getCompanyName());
        assertEquals("contact@acme.com", response.getContactEmail());
        assertEquals(TenantStatus.ACTIVE, response.getStatus());
        assertNotNull(response.getAdmin());
        assertEquals("john@acme.com", response.getAdmin().getEmail());
        assertEquals(2, response.getAdmins().size());
        assertEquals(2, response.getAdminCount());
        assertNotNull(response.getShops());
        assertEquals(0, response.getShopCount());
    }

    @Test
    @DisplayName("Should create TenantResponse from Tenant without admins")
    void shouldCreateTenantResponseFromTenantWithoutAdmins() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        tenant.setCompanyName("ACME Corp");
        tenant.setContactEmail("contact@acme.com");
        tenant.setStatus(TenantStatus.ACTIVE);
        tenant.setCreatedAt(LocalDateTime.now());
        tenant.setUpdatedAt(LocalDateTime.now());
        tenant.setAdmins(new ArrayList<>());

        TenantResponse response = TenantResponse.from(tenant);

        assertNotNull(response);
        assertEquals(tenant.getId(), response.getId());
        assertNull(response.getAdmin());
        assertNull(response.getAdmins());
        assertEquals(0, response.getAdminCount());
    }

    @Test
    @DisplayName("Should return null when Tenant is null")
    void shouldReturnNullWhenTenantIsNull() {
        TenantResponse response = TenantResponse.from((Tenant) null);
        assertNull(response);
    }

    @Test
    @DisplayName("Should create TenantResponse from Tenant and AdminUserResponse")
    void shouldCreateTenantResponseFromTenantAndAdmin() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        tenant.setCompanyName("ACME Corp");
        tenant.setContactEmail("contact@acme.com");
        tenant.setStatus(TenantStatus.ACTIVE);
        tenant.setCreatedAt(LocalDateTime.now());
        tenant.setUpdatedAt(LocalDateTime.now());
        tenant.setAdmins(new ArrayList<>());

        User admin = new User();
        admin.setId(UUID.randomUUID());
        admin.setFirstName("John");
        admin.setLastName("Doe");
        admin.setEmail("john@acme.com");

        AdminUserResponse adminResponse = AdminUserResponse.from(admin);
        TenantResponse response = TenantResponse.from(tenant, adminResponse);

        assertNotNull(response);
        assertEquals(tenant.getId(), response.getId());
        assertNotNull(response.getAdmin());
        assertEquals("john@acme.com", response.getAdmin().getEmail());
        assertEquals(1, response.getAdminCount());
    }

    @Test
    @DisplayName("Should handle null AdminUserResponse")
    void shouldHandleNullAdminUserResponse() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        tenant.setCompanyName("ACME Corp");
        tenant.setContactEmail("contact@acme.com");
        tenant.setStatus(TenantStatus.ACTIVE);
        tenant.setCreatedAt(LocalDateTime.now());
        tenant.setUpdatedAt(LocalDateTime.now());
        tenant.setAdmins(new ArrayList<>());

        TenantResponse response = TenantResponse.from(tenant, null);

        assertNotNull(response);
        assertNull(response.getAdmin());
    }

    @Test
    @DisplayName("Should handle null Tenant when creating with AdminUserResponse")
    void shouldHandleNullTenantWhenCreatingWithAdmin() {
        User admin = new User();
        admin.setId(UUID.randomUUID());
        admin.setFirstName("John");
        admin.setLastName("Doe");
        admin.setEmail("john@acme.com");

        AdminUserResponse adminResponse = AdminUserResponse.from(admin);
        TenantResponse response = TenantResponse.from(null, adminResponse);

        assertNull(response);
    }
}

