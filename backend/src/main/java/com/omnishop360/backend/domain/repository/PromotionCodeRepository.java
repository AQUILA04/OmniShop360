package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.PromotionCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface PromotionCodeRepository extends JpaRepository<PromotionCode, UUID> {

    @Query("SELECT p FROM PromotionCode p WHERE p.tenant.id = :tenantId AND LOWER(p.code) = LOWER(:code)")
    Optional<PromotionCode> findByTenantAndCode(@Param("tenantId") UUID tenantId, @Param("code") String code);

    @Query("SELECT p FROM PromotionCode p WHERE p.tenant.id = :tenantId AND LOWER(p.code) = LOWER(:code) AND p.shop IS NULL")
    Optional<PromotionCode> findGlobalByTenantAndCode(@Param("tenantId") UUID tenantId, @Param("code") String code);

    @Query("SELECT p FROM PromotionCode p WHERE p.tenant.id = :tenantId AND LOWER(p.code) = LOWER(:code) AND p.shop.id = :shopId")
    Optional<PromotionCode> findByTenantCodeAndShop(@Param("tenantId") UUID tenantId, @Param("code") String code, @Param("shopId") UUID shopId);
}
