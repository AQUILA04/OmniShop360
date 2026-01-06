package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShopRepository extends JpaRepository<Shop, UUID> {

    Optional<Shop> findByIdAndDeletedFalse(UUID id);

    @Query("SELECT s FROM Shop s WHERE s.tenant.id = :tenantId AND s.deleted = false")
    Page<Shop> findByTenantIdAndDeletedFalse(@Param("tenantId") UUID tenantId, Pageable pageable);

    @Query("SELECT s FROM Shop s WHERE s.tenant.id = :tenantId AND s.deleted = false " +
           "AND (LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(s.code) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Shop> findByTenantIdAndDeletedFalseWithSearch(
            @Param("tenantId") UUID tenantId,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT COUNT(s) > 0 FROM Shop s WHERE s.tenant.id = :tenantId AND s.code = :code AND s.deleted = false")
    boolean existsByTenantIdAndCodeAndDeletedFalse(@Param("tenantId") UUID tenantId, @Param("code") String code);

    @Query("SELECT COUNT(s) FROM Shop s WHERE s.tenant.id = :tenantId AND s.deleted = false")
    long countByTenantId(@Param("tenantId") UUID tenantId);
}

