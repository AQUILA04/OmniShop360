package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.AuditLogService;
import com.omnishop360.backend.web.dto.AuditLogEntry;
import com.omnishop360.backend.web.dto.PageResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("AuditLogController Integration Tests")
class AuditLogControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuditLogService auditLogService;

    @Test
    @WithMockUser(authorities = "ROLE_tenant_admin")
    @DisplayName("GET /v1/audit-logs should return 200 for tenant_admin")
    void shouldReturn200ForTenantAdmin() throws Exception {
        when(auditLogService.getAuditLogs(any(), any())).thenReturn(
                PageResponse.<AuditLogEntry>builder()
                        .content(List.of())
                        .page(new com.omnishop360.backend.web.dto.PageResponse.PageInfo(20, 0, 0L, 0))
                        .build());

        mockMvc.perform(get("/v1/audit-logs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.page").exists());
    }

    @Test
    @WithMockUser(authorities = "ROLE_superadmin")
    @DisplayName("GET /v1/audit-logs should return 200 for superadmin")
    void shouldReturn200ForSuperadmin() throws Exception {
        when(auditLogService.getAuditLogs(any(), any())).thenReturn(
                PageResponse.<AuditLogEntry>builder()
                        .content(List.of())
                        .page(new com.omnishop360.backend.web.dto.PageResponse.PageInfo(20, 0, 0L, 0))
                        .build());

        mockMvc.perform(get("/v1/audit-logs"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("GET /v1/audit-logs should return 403 without required role")
    void shouldReturn403ForUnauthorizedUser() throws Exception {
        mockMvc.perform(get("/v1/audit-logs"))
                .andExpect(status().isForbidden());
    }
}
