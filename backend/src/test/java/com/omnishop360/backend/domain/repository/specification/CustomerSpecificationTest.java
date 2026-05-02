package com.omnishop360.backend.domain.repository.specification;

import com.omnishop360.backend.domain.entity.Customer;
import com.omnishop360.backend.web.dto.CustomerSearchDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("CustomerSpecification Tests")
class CustomerSpecificationTest {

    @Test
    @DisplayName("Should create specification with customerId filter")
    void shouldCreateSpecificationWithCustomerIdFilter() {
        UUID customerId = UUID.randomUUID();
        CustomerSearchDto dto = new CustomerSearchDto(customerId, null, null, null, null);

        Specification<Customer> spec = CustomerSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with email filter")
    void shouldCreateSpecificationWithEmailFilter() {
        CustomerSearchDto dto = new CustomerSearchDto(null, null, "test@example.com", null, null);

        Specification<Customer> spec = CustomerSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with phone filter")
    void shouldCreateSpecificationWithPhoneFilter() {
        CustomerSearchDto dto = new CustomerSearchDto(null, null, null, "123456789", null);

        Specification<Customer> spec = CustomerSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with active filter")
    void shouldCreateSpecificationWithActiveFilter() {
        CustomerSearchDto dto = new CustomerSearchDto(null, null, null, null, true);

        Specification<Customer> spec = CustomerSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with keyword filter")
    void shouldCreateSpecificationWithKeywordFilter() {
        CustomerSearchDto dto = new CustomerSearchDto(null, "john", null, null, null);

        Specification<Customer> spec = CustomerSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with all filters")
    void shouldCreateSpecificationWithAllFilters() {
        UUID customerId = UUID.randomUUID();
        CustomerSearchDto dto = new CustomerSearchDto(customerId, "john", "test@example.com", "123456789", true);

        Specification<Customer> spec = CustomerSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with empty filters")
    void shouldCreateSpecificationWithEmptyFilters() {
        CustomerSearchDto dto = new CustomerSearchDto(null, null, null, null, null);

        Specification<Customer> spec = CustomerSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with blank keyword")
    void shouldCreateSpecificationWithBlankKeyword() {
        CustomerSearchDto dto = new CustomerSearchDto(null, "   ", null, null, null);

        Specification<Customer> spec = CustomerSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with blank email")
    void shouldCreateSpecificationWithBlankEmail() {
        CustomerSearchDto dto = new CustomerSearchDto(null, null, "   ", null, null);

        Specification<Customer> spec = CustomerSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with blank phone")
    void shouldCreateSpecificationWithBlankPhone() {
        CustomerSearchDto dto = new CustomerSearchDto(null, null, null, "   ", null);

        Specification<Customer> spec = CustomerSpecification.from(dto);
        assertNotNull(spec);
    }
}
