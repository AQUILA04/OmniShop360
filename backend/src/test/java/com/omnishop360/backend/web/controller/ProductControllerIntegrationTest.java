package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.entity.Category;
import com.omnishop360.backend.domain.entity.Product;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.User;
import com.omnishop360.backend.domain.repository.CategoryRepository;
import com.omnishop360.backend.domain.repository.ProductRepository;
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

import java.math.BigDecimal;

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
@DisplayName("ProductController Integration Tests")
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private ProductRepository productRepository;

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
        productRepository.deleteAll();
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
        category.setActive(true);
        category.setDeleted(false);
        category = categoryRepository.save(category);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenant.getId());
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("POST /v1/products should create product successfully")
    void shouldCreateProductSuccessfully() throws Exception {
        String requestBody = """
                {
                  "name": "Test Product",
                  "sku": "TEST-SKU-001",
                  "description": "Test Description",
                  "costPrice": 10.00,
                  "sellingPrice": 20.00,
                  "taxRate": 20.00,
                  "unit": "UNIT"
                }
                """;

        mockMvc.perform(post("/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Test Product"))
                .andExpect(jsonPath("$.sku").value("TEST-SKU-001"))
                .andExpect(jsonPath("$.costPrice").value(10.00))
                .andExpect(jsonPath("$.sellingPrice").value(20.00));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("POST /v1/products should create product with category successfully")
    void shouldCreateProductWithCategorySuccessfully() throws Exception {
        String requestBody = String.format("""
                {
                  "name": "Test Product",
                  "sku": "TEST-SKU-002",
                  "description": "Test Description",
                  "categoryId": "%s",
                  "costPrice": 10.00,
                  "sellingPrice": 20.00,
                  "taxRate": 20.00,
                  "unit": "UNIT"
                }
                """, category.getId());

        mockMvc.perform(post("/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.categoryId").value(category.getId().toString()))
                .andExpect(jsonPath("$.categoryName").value("Test Category"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("POST /v1/products should return 400 for invalid request")
    void shouldReturn400ForInvalidRequest() throws Exception {
        String requestBody = """
                {
                  "name": "A",
                  "sku": "",
                  "sellingPrice": -10.00
                }
                """;

        mockMvc.perform(post("/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("GET /v1/products should return paginated list")
    void shouldReturnPaginatedList() throws Exception {
        Product product = new Product();
        product.setTenant(tenant);
        product.setName("Test Product");
        product.setSku("TEST-SKU-001");
        product.setSellingPrice(new BigDecimal("20.00"));
        product.setCostPrice(new BigDecimal("10.00"));
        product.setTaxRate(new BigDecimal("20.00"));
        product.setUnit("UNIT");
        product.setActive(true);
        product.setDeleted(false);
        productRepository.save(product);

        mockMvc.perform(get("/v1/products")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.page").exists());
    }

    @Test
    @WithMockUser(authorities = "ROLE_shop_admin", username = "keycloak-admin-id")
    @DisplayName("GET /v1/products should hide costPrice for shop_admin")
    void shouldHideCostPriceForShopAdmin() throws Exception {
        Product product = new Product();
        product.setTenant(tenant);
        product.setName("Test Product");
        product.setSku("TEST-SKU-001");
        product.setSellingPrice(new BigDecimal("20.00"));
        product.setCostPrice(new BigDecimal("10.00"));
        product.setTaxRate(new BigDecimal("20.00"));
        product.setUnit("UNIT");
        product.setActive(true);
        product.setDeleted(false);
        product = productRepository.save(product);

        mockMvc.perform(get("/v1/products/" + product.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.costPrice").isEmpty());
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("PUT /v1/products/{id} should update product and return 200")
    void shouldUpdateProductAndReturn200() throws Exception {
        Product product = new Product();
        product.setTenant(tenant);
        product.setName("Test Product");
        product.setSku("TEST-SKU-001");
        product.setSellingPrice(new BigDecimal("20.00"));
        product.setCostPrice(new BigDecimal("10.00"));
        product.setTaxRate(new BigDecimal("20.00"));
        product.setUnit("UNIT");
        product.setActive(true);
        product.setDeleted(false);
        product = productRepository.save(product);

        String requestBody = """
                {
                  "name": "Updated Product",
                  "sku": "UPD-SKU-001",
                  "description": "Updated",
                  "costPrice": 15.00,
                  "sellingPrice": 25.00,
                  "taxRate": 20.00,
                  "unit": "UNIT",
                  "active": true
                }
                """;

        mockMvc.perform(put("/v1/products/" + product.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Product"))
                .andExpect(jsonPath("$.sku").value("UPD-SKU-001"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin", username = "keycloak-admin-id")
    @DisplayName("PUT /v1/products/{id} should return 404 for non-existent product")
    void shouldReturn404WhenUpdateNonExistentProduct() throws Exception {
        String requestBody = """
                {
                  "name": "Valid Product",
                  "sku": "SKU1",
                  "sellingPrice": 1.00
                }
                """;

        mockMvc.perform(put("/v1/products/00000000-0000-0000-0000-000000000000")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isNotFound());
    }
}

