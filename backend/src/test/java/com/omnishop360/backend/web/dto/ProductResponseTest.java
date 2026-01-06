package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Category;
import com.omnishop360.backend.domain.entity.Product;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mockStatic;

@DisplayName("ProductResponse Tests")
class ProductResponseTest {

    private Product product;
    private Tenant tenant;
    private Category category;

    @BeforeEach
    void setUp() {
        tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        tenant.setCompanyName("Test Company");

        category = new Category();
        category.setId(UUID.randomUUID());
        category.setTenant(tenant);
        category.setName("Test Category");

        product = new Product();
        product.setId(UUID.randomUUID());
        product.setTenant(tenant);
        product.setCategory(category);
        product.setName("Test Product");
        product.setSku("TEST-SKU-001");
        product.setDescription("Test Description");
        product.setCostPrice(new BigDecimal("10.00"));
        product.setSellingPrice(new BigDecimal("20.00"));
        product.setTaxRate(new BigDecimal("20.00"));
        product.setUnit("UNIT");
        product.setActive(true);
    }

    @Test
    @DisplayName("Should create ProductResponse from Product entity with tenant_admin role")
    void shouldCreateProductResponseWithTenantAdminRole() {
        try (MockedStatic<SecurityUtils> securityUtilsMock = mockStatic(SecurityUtils.class)) {
            securityUtilsMock.when(SecurityUtils::isTenantAdmin).thenReturn(true);

            ProductResponse response = ProductResponse.from(product);

            assertNotNull(response);
            assertEquals(product.getId(), response.getId());
            assertEquals(product.getName(), response.getName());
            assertEquals(product.getSku(), response.getSku());
            assertEquals(product.getCostPrice(), response.getCostPrice());
            assertEquals(product.getSellingPrice(), response.getSellingPrice());
            assertEquals(category.getId(), response.getCategoryId());
            assertEquals(category.getName(), response.getCategoryName());
        }
    }

    @Test
    @DisplayName("Should hide costPrice for non-tenant-admin role")
    void shouldHideCostPriceForNonTenantAdminRole() {
        try (MockedStatic<SecurityUtils> securityUtilsMock = mockStatic(SecurityUtils.class)) {
            securityUtilsMock.when(SecurityUtils::isTenantAdmin).thenReturn(false);

            ProductResponse response = ProductResponse.from(product);

            assertNotNull(response);
            assertNull(response.getCostPrice());
            assertEquals(product.getSellingPrice(), response.getSellingPrice());
        }
    }

    @Test
    @DisplayName("Should return null when Product is null")
    void shouldReturnNullWhenProductIsNull() {
        ProductResponse response = ProductResponse.from(null);
        assertNull(response);
    }
}

