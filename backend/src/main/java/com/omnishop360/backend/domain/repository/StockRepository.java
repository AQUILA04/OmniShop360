package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.Product;
import com.omnishop360.backend.domain.entity.ProductVariant;
import com.omnishop360.backend.domain.entity.Shop;
import com.omnishop360.backend.domain.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StockRepository extends JpaRepository<Stock, UUID>, JpaSpecificationExecutor<Stock> {

    Optional<Stock> findByTenantIdAndShopIdAndProductIdAndVariantId(
            UUID tenantId, UUID shopId, UUID productId, UUID variantId);

    Optional<Stock> findByTenantIdAndShopIdAndProductIdAndVariantIsNull(
            UUID tenantId, UUID shopId, UUID productId);

    @Query("SELECT s FROM Stock s WHERE s.tenant.id = :tenantId AND s.shop.id = :shopId AND s.product.id = :productId AND s.variant IS NULL")
    Optional<Stock> findStockForProduct(@Param("tenantId") UUID tenantId, @Param("shopId") UUID shopId, @Param("productId") UUID productId);

    @Query("SELECT s FROM Stock s WHERE s.tenant.id = :tenantId AND s.shop.id = :shopId AND s.product.id = :productId AND s.variant.id = :variantId")
    Optional<Stock> findStockForVariant(@Param("tenantId") UUID tenantId, @Param("shopId") UUID shopId, @Param("productId") UUID productId, @Param("variantId") UUID variantId);
}
