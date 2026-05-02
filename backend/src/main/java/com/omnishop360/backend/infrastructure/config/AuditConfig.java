package com.omnishop360.backend.infrastructure.config;

import com.omnishop360.backend.domain.entity.audit.AuditRevisionListener;
import com.omnishop360.backend.domain.service.UserContextService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class AuditConfig {

    private final UserContextService userContextService;

    @PostConstruct
    public void init() {
        AuditRevisionListener.setUserContextService(userContextService);
    }
}
