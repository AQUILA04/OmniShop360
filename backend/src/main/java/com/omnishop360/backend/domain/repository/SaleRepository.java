package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SaleRepository extends JpaRepository<Sale, UUID>, JpaSpecificationExecutor<Sale> {

    @Query("SELECT s FROM Sale s WHERE s.tenant.id = :tenantId AND s.saleNumber = :saleNumber")
    Optional<Sale> findByTenantIdAndSaleNumber(@Param("tenantId") UUID tenantId, @Param("saleNumber") String saleNumber);

    @Query("SELECT COALESCE(SUM(s.totalAmount), 0), COUNT(s) FROM Sale s WHERE s.tenant.id = :tenantId " +
            "AND (:shopId IS NULL OR s.shop.id = :shopId) AND s.saleDate >= :from AND s.saleDate < :to")
    Object[] findSummaryByTenantAndShopAndDateRange(
            @Param("tenantId") UUID tenantId,
            @Param("shopId") UUID shopId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    @Query(value = "SELECT (sale_date::date) as day, COALESCE(SUM(total_amount), 0), COUNT(*) " +
            "FROM sales WHERE tenant_id = :tenantId AND (:shopId IS NULL OR shop_id = :shopId) " +
            "AND sale_date >= :from AND sale_date < :to GROUP BY (sale_date::date) ORDER BY day",
            nativeQuery = true)
    List<Object[]> findDailyRevenueByTenantAndShopAndDateRange(
            @Param("tenantId") UUID tenantId,
            @Param("shopId") UUID shopId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    @Query("SELECT si.product.id, si.product.name, si.product.sku, SUM(si.quantity), SUM(si.totalAmount) " +
            "FROM SaleItem si WHERE si.sale.tenant.id = :tenantId " +
            "AND (:shopId IS NULL OR si.sale.shop.id = :shopId) " +
            "AND si.sale.saleDate >= :from AND si.sale.saleDate < :to " +
            "GROUP BY si.product.id, si.product.name, si.product.sku ORDER BY SUM(si.quantity) DESC")
    List<Object[]> findTopProductsByTenantAndShopAndDateRange(
            @Param("tenantId") UUID tenantId,
            @Param("shopId") UUID shopId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);
}
