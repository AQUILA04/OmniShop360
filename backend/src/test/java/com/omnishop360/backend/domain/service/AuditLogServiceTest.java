package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.web.dto.AuditLogEntry;
import com.omnishop360.backend.web.dto.AuditLogSearchDto;
import com.omnishop360.backend.web.dto.PageResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuditLogService Tests")
class AuditLogServiceTest {

    @Mock
    private EntityManager entityManager;

    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private AuditLogService auditLogService;

    private UUID tenantId;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        pageable = PageRequest.of(0, 20);
        ReflectionTestUtils.setField(auditLogService, "entityManager", entityManager);
    }

    @Test
    @DisplayName("Should use current user tenant when tenantId not in search dto")
    void shouldUseCurrentUserTenantWhenTenantIdNotInSearchDto() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        Query countQuery = mock(Query.class);
        Query dataQuery = mock(Query.class);
        when(entityManager.createNativeQuery(anyString())).thenReturn(dataQuery).thenReturn(countQuery);
        when(countQuery.getSingleResult()).thenReturn(0L);
        when(dataQuery.getResultList()).thenReturn(List.of());

        AuditLogSearchDto searchDto = AuditLogSearchDto.builder().build();
        PageResponse<AuditLogEntry> result = auditLogService.getAuditLogs(searchDto, pageable);

        assertNotNull(result);
        assertEquals(0, result.getContent().size());
        assertEquals(0L, result.getPage().getTotalElements());
        verify(userContextService).getCurrentUserTenantId();
    }

    @Test
    @DisplayName("Should use search dto tenant when provided")
    void shouldUseSearchDtoTenantWhenProvided() {
        Query countQuery = mock(Query.class);
        Query dataQuery = mock(Query.class);
        when(entityManager.createNativeQuery(anyString())).thenReturn(dataQuery).thenReturn(countQuery);
        when(countQuery.getSingleResult()).thenReturn(0L);
        when(dataQuery.getResultList()).thenReturn(List.of());

        AuditLogSearchDto searchDto = AuditLogSearchDto.builder().tenantId(tenantId).build();
        PageResponse<AuditLogEntry> result = auditLogService.getAuditLogs(searchDto, pageable);

        assertNotNull(result);
        verify(entityManager, atLeast(1)).createNativeQuery(anyString());
    }
}
