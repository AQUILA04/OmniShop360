package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Shop;
import com.omnishop360.backend.domain.entity.Tenant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ShopResponse Tests")
class ShopResponseTest {

    private Shop shop;
    private Tenant tenant;

    @BeforeEach
    void setUp() {
        tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        tenant.setCompanyName("Test Company");

        shop = new Shop();
        shop.setId(UUID.randomUUID());
        shop.setTenant(tenant);
        shop.setName("Test Shop");
        shop.setCode("TESTSHOP");
        shop.setEmail("shop@test.com");
        shop.setPhone("123456789");
        shop.setAddress("123 Test Street");
        shop.setCity("Test City");
        shop.setPostalCode("12345");
        shop.setCountry("Test Country");
        shop.setActive(true);
        shop.setCreatedAt(LocalDateTime.now());
        shop.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should create ShopResponse from Shop entity")
    void shouldCreateShopResponseFromShop() {
        ShopResponse response = ShopResponse.from(shop);

        assertNotNull(response);
        assertEquals(shop.getId(), response.getId());
        assertEquals(shop.getName(), response.getName());
        assertEquals(shop.getCode(), response.getCode());
        assertEquals(shop.getEmail(), response.getEmail());
        assertEquals(shop.getPhone(), response.getPhone());
        assertEquals(shop.getAddress(), response.getAddress());
        assertEquals(shop.getCity(), response.getCity());
        assertEquals(shop.getPostalCode(), response.getPostalCode());
        assertEquals(shop.getCountry(), response.getCountry());
        assertEquals(shop.getActive(), response.getActive());
        assertEquals(shop.getCreatedAt(), response.getCreatedAt());
        assertEquals(shop.getUpdatedAt(), response.getUpdatedAt());
    }

    @Test
    @DisplayName("Should return null when Shop is null")
    void shouldReturnNullWhenShopIsNull() {
        ShopResponse response = ShopResponse.from(null);
        assertNull(response);
    }
}

