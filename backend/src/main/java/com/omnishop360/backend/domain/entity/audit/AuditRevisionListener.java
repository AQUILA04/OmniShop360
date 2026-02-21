package com.omnishop360.backend.domain.entity.audit;

import com.omnishop360.backend.domain.service.UserContextService;
import org.hibernate.envers.RevisionListener;

public class AuditRevisionListener implements RevisionListener {

    private static UserContextService userContextService;

    public static void setUserContextService(UserContextService service) {
        AuditRevisionListener.userContextService = service;
    }

    @Override
    public void newRevision(Object revisionEntity) {
        AuditRevisionEntity entity = (AuditRevisionEntity) revisionEntity;
        if (userContextService != null) {
            try {
                entity.setUserId(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication() != null
                        && org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName() != null
                        ? getKeycloakIdFromAuth()
                        : null);
                entity.setTenantId(userContextService.getCurrentUserTenantId());
            } catch (Exception ignored) {
                entity.setUserId(null);
                entity.setTenantId(null);
            }
        }
    }

    private static String getKeycloakIdFromAuth() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof org.springframework.security.oauth2.jwt.Jwt jwt) {
            return jwt.getSubject();
        }
        return auth != null ? auth.getName() : null;
    }
}
