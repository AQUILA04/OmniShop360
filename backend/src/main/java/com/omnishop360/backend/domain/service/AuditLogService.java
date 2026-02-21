package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.web.dto.AuditLogEntry;
import com.omnishop360.backend.web.dto.AuditLogSearchDto;
import com.omnishop360.backend.web.dto.PageResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class AuditLogService {

    private static final String ENTITY_STOCK = "Stock";
    private static final String ENTITY_SALE = "Sale";
    private static final String ENTITY_PRODUCT = "Product";

    @PersistenceContext
    private EntityManager entityManager;

    private final UserContextService userContextService;

    public AuditLogService(UserContextService userContextService) {
        this.userContextService = userContextService;
    }

    @Transactional(readOnly = true)
    public PageResponse<AuditLogEntry> getAuditLogs(AuditLogSearchDto searchDto, Pageable pageable) {
        UUID tenantId = searchDto != null && searchDto.tenantId() != null
                ? searchDto.tenantId()
                : userContextService.getCurrentUserTenantId();
        Long fromTs = searchDto != null && searchDto.fromDate() != null ? searchDto.fromDate().toEpochMilli() : null;
        Long toTs = searchDto != null && searchDto.toDate() != null ? searchDto.toDate().toEpochMilli() : null;
        String userId = searchDto != null ? searchDto.userId() : null;
        String entityType = searchDto != null ? searchDto.entityType() : null;

        String where = "r.tenant_id = :tenantId" +
                (fromTs != null ? " AND r.revtstmp >= :fromTs" : "") +
                (toTs != null ? " AND r.revtstmp <= :toTs" : "") +
                (userId != null && !userId.isBlank() ? " AND r.user_id = :userId" : "");

        List<String> unions = new ArrayList<>();
        if (ENTITY_STOCK.equalsIgnoreCase(entityType) || entityType == null) {
            unions.add("SELECT r.id, r.revtstmp, r.user_id, 'Stock' AS entity_type, a.id AS entity_id, a.revtype FROM revision_info r JOIN stock_aud a ON a.rev = r.id WHERE " + where);
        }
        if (ENTITY_SALE.equalsIgnoreCase(entityType) || entityType == null) {
            unions.add("SELECT r.id, r.revtstmp, r.user_id, 'Sale' AS entity_type, a.id AS entity_id, a.revtype FROM revision_info r JOIN sales_aud a ON a.rev = r.id WHERE " + where);
        }
        if (ENTITY_PRODUCT.equalsIgnoreCase(entityType) || entityType == null) {
            unions.add("SELECT r.id, r.revtstmp, r.user_id, 'Product' AS entity_type, a.id AS entity_id, a.revtype FROM revision_info r JOIN products_aud a ON a.rev = r.id WHERE " + where);
        }
        if (unions.isEmpty()) {
            return emptyPage(pageable);
        }
        String sql = "SELECT * FROM (" + String.join(" UNION ALL ", unions) + ") AS u ORDER BY revtstmp DESC";
        String countSql = "SELECT COUNT(*) FROM (" + String.join(" UNION ALL ", unions) + ") AS u";

        Query dataQuery = entityManager.createNativeQuery(sql);
        dataQuery.setParameter("tenantId", tenantId);
        if (fromTs != null) {
            dataQuery.setParameter("fromTs", fromTs);
        }
        if (toTs != null) {
            dataQuery.setParameter("toTs", toTs);
        }
        if (userId != null && !userId.isBlank()) {
            dataQuery.setParameter("userId", userId);
        }
        dataQuery.setFirstResult((int) pageable.getOffset());
        dataQuery.setMaxResults(pageable.getPageSize());

        Query countQuery = entityManager.createNativeQuery(countSql);
        countQuery.setParameter("tenantId", tenantId);
        if (fromTs != null) {
            countQuery.setParameter("fromTs", fromTs);
        }
        if (toTs != null) {
            countQuery.setParameter("toTs", toTs);
        }
        if (userId != null && !userId.isBlank()) {
            countQuery.setParameter("userId", userId);
        }
        long total = ((Number) countQuery.getSingleResult()).longValue();

        @SuppressWarnings("unchecked")
        List<Object[]> rows = dataQuery.getResultList();
        List<AuditLogEntry> content = rows.stream()
                .map(row -> new AuditLogEntry(
                        ((Number) row[0]).intValue(),
                        Instant.ofEpochMilli(((Number) row[1]).longValue()),
                        (String) row[2],
                        revtypeToAction(((Number) row[5]).intValue()),
                        (String) row[3],
                        row[4] != null ? UUID.fromString(row[4].toString()) : null))
                .toList();

        return PageResponse.<AuditLogEntry>builder()
                .content(content)
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(pageable.getPageSize())
                        .number(pageable.getPageNumber())
                        .totalElements(total)
                        .totalPages((int) (total + pageable.getPageSize() - 1) / pageable.getPageSize())
                        .build())
                .build();
    }

    private static String revtypeToAction(int revtype) {
        return switch (revtype) {
            case 0 -> "CREATE";
            case 1 -> "UPDATE";
            case 2 -> "DELETE";
            default -> "UNKNOWN";
        };
    }

    private PageResponse<AuditLogEntry> emptyPage(Pageable pageable) {
        return PageResponse.<AuditLogEntry>builder()
                .content(List.of())
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(pageable.getPageSize())
                        .number(pageable.getPageNumber())
                        .totalElements(0L)
                        .totalPages(0)
                        .build())
                .build();
    }
}
