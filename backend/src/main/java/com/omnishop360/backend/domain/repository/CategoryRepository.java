package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    Optional<Category> findByIdAndDeletedFalse(UUID id);

    @Query("SELECT COUNT(c) > 0 FROM Category c WHERE c.tenant.id = :tenantId AND c.code = :code AND c.deleted = false")
    boolean existsByTenantIdAndCodeAndDeletedFalse(@Param("tenantId") UUID tenantId, @Param("code") String code);

    @Query("SELECT c FROM Category c WHERE c.tenant.id = :tenantId AND c.deleted = false ORDER BY c.name ASC")
    List<Category> findByTenantIdAndDeletedFalseOrderByName(@Param("tenantId") UUID tenantId);
}

