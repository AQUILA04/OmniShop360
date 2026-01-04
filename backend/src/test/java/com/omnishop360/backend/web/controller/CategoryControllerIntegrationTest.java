package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.entity.Category;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.User;
import com.omnishop360.backend.domain.repository.CategoryRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.domain.repository.UserRepository;
import com.omnishop360.backend.domain.service.UserContextService;
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

import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("CategoryController Integration Tests")
class CategoryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private UserContextService userContextService;

    private Tenant tenant;
    private User tenantAdmin;
    private Category category;

    @BeforeEach
    void setUp() {
        categoryRepository.deleteAll();
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

        category = new Category();
        category.setTenant(tenant);
        category.setName("Test Category");
        category.setCode("CAT1");
        category.setDescription("Test Description");
        category.setActive(true);
        category.setDeleted(false);
        category = categoryRepository.save(category);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenant.getId());
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("POST /v1/categories should create category successfully")
    void shouldCreateCategorySuccessfully() throws Exception {
        String requestBody = """
                {
                  "name": "New Category",
                  "code": "NEW-CAT",
                  "description": "New Category Description"
                }
                """;

        mockMvc.perform(post("/v1/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("New Category"))
                .andExpect(jsonPath("$.code").value("NEW-CAT"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("POST /v1/categories should create category with parent successfully")
    void shouldCreateCategoryWithParentSuccessfully() throws Exception {
        String requestBody = String.format("""
                {
                  "name": "Sub Category",
                  "code": "SUB-CAT",
                  "description": "Sub Category Description",
                  "parentId": "%s"
                }
                """, category.getId());

        mockMvc.perform(post("/v1/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.parentId").value(category.getId().toString()))
                .andExpect(jsonPath("$.parentName").value("Test Category"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("POST /v1/categories should return 400 for invalid request")
    void shouldReturn400ForInvalidRequest() throws Exception {
        String requestBody = """
                {
                  "name": "A",
                  "code": ""
                }
                """;

        mockMvc.perform(post("/v1/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("GET /v1/categories should return all categories")
    void shouldReturnAllCategories() throws Exception {
        mockMvc.perform(get("/v1/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("Test Category"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("GET /v1/categories/{id} should return category details")
    void shouldReturnCategoryDetails() throws Exception {
        mockMvc.perform(get("/v1/categories/" + category.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(category.getId().toString()))
                .andExpect(jsonPath("$.name").value("Test Category"))
                .andExpect(jsonPath("$.code").value("CAT1"));
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("POST /v1/categories should return 403 for non-tenant-admin user")
    void shouldReturn403ForNonTenantAdminUser() throws Exception {
        String requestBody = """
                {
                  "name": "New Category",
                  "code": "NEW-CAT"
                }
                """;

        mockMvc.perform(post("/v1/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isForbidden());
    }
}

