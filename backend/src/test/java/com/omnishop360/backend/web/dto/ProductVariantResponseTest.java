package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.ProductVariant;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mockStatic;

@DisplayName("ProductVariantResponse Tests")
class ProductVariantResponseTest {

    private ProductVariant variant;

    @BeforeEach
    void setUp() {
        variant = new ProductVariant();
        variant.setId(UUID.randomUUID());
        variant.setSku("VAR-SKU-001");
        variant.setName("Variant 1");
        variant.setBarcode("123456789");
        variant.setCostPrice(new BigDecimal("11.00"));
        variant.setSellingPrice(new BigDecimal("21.00"));
        variant.setActive(true);
    }

    @Test
    @DisplayName("Should create ProductVariantResponse with tenant_admin role")
    void shouldCreateProductVariantResponseWithTenantAdminRole() {
        try (MockedStatic<SecurityUtils> securityUtilsMock = mockStatic(SecurityUtils.class)) {
            securityUtilsMock.when(SecurityUtils::isTenantAdmin).thenReturn(true);

            ProductVariantResponse response = ProductVariantResponse.from(variant);

            assertNotNull(response);
            assertEquals(variant.getId(), response.getId());
            assertEquals(variant.getSku(), response.getSku());
            assertEquals(variant.getCostPrice(), response.getCostPrice());
            assertEquals(variant.getSellingPrice(), response.getSellingPrice());
        }
    }

    @Test
    @DisplayName("Should hide costPrice for non-tenant-admin role")
    void shouldHideCostPriceForNonTenantAdminRole() {
        try (MockedStatic<SecurityUtils> securityUtilsMock = mockStatic(SecurityUtils.class)) {
            securityUtilsMock.when(SecurityUtils::isTenantAdmin).thenReturn(false);

            ProductVariantResponse response = ProductVariantResponse.from(variant);

            assertNotNull(response);
            assertNull(response.getCostPrice());
            assertEquals(variant.getSellingPrice(), response.getSellingPrice());
        }
    }

    @Test
    @DisplayName("Should return null when ProductVariant is null")
    void shouldReturnNullWhenProductVariantIsNull() {
        ProductVariantResponse response = ProductVariantResponse.from(null);
        assertNull(response);
    }
}

