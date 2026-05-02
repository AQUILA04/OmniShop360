package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.CashRegisterSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface CashRegisterSessionRepository extends JpaRepository<CashRegisterSession, UUID>, JpaSpecificationExecutor<CashRegisterSession> {

    @Query("SELECT s FROM CashRegisterSession s WHERE s.tenant.id = :tenantId AND s.shop.id = :shopId AND s.status = 'OPEN'")
    Optional<CashRegisterSession> findOpenSession(@Param("tenantId") UUID tenantId, @Param("shopId") UUID shopId);
}
