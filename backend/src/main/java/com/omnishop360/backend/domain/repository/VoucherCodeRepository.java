package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.VoucherCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

public interface VoucherCodeRepository extends JpaRepository<VoucherCode, UUID> {

    @Query("SELECT v FROM VoucherCode v WHERE v.tenant.id = :tenantId AND LOWER(v.code) = LOWER(:code)")
    Optional<VoucherCode> findByTenantAndCode(@Param("tenantId") UUID tenantId, @Param("code") String code);

    @Query("""
            SELECT v FROM VoucherCode v
            WHERE v.tenant.id = :tenantId
              AND v.sourceSession.id = :sessionId
              AND v.originalAmount = :amount
              AND v.status = 'ACTIVE'
            ORDER BY v.createdAt DESC
            """)
    Optional<VoucherCode> findActiveBySessionAndAmount(@Param("tenantId") UUID tenantId, @Param("sessionId") UUID sessionId, @Param("amount") BigDecimal amount);
}
