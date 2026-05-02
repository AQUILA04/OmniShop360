package com.omnishop360.backend.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.domain.repository.UserRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = com.omnishop360.backend.OmniShop360BackendApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("TenantController Integration Tests")
class TenantControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private KeycloakAdapter keycloakAdapter;

    @BeforeEach
    void setUp() {
        tenantRepository.deleteAll();
        userRepository.deleteAll();
        when(keycloakAdapter.createUser(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(UUID.randomUUID().toString());
    }

    @Test
    @WithMockUser(authorities = "ROLE_superadmin")
    @DisplayName("POST /v1/tenants should create tenant successfully")
    void shouldCreateTenantSuccessfully() throws Exception {
        String requestBody = """
                {
                  "companyName": "ACME Corporation",
                  "contactEmail": "contact@acme.com",
                  "adminFirstName": "John",
                  "adminLastName": "Doe",
                  "adminEmail": "john.doe@acme.com"
                }
                """;

        mockMvc.perform(post("/v1/tenants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.companyName").value("ACME Corporation"))
                .andExpect(jsonPath("$.contactEmail").value("contact@acme.com"))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.admin").exists())
                .andExpect(jsonPath("$.admin.email").value("john.doe@acme.com"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_superadmin")
    @DisplayName("POST /v1/tenants should return 400 for invalid request")
    void shouldReturn400ForInvalidRequest() throws Exception {
        String requestBody = """
                {
                  "companyName": "A",
                  "contactEmail": "invalid-email",
                  "adminFirstName": "J",
                  "adminLastName": "D",
                  "adminEmail": "invalid"
                }
                """;

        mockMvc.perform(post("/v1/tenants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("POST /v1/tenants should return 403 for non-superadmin user")
    void shouldReturn403ForNonSuperadminUser() throws Exception {
        String requestBody = """
                {
                  "companyName": "ACME Corporation",
                  "contactEmail": "contact@acme.com",
                  "adminFirstName": "John",
                  "adminLastName": "Doe",
                  "adminEmail": "john.doe@acme.com"
                }
                """;

        mockMvc.perform(post("/v1/tenants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ROLE_superadmin")
    @DisplayName("GET /v1/tenants should return paginated list")
    void shouldReturnPaginatedList() throws Exception {
        mockMvc.perform(get("/v1/tenants")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.page").exists())
                .andExpect(jsonPath("$.page.size").value(20))
                .andExpect(jsonPath("$.page.number").value(0));
    }

    @Test
    @WithMockUser(authorities = "ROLE_superadmin")
    @DisplayName("GET /v1/tenants/{id} should return 404 for non-existent tenant")
    void shouldReturn404ForNonExistentTenant() throws Exception {
        mockMvc.perform(get("/v1/tenants/00000000-0000-0000-0000-000000000000"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_superadmin")
    @DisplayName("PUT /v1/tenants/{id} should update tenant and return 200")
    void shouldUpdateTenantAndReturn200() throws Exception {
        String createBody = """
                {
                  "companyName": "ACME Corporation",
                  "contactEmail": "contact@acme.com",
                  "adminFirstName": "John",
                  "adminLastName": "Doe",
                  "adminEmail": "john.doe@acme.com"
                }
                """;
        String createResult = mockMvc.perform(post("/v1/tenants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String tenantId = objectMapper.readTree(createResult).get("id").asText();

        String updateBody = """
                {
                  "companyName": "ACME Updated",
                  "contactEmail": "updated@acme.com"
                }
                """;
        mockMvc.perform(put("/v1/tenants/" + tenantId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName").value("ACME Updated"))
                .andExpect(jsonPath("$.contactEmail").value("updated@acme.com"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_superadmin")
    @DisplayName("PUT /v1/tenants/{id} should return 404 for non-existent tenant")
    void shouldReturn404WhenUpdateNonExistentTenant() throws Exception {
        String body = "{\"companyName\": \"ACME\", \"contactEmail\": \"a@b.com\"}";
        mockMvc.perform(put("/v1/tenants/00000000-0000-0000-0000-000000000000")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(authorities = "ROLE_superadmin")
    @DisplayName("PATCH /v1/tenants/{id}/status should update status and return 200")
    void shouldUpdateTenantStatusAndReturn200() throws Exception {
        String createBody = """
                {
                  "companyName": "ACME Corporation",
                  "contactEmail": "contact@acme.com",
                  "adminFirstName": "John",
                  "adminLastName": "Doe",
                  "adminEmail": "john.doe@acme.com"
                }
                """;
        String createResult = mockMvc.perform(post("/v1/tenants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String tenantId = objectMapper.readTree(createResult).get("id").asText();

        mockMvc.perform(patch("/v1/tenants/" + tenantId + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"SUSPENDED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUSPENDED"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_superadmin")
    @DisplayName("DELETE /v1/tenants/{id} should return 204")
    void shouldDeleteTenantAndReturn204() throws Exception {
        String createBody = """
                {
                  "companyName": "ACME Corporation",
                  "contactEmail": "contact@acme.com",
                  "adminFirstName": "John",
                  "adminLastName": "Doe",
                  "adminEmail": "john.doe@acme.com"
                }
                """;
        String createResult = mockMvc.perform(post("/v1/tenants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String tenantId = objectMapper.readTree(createResult).get("id").asText();

        mockMvc.perform(delete("/v1/tenants/" + tenantId))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(authorities = "ROLE_superadmin")
    @DisplayName("DELETE /v1/tenants/{id} should return 404 for non-existent tenant")
    void shouldReturn404WhenDeleteNonExistentTenant() throws Exception {
        mockMvc.perform(delete("/v1/tenants/00000000-0000-0000-0000-000000000000"))
                .andExpect(status().isNotFound());
    }
}

