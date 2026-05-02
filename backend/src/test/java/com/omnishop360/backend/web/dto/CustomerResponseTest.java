package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Customer;
import com.omnishop360.backend.domain.entity.Tenant;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("CustomerResponse Tests")
class CustomerResponseTest {

    @Test
    @DisplayName("Should create CustomerResponse from Customer entity")
    void shouldCreateCustomerResponseFromCustomer() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());

        Customer customer = new Customer();
        customer.setId(UUID.randomUUID());
        customer.setTenant(tenant);
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setEmail("john.doe@test.com");
        customer.setPhone("123456789");
        customer.setAddress("123 Test Street");
        customer.setCity("Test City");
        customer.setPostalCode("12345");
        customer.setCountry("Test Country");
        customer.setLoyaltyPoints(100);
        customer.setActive(true);
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());

        CustomerResponse response = CustomerResponse.from(customer);

        assertNotNull(response);
        assertEquals(customer.getId(), response.getId());
        assertEquals(customer.getFirstName(), response.getFirstName());
        assertEquals(customer.getLastName(), response.getLastName());
        assertEquals(customer.getEmail(), response.getEmail());
        assertEquals(customer.getPhone(), response.getPhone());
        assertEquals(customer.getAddress(), response.getAddress());
        assertEquals(customer.getCity(), response.getCity());
        assertEquals(customer.getPostalCode(), response.getPostalCode());
        assertEquals(customer.getCountry(), response.getCountry());
        assertEquals(customer.getLoyaltyPoints(), response.getLoyaltyPoints());
        assertEquals(customer.getActive(), response.getActive());
        assertEquals(customer.getCreatedAt(), response.getCreatedAt());
        assertEquals(customer.getUpdatedAt(), response.getUpdatedAt());
    }

    @Test
    @DisplayName("Should return null when Customer is null")
    void shouldReturnNullWhenCustomerIsNull() {
        CustomerResponse response = CustomerResponse.from(null);
        assertNull(response);
    }

    @Test
    @DisplayName("Should handle Customer with null fields")
    void shouldHandleCustomerWithNullFields() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());

        Customer customer = new Customer();
        customer.setId(UUID.randomUUID());
        customer.setTenant(tenant);
        customer.setFirstName(null);
        customer.setLastName(null);
        customer.setEmail(null);
        customer.setPhone(null);
        customer.setAddress(null);
        customer.setCity(null);
        customer.setPostalCode(null);
        customer.setCountry(null);
        customer.setLoyaltyPoints(0);
        customer.setActive(true);
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());

        CustomerResponse response = CustomerResponse.from(customer);

        assertNotNull(response);
        assertEquals(customer.getId(), response.getId());
        assertNull(response.getFirstName());
        assertNull(response.getLastName());
        assertNull(response.getEmail());
        assertNull(response.getPhone());
        assertNull(response.getAddress());
        assertNull(response.getCity());
        assertNull(response.getPostalCode());
        assertNull(response.getCountry());
        assertEquals(0, response.getLoyaltyPoints());
        assertTrue(response.getActive());
    }
}
