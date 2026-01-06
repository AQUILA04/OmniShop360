package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findByIdAndDeletedFalse(UUID id);

    @Query("SELECT p FROM Product p WHERE p.tenant.id = :tenantId AND p.deleted = false")
    Page<Product> findByTenantIdAndDeletedFalse(@Param("tenantId") UUID tenantId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.tenant.id = :tenantId AND p.deleted = false " +
           "AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findByTenantIdAndDeletedFalseWithSearch(
            @Param("tenantId") UUID tenantId,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE p.tenant.id = :tenantId AND p.sku = :sku AND p.deleted = false")
    boolean existsByTenantIdAndSkuAndDeletedFalse(@Param("tenantId") UUID tenantId, @Param("sku") String sku);
}

