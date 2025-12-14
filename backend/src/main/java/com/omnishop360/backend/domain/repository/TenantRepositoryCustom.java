package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.Tenant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TenantRepositoryCustom {
    Page<Tenant> findAllActiveWithSearch(String search, Pageable pageable);
}

