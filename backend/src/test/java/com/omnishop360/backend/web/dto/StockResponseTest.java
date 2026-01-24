package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("StockResponse Tests")
class StockResponseTest {

    @Test
    @DisplayName("Should create StockResponse from Stock entity")
    void shouldCreateStockResponseFromStock() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());

        Shop shop = new Shop();
        shop.setId(UUID.randomUUID());
        shop.setTenant(tenant);

        Product product = new Product();
        product.setId(UUID.randomUUID());
        product.setTenant(tenant);
        product.setName("Test Product");
        product.setSku("TEST-SKU-001");

        Stock stock = new Stock();
        stock.setId(UUID.randomUUID());
        stock.setTenant(tenant);
        stock.setShop(shop);
        stock.setProduct(product);
        stock.setQuantity(new BigDecimal("10.0"));
        stock.setReservedQuantity(BigDecimal.ZERO);
        stock.setAvailableQuantity(new BigDecimal("10.0"));
        stock.setMinStockLevel(new BigDecimal("5.0"));

        StockResponse response = StockResponse.from(stock);

        assertNotNull(response);
        assertEquals(stock.getId(), response.id());
        assertEquals(product.getId(), response.productId());
        assertEquals(product.getName(), response.productName());
        assertEquals(product.getSku(), response.productSku());
        assertEquals(stock.getQuantity(), response.quantity());
        assertFalse(response.lowStock());
    }

    @Test
    @DisplayName("Should detect low stock correctly")
    void shouldDetectLowStockCorrectly() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());

        Shop shop = new Shop();
        shop.setId(UUID.randomUUID());
        shop.setTenant(tenant);

        Product product = new Product();
        product.setId(UUID.randomUUID());
        product.setTenant(tenant);
        product.setName("Test Product");
        product.setSku("TEST-SKU-001");

        Stock stock = new Stock();
        stock.setId(UUID.randomUUID());
        stock.setTenant(tenant);
        stock.setShop(shop);
        stock.setProduct(product);
        stock.setQuantity(new BigDecimal("3.0"));
        stock.setReservedQuantity(BigDecimal.ZERO);
        stock.setAvailableQuantity(new BigDecimal("3.0"));
        stock.setMinStockLevel(new BigDecimal("5.0"));

        StockResponse response = StockResponse.from(stock);

        assertTrue(response.lowStock());
    }

    @Test
    @DisplayName("Should return null when Stock is null")
    void shouldReturnNullWhenStockIsNull() {
        StockResponse response = StockResponse.from(null);
        assertNull(response);
    }

    @Test
    @DisplayName("Should create StockResponse with variant")
    void shouldCreateStockResponseWithVariant() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());

        Shop shop = new Shop();
        shop.setId(UUID.randomUUID());
        shop.setTenant(tenant);

        Product product = new Product();
        product.setId(UUID.randomUUID());
        product.setTenant(tenant);
        product.setName("Test Product");
        product.setSku("TEST-SKU-001");

        ProductVariant variant = new ProductVariant();
        variant.setId(UUID.randomUUID());
        variant.setTenant(tenant);
        variant.setProduct(product);
        variant.setName("Test Variant");
        variant.setSku("TEST-VAR-001");

        Stock stock = new Stock();
        stock.setId(UUID.randomUUID());
        stock.setTenant(tenant);
        stock.setShop(shop);
        stock.setProduct(product);
        stock.setVariant(variant);
        stock.setQuantity(new BigDecimal("10.0"));
        stock.setReservedQuantity(BigDecimal.ZERO);
        stock.setAvailableQuantity(new BigDecimal("10.0"));
        stock.setMinStockLevel(new BigDecimal("5.0"));

        StockResponse response = StockResponse.from(stock);

        assertNotNull(response);
        assertEquals(stock.getId(), response.id());
        assertEquals(variant.getId(), response.variantId());
        assertEquals(variant.getName(), response.variantName());
        assertEquals(variant.getSku(), response.variantSku());
    }

    @Test
    @DisplayName("Should handle Stock with null variant")
    void shouldHandleStockWithNullVariant() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());

        Shop shop = new Shop();
        shop.setId(UUID.randomUUID());
        shop.setTenant(tenant);

        Product product = new Product();
        product.setId(UUID.randomUUID());
        product.setTenant(tenant);
        product.setName("Test Product");
        product.setSku("TEST-SKU-001");

        Stock stock = new Stock();
        stock.setId(UUID.randomUUID());
        stock.setTenant(tenant);
        stock.setShop(shop);
        stock.setProduct(product);
        stock.setVariant(null);
        stock.setQuantity(new BigDecimal("10.0"));
        stock.setReservedQuantity(BigDecimal.ZERO);
        stock.setAvailableQuantity(new BigDecimal("10.0"));
        stock.setMinStockLevel(new BigDecimal("5.0"));

        StockResponse response = StockResponse.from(stock);

        assertNotNull(response);
        assertNull(response.variantId());
        assertNull(response.variantName());
        assertNull(response.variantSku());
    }
}
