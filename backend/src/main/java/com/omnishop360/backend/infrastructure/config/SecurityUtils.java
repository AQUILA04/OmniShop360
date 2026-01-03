package com.omnishop360.backend.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Optional;

@Slf4j
public class SecurityUtils {

    public static Optional<String> getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            return Optional.ofNullable(jwt.getClaimAsString("email"));
        }
        return Optional.empty();
    }

    public static Optional<String> getCurrentUserKeycloakId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            String subject = jwt.getSubject();
            if (subject != null && !subject.isEmpty()) {
                return Optional.of(subject);
            }
        }
        return Optional.empty();
    }

    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role));
    }

    public static boolean isTenantAdmin() {
        return hasRole("tenant_admin");
    }

    public static boolean isSuperAdmin() {
        return hasRole("superadmin");
    }
}

