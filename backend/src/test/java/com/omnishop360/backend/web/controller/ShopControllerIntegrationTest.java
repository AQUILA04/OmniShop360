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
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("ShopController Integration Tests")
class ShopControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private KeycloakAdapter keycloakAdapter;

    @MockBean
    private UserContextService userContextService;

    private Tenant tenant;
    private User tenantAdmin;

    @BeforeEach
    void setUp() {
        shopRepository.deleteAll();
        userRepository.deleteAll();
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

        when(keycloakAdapter.createUser(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(UUID.randomUUID().toString());
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenant.getId());
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("POST /v1/shops should create shop successfully")
    void shouldCreateShopSuccessfully() throws Exception {
        String requestBody = """
                {
                  "name": "Test Shop",
                  "address": "123 Test Street",
                  "city": "Test City",
                  "postalCode": "12345",
                  "country": "Test Country",
                  "phone": "123456789",
                  "email": "shop@test.com"
                }
                """;

        mockMvc.perform(post("/v1/shops")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Test Shop"))
                .andExpect(jsonPath("$.code").exists())
                .andExpect(jsonPath("$.address").value("123 Test Street"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("POST /v1/shops should return 400 for invalid request")
    void shouldReturn400ForInvalidRequest() throws Exception {
        String requestBody = """
                {
                  "name": "A",
                  "address": "123"
                }
                """;

        mockMvc.perform(post("/v1/shops")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("POST /v1/shops should return 403 for non-tenant-admin user")
    void shouldReturn403ForNonTenantAdminUser() throws Exception {
        String requestBody = """
                {
                  "name": "Test Shop",
                  "address": "123 Test Street"
                }
                """;

        mockMvc.perform(post("/v1/shops")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("GET /v1/shops should return paginated list")
    void shouldReturnPaginatedList() throws Exception {
        Shop shop = new Shop();
        shop.setTenant(tenant);
        shop.setName("Test Shop");
        shop.setCode("SHOP1");
        shop.setAddress("123 Test Street");
        shop.setActive(true);
        shop.setDeleted(false);
        shopRepository.save(shop);

        mockMvc.perform(get("/v1/shops")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.page").exists())
                .andExpect(jsonPath("$.page.size").value(20))
                .andExpect(jsonPath("$.page.number").value(0));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("GET /v1/shops/{id} should return shop details")
    void shouldReturnShopDetails() throws Exception {
        Shop shop = new Shop();
        shop.setTenant(tenant);
        shop.setName("Test Shop");
        shop.setCode("SHOP1");
        shop.setAddress("123 Test Street");
        shop.setActive(true);
        shop.setDeleted(false);
        shop = shopRepository.save(shop);

        mockMvc.perform(get("/v1/shops/" + shop.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(shop.getId().toString()))
                .andExpect(jsonPath("$.name").value("Test Shop"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("POST /v1/shops/{shopId}/stock-managers should create stock manager successfully")
    void shouldCreateStockManagerSuccessfully() throws Exception {
        Shop shop = new Shop();
        shop.setTenant(tenant);
        shop.setName("Test Shop");
        shop.setCode("SHOP1");
        shop.setAddress("123 Test Street");
        shop.setActive(true);
        shop.setDeleted(false);
        shop = shopRepository.save(shop);

        when(userContextService.getCurrentUserShopId()).thenReturn(java.util.Optional.empty());

        String requestBody = """
                {
                  "firstName": "Pierre",
                  "lastName": "Leroy",
                  "email": "pierre.leroy@test.com"
                }
                """;

        mockMvc.perform(post("/v1/shops/" + shop.getId() + "/stock-managers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.firstName").value("Pierre"))
                .andExpect(jsonPath("$.lastName").value("Leroy"))
                .andExpect(jsonPath("$.email").value("pierre.leroy@test.com"))
                .andExpect(jsonPath("$.keycloakId").exists());
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("PUT /v1/shops/{id} should update shop and return 200")
    void shouldUpdateShopAndReturn200() throws Exception {
        Shop shop = new Shop();
        shop.setTenant(tenant);
        shop.setName("Test Shop");
        shop.setCode("SHOP1");
        shop.setAddress("123 Test Street");
        shop.setActive(true);
        shop.setDeleted(false);
        shop = shopRepository.save(shop);

        String requestBody = """
                {
                  "name": "Updated Shop",
                  "address": "456 New Street",
                  "city": "New City",
                  "postalCode": "99999",
                  "country": "New Country",
                  "phone": "999",
                  "email": "updated@shop.com"
                }
                """;

        mockMvc.perform(put("/v1/shops/" + shop.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Shop"))
                .andExpect(jsonPath("$.address").value("456 New Street"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("PUT /v1/shops/{id} should return 404 for non-existent shop")
    void shouldReturn404WhenUpdateNonExistentShop() throws Exception {
        String requestBody = """
                {
                  "name": "Valid Shop",
                  "address": "12345 Address"
                }
                """;

        mockMvc.perform(put("/v1/shops/00000000-0000-0000-0000-000000000000")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isNotFound());
    }
}

