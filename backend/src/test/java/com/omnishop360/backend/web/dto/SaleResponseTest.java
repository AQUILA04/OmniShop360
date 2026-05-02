package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("SaleResponse Tests")
class SaleResponseTest {

    @Test
    @DisplayName("Should create SaleResponse from Sale entity")
    void shouldCreateSaleResponseFromSale() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());

        Shop shop = new Shop();
        shop.setId(UUID.randomUUID());
        shop.setTenant(tenant);
        shop.setName("Test Shop");

        Sale sale = new Sale();
        sale.setId(UUID.randomUUID());
        sale.setTenant(tenant);
        sale.setShop(shop);
        sale.setSaleNumber("SALE-20250124-123456");
        sale.setSaleDate(LocalDateTime.now());
        sale.setSubtotal(new BigDecimal("100.00"));
        sale.setTaxAmount(new BigDecimal("20.00"));
        sale.setDiscountAmount(BigDecimal.ZERO);
        sale.setTotalAmount(new BigDecimal("120.00"));
        sale.setPaymentMethod(Sale.PaymentMethod.CASH);
        sale.setPaymentStatus(Sale.PaymentStatus.PAID);
        sale.setStatus(Sale.SaleStatus.COMPLETED);
        sale.setItems(new ArrayList<>());

        SaleResponse response = SaleResponse.from(sale);

        assertNotNull(response);
        assertEquals(sale.getId(), response.id());
        assertEquals(sale.getSaleNumber(), response.saleNumber());
        assertEquals(shop.getId(), response.shopId());
        assertEquals(shop.getName(), response.shopName());
        assertEquals(sale.getTotalAmount(), response.totalAmount());
    }

    @Test
    @DisplayName("Should return null when Sale is null")
    void shouldReturnNullWhenSaleIsNull() {
        SaleResponse response = SaleResponse.from(null);
        assertNull(response);
    }

    @Test
    @DisplayName("Should create SaleResponse with customer")
    void shouldCreateSaleResponseWithCustomer() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());

        Shop shop = new Shop();
        shop.setId(UUID.randomUUID());
        shop.setTenant(tenant);
        shop.setName("Test Shop");

        Customer customer = new Customer();
        customer.setId(UUID.randomUUID());
        customer.setTenant(tenant);
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setEmail("john.doe@test.com");

        Sale sale = new Sale();
        sale.setId(UUID.randomUUID());
        sale.setTenant(tenant);
        sale.setShop(shop);
        sale.setCustomer(customer);
        sale.setSaleNumber("SALE-20250124-123456");
        sale.setSaleDate(LocalDateTime.now());
        sale.setSubtotal(new BigDecimal("100.00"));
        sale.setTaxAmount(new BigDecimal("20.00"));
        sale.setDiscountAmount(BigDecimal.ZERO);
        sale.setTotalAmount(new BigDecimal("120.00"));
        sale.setPaymentMethod(Sale.PaymentMethod.CASH);
        sale.setPaymentStatus(Sale.PaymentStatus.PAID);
        sale.setStatus(Sale.SaleStatus.COMPLETED);
        sale.setItems(new ArrayList<>());

        SaleResponse response = SaleResponse.from(sale);

        assertNotNull(response);
        assertEquals(customer.getId(), response.customerId());
        assertEquals((customer.getFirstName() + " " + customer.getLastName()).trim(), response.customerName());
    }

    @Test
    @DisplayName("Should handle Sale with null customer")
    void shouldHandleSaleWithNullCustomer() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());

        Shop shop = new Shop();
        shop.setId(UUID.randomUUID());
        shop.setTenant(tenant);
        shop.setName("Test Shop");

        Sale sale = new Sale();
        sale.setId(UUID.randomUUID());
        sale.setTenant(tenant);
        sale.setShop(shop);
        sale.setCustomer(null);
        sale.setSaleNumber("SALE-20250124-123456");
        sale.setSaleDate(LocalDateTime.now());
        sale.setSubtotal(new BigDecimal("100.00"));
        sale.setTaxAmount(new BigDecimal("20.00"));
        sale.setTotalAmount(new BigDecimal("120.00"));
        sale.setPaymentMethod(Sale.PaymentMethod.CASH);
        sale.setPaymentStatus(Sale.PaymentStatus.PAID);
        sale.setStatus(Sale.SaleStatus.COMPLETED);
        sale.setItems(new ArrayList<>());

        SaleResponse response = SaleResponse.from(sale);

        assertNotNull(response);
        assertNull(response.customerId());
        assertNull(response.customerName());
    }

    @Test
    @DisplayName("Should create SaleResponse with items")
    void shouldCreateSaleResponseWithItems() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());

        Shop shop = new Shop();
        shop.setId(UUID.randomUUID());
        shop.setTenant(tenant);
        shop.setName("Test Shop");

        Product product = new Product();
        product.setId(UUID.randomUUID());
        product.setTenant(tenant);
        product.setName("Test Product");
        product.setSku("TEST-SKU-001");

        SaleItem saleItem = new SaleItem();
        saleItem.setId(UUID.randomUUID());
        saleItem.setProduct(product);
        saleItem.setQuantity(new BigDecimal("2.0"));
        saleItem.setUnitPrice(new BigDecimal("50.00"));
        saleItem.setSubtotal(new BigDecimal("100.00"));

        Sale sale = new Sale();
        sale.setId(UUID.randomUUID());
        sale.setTenant(tenant);
        sale.setShop(shop);
        sale.setSaleNumber("SALE-20250124-123456");
        sale.setSaleDate(LocalDateTime.now());
        sale.setSubtotal(new BigDecimal("100.00"));
        sale.setTaxAmount(new BigDecimal("20.00"));
        sale.setTotalAmount(new BigDecimal("120.00"));
        sale.setPaymentMethod(Sale.PaymentMethod.CASH);
        sale.setPaymentStatus(Sale.PaymentStatus.PAID);
        sale.setStatus(Sale.SaleStatus.COMPLETED);
        sale.setItems(new ArrayList<>(List.of(saleItem)));

        SaleResponse response = SaleResponse.from(sale);

        assertNotNull(response);
        assertNotNull(response.items());
        assertEquals(1, response.items().size());
    }
}
