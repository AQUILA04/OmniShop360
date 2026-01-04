package com.omnishop360.backend.infrastructure.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("SecurityUtils Tests")
class SecurityUtilsTest {

    private Jwt jwt;
    private JwtAuthenticationToken authentication;

    @BeforeEach
    void setUp() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", "user-keycloak-id-123");
        claims.put("email", "test@example.com");
        
        Map<String, Object> realmAccess = new HashMap<>();
        realmAccess.put("roles", Arrays.asList("tenant_admin", "offline_access"));
        claims.put("realm_access", realmAccess);

        jwt = Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .claim("sub", "user-keycloak-id-123")
                .claim("email", "test@example.com")
                .claim("realm_access", realmAccess)
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();

        List<GrantedAuthority> authorities = Arrays.asList(
                new SimpleGrantedAuthority("ROLE_tenant_admin"),
                new SimpleGrantedAuthority("ROLE_offline_access")
        );

        authentication = new JwtAuthenticationToken(jwt, authorities);
    }

    @Test
    @DisplayName("Should get current user email successfully")
    void shouldGetCurrentUserEmailSuccessfully() {
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Optional<String> result = SecurityUtils.getCurrentUserEmail();

        assertTrue(result.isPresent());
        assertEquals("test@example.com", result.get());
    }

    @Test
    @DisplayName("Should return empty when authentication is null")
    void shouldReturnEmptyWhenAuthenticationIsNull() {
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(null);
        SecurityContextHolder.setContext(securityContext);

        Optional<String> result = SecurityUtils.getCurrentUserEmail();

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Should get current user keycloak id successfully")
    void shouldGetCurrentUserKeycloakIdSuccessfully() {
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Optional<String> result = SecurityUtils.getCurrentUserKeycloakId();

        assertTrue(result.isPresent());
        assertEquals("user-keycloak-id-123", result.get());
    }

    @Test
    @DisplayName("Should return empty when subject is null")
    void shouldReturnEmptyWhenSubjectIsNull() {
        Jwt jwtWithoutSubject = Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();

        JwtAuthenticationToken authWithoutSubject = new JwtAuthenticationToken(jwtWithoutSubject, Collections.emptyList());
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authWithoutSubject);
        SecurityContextHolder.setContext(securityContext);

        Optional<String> result = SecurityUtils.getCurrentUserKeycloakId();

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Should check role successfully")
    void shouldCheckRoleSuccessfully() {
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        assertTrue(SecurityUtils.hasRole("tenant_admin"));
        assertFalse(SecurityUtils.hasRole("superadmin"));
    }

    @Test
    @DisplayName("Should return false when authentication is null for role check")
    void shouldReturnFalseWhenAuthenticationIsNullForRoleCheck() {
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(null);
        SecurityContextHolder.setContext(securityContext);

        assertFalse(SecurityUtils.hasRole("tenant_admin"));
    }

    @Test
    @DisplayName("Should check if user is tenant admin")
    void shouldCheckIfUserIsTenantAdmin() {
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        assertTrue(SecurityUtils.isTenantAdmin());
    }

    @Test
    @DisplayName("Should check if user is super admin")
    void shouldCheckIfUserIsSuperAdmin() {
        Map<String, Object> realmAccess = new HashMap<>();
        realmAccess.put("roles", Arrays.asList("superadmin"));
        
        Jwt superAdminJwt = Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .claim("sub", "superadmin-id")
                .claim("realm_access", realmAccess)
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();

        List<GrantedAuthority> authorities = Arrays.asList(
                new SimpleGrantedAuthority("ROLE_superadmin")
        );

        JwtAuthenticationToken superAdminAuth = new JwtAuthenticationToken(superAdminJwt, authorities);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(superAdminAuth);
        SecurityContextHolder.setContext(securityContext);

        assertTrue(SecurityUtils.isSuperAdmin());
    }
}

