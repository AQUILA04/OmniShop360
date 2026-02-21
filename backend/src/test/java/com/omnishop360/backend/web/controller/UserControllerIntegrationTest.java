package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.entity.Shop;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.User;
import com.omnishop360.backend.domain.repository.ShopRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.domain.repository.UserRepository;
import com.omnishop360.backend.domain.service.UserContextService;
import com.omnishop360.backend.infrastructure.adapter.KeycloakAdapter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("UserController Integration Tests")
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private UserContextService userContextService;

    @MockBean
    private KeycloakAdapter keycloakAdapter;

    private Tenant tenant;
    private User tenantAdmin;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        shopRepository.deleteAll();
        tenantRepository.deleteAll();

        tenant = new Tenant();
        tenant.setCompanyName("Test Company");
        tenant.setContactEmail("contact@test.com");
        tenant.setCode("TEST");
        tenant.setActive(true);
        tenant.setDeleted(false);
        tenant = tenantRepository.save(tenant);

        tenantAdmin = new User();
        tenantAdmin.setTenant(tenant);
        tenantAdmin.setFirstName("Admin");
        tenantAdmin.setLastName("User");
        tenantAdmin.setEmail("admin@test.com");
        tenantAdmin.setKeycloakId("keycloak-admin-id");
        tenantAdmin.setActive(true);
        tenantAdmin.setDeleted(false);
        tenantAdmin = userRepository.save(tenantAdmin);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenant.getId());
        when(keycloakAdapter.getRealmRoleNames(anyString())).thenReturn(java.util.List.of("tenant_admin"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("GET /v1/users should return users for tenant admin")
    void shouldReturnUsersForTenantAdmin() throws Exception {
        mockMvc.perform(get("/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].email").value("admin@test.com"))
                .andExpect(jsonPath("$.content[0].firstName").value("Admin"))
                .andExpect(jsonPath("$.content[0].tenantCompanyName").value("Test Company"))
                .andExpect(jsonPath("$.content[0].role").value("tenant_admin"))
                .andExpect(jsonPath("$.page").exists())
                .andExpect(jsonPath("$.page.totalElements").value(1));
    }

    @Test
    @WithMockUser(authorities = "ROLE_superadmin")
    @DisplayName("GET /v1/users should return all users for superadmin")
    void shouldReturnAllUsersForSuperadmin() throws Exception {
        mockMvc.perform(get("/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.page").exists());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("GET /v1/users should return 403 for user without tenant_admin or superadmin role")
    void shouldReturn403ForUnauthorizedUser() throws Exception {
        mockMvc.perform(get("/v1/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ROLE_shop_admin", username = "keycloak-shop-admin-id")
    @DisplayName("GET /v1/users should return only users of the shop for shop_admin")
    void shouldReturnOnlyShopUsersForShopAdmin() throws Exception {
        Shop shop = new Shop();
        shop.setTenant(tenant);
        shop.setName("Test Shop");
        shop.setCode("SHOP1");
        shop.setAddress("1 Test St");
        shop.setActive(true);
        shop.setDeleted(false);
        shop = shopRepository.save(shop);

        User shopUser = new User();
        shopUser.setTenant(tenant);
        shopUser.setShop(shop);
        shopUser.setFirstName("Shop");
        shopUser.setLastName("User");
        shopUser.setEmail("shopuser@test.com");
        shopUser.setKeycloakId("keycloak-shop-user-id");
        shopUser.setActive(true);
        shopUser.setDeleted(false);
        userRepository.save(shopUser);

        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shop.getId()));
        when(keycloakAdapter.getRealmRoleNames("keycloak-shop-user-id")).thenReturn(java.util.List.of("cashier"));

        mockMvc.perform(get("/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].email").value("shopuser@test.com"))
                .andExpect(jsonPath("$.content[0].shopId").value(shop.getId().toString()))
                .andExpect(jsonPath("$.page.totalElements").value(1));
    }
}
