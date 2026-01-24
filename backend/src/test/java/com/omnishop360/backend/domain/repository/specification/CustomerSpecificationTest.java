package com.omnishop360.backend.domain.repository.specification;

import com.omnishop360.backend.domain.entity.Customer;
import com.omnishop360.backend.web.dto.CustomerSearchDto;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CustomerSpecification Tests")
class CustomerSpecificationTest {

    @Mock
    private Root<Customer> root;

    @Mock
    private CriteriaQuery<?> query;

    @Mock
    private CriteriaBuilder cb;

    @Test
    @DisplayName("Should create specification with customerId filter")
    void shouldCreateSpecificationWithCustomerIdFilter() {
        UUID customerId = UUID.randomUUID();
        CustomerSearchDto dto = new CustomerSearchDto(customerId, null, null, null, null);

        when(cb.equal(any(), any())).thenReturn(mock(Predicate.class));

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
