package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.Tenant;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

public class TenantRepositoryImpl implements TenantRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Tenant> findAllActiveWithSearch(String search, Pageable pageable) {
        String baseQuery = "SELECT t.* FROM tenants t WHERE t.deleted = false";
        String countQuery = "SELECT COUNT(*) FROM tenants t WHERE t.deleted = false";
        
        if (search != null && !search.trim().isEmpty()) {
            String searchCondition = " AND LOWER(CAST(t.name AS VARCHAR)) LIKE LOWER('%' || :search || '%')";
            baseQuery += searchCondition;
            countQuery += searchCondition;
        }
        
        String orderBy = buildOrderBy(pageable.getSort());
        if (!orderBy.isEmpty()) {
            baseQuery += " ORDER BY " + orderBy;
        }
        
        Query countNativeQuery = entityManager.createNativeQuery(countQuery);
        if (search != null && !search.trim().isEmpty()) {
            countNativeQuery.setParameter("search", search);
        }
        Long total = ((Number) countNativeQuery.getSingleResult()).longValue();
        
        Query nativeQuery = entityManager.createNativeQuery(baseQuery, Tenant.class);
        if (search != null && !search.trim().isEmpty()) {
            nativeQuery.setParameter("search", search);
        }
        nativeQuery.setFirstResult((int) pageable.getOffset());
        nativeQuery.setMaxResults(pageable.getPageSize());
        
        @SuppressWarnings("unchecked")
        List<Tenant> content = nativeQuery.getResultList();
        
        return new PageImpl<>(content, pageable, total);
    }

    private String buildOrderBy(Sort sort) {
        if (sort == null || sort.isUnsorted()) {
            return "t.created_at DESC";
        }
        
        StringBuilder orderBy = new StringBuilder();
        sort.forEach(order -> {
            if (orderBy.length() > 0) {
                orderBy.append(", ");
            }
            String columnName = mapPropertyToColumn(order.getProperty());
            orderBy.append("t.").append(columnName).append(" ").append(order.getDirection().name());
        });
        
        return orderBy.toString();
    }

    private String mapPropertyToColumn(String property) {
        return switch (property) {
            case "createdAt" -> "created_at";
            case "updatedAt" -> "updated_at";
            case "deletedAt" -> "deleted_at";
            case "companyName" -> "name";
            case "contactEmail" -> "email";
            case "pricingPolicy" -> "pricing_policy";
            default -> property;
        };
    }
}

