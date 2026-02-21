package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.User;
import com.omnishop360.backend.domain.repository.UserRepository;
import com.omnishop360.backend.infrastructure.adapter.KeycloakAdapter;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.UserResponse;
import com.omnishop360.backend.web.dto.UserSearchDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserContextService userContextService;

    @Mock
    private KeycloakAdapter keycloakAdapter;

    @InjectMocks
    private UserService userService;

    private UUID tenantId;
    private User user;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        Tenant tenant = new Tenant();
        tenant.setId(tenantId);
        tenant.setCompanyName("ACME Corp");
        user = new User();
        user.setId(UUID.randomUUID());
        user.setTenant(tenant);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@test.com");
        user.setKeycloakId("keycloak-123");
        user.setActive(true);
        user.setDeleted(false);
    }

    @Test
    @DisplayName("Should get users for tenant admin with tenant filter")
    @SuppressWarnings({"unchecked", "rawtypes"})
    void shouldGetUsersForTenantAdminWithTenantFilter() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<User> userPage = new PageImpl<>(List.of(user));
        UserSearchDto searchDto = UserSearchDto.builder().keyword("john").build();

        when(keycloakAdapter.getRealmRoleNames(anyString())).thenReturn(List.of("tenant_admin"));
        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::isSuperAdmin).thenReturn(false);
            when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
            when(userRepository.findAll(any(Specification.class), eq(pageable)))
                    .thenReturn(userPage);

            PageResponse<UserResponse> response = userService.getUsers(searchDto, pageable);

            assertNotNull(response);
            assertEquals(1, response.getContent().size());
            assertEquals("tenant_admin", response.getContent().get(0).getRole());
            verify(userContextService).getCurrentUserTenantId();
            verify(userRepository).findAll(any(Specification.class), eq(pageable));
        }
    }

    @Test
    @DisplayName("Should get users for superadmin without tenant filter")
    @SuppressWarnings({"unchecked", "rawtypes"})
    void shouldGetUsersForSuperadminWithoutTenantFilter() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<User> userPage = new PageImpl<>(List.of(user));
        UserSearchDto searchDto = UserSearchDto.builder().tenantId(tenantId).build();

        when(keycloakAdapter.getRealmRoleNames(anyString())).thenReturn(List.of("superadmin"));
        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::isSuperAdmin).thenReturn(true);
            when(userRepository.findAll(any(Specification.class), eq(pageable)))
                    .thenReturn(userPage);

            PageResponse<UserResponse> response = userService.getUsers(searchDto, pageable);

            assertNotNull(response);
            assertEquals(1, response.getContent().size());
            assertEquals("superadmin", response.getContent().get(0).getRole());
            verify(userContextService, never()).getCurrentUserTenantId();
            verify(userRepository).findAll(any(Specification.class), eq(pageable));
        }
    }

    @Test
    @DisplayName("Should get empty page when no users match")
    @SuppressWarnings({"unchecked", "rawtypes"})
    void shouldGetEmptyPageWhenNoUsersMatch() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<User> emptyPage = new PageImpl<>(List.of());
        UserSearchDto searchDto = UserSearchDto.builder().build();

        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::isSuperAdmin).thenReturn(false);
            when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
            when(userRepository.findAll(any(Specification.class), eq(pageable)))
                    .thenReturn(emptyPage);

            PageResponse<UserResponse> response = userService.getUsers(searchDto, pageable);

            assertNotNull(response);
            assertTrue(response.getContent().isEmpty());
            verify(keycloakAdapter, never()).getRealmRoleNames(anyString());
        }
    }
}
