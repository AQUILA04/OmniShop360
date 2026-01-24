package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SaleRepository extends JpaRepository<Sale, UUID>, JpaSpecificationExecutor<Sale> {

    @Query("SELECT s FROM Sale s WHERE s.tenant.id = :tenantId AND s.saleNumber = :saleNumber")
    Optional<Sale> findByTenantIdAndSaleNumber(@Param("tenantId") UUID tenantId, @Param("saleNumber") String saleNumber);
}
