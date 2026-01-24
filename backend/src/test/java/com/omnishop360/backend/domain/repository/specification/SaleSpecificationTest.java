package com.omnishop360.backend.domain.repository.specification;

import com.omnishop360.backend.domain.entity.Sale;
import com.omnishop360.backend.web.dto.SaleSearchDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("SaleSpecification Tests")
class SaleSpecificationTest {

    @Test
    @DisplayName("Should create specification with shopId filter")
    void shouldCreateSpecificationWithShopIdFilter() {
        UUID shopId = UUID.randomUUID();
        SaleSearchDto dto = SaleSearchDto.builder()
                .shopId(shopId)
                .build();

        Specification<Sale> spec = SaleSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with customerId filter")
    void shouldCreateSpecificationWithCustomerIdFilter() {
        UUID customerId = UUID.randomUUID();
        SaleSearchDto dto = SaleSearchDto.builder()
                .customerId(customerId)
                .build();

        Specification<Sale> spec = SaleSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with paymentMethod filter")
    void shouldCreateSpecificationWithPaymentMethodFilter() {
        SaleSearchDto dto = SaleSearchDto.builder()
                .paymentMethod(Sale.PaymentMethod.CASH)
                .build();

        Specification<Sale> spec = SaleSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with paymentStatus filter")
    void shouldCreateSpecificationWithPaymentStatusFilter() {
        SaleSearchDto dto = SaleSearchDto.builder()
                .paymentStatus(Sale.PaymentStatus.PAID)
                .build();

        Specification<Sale> spec = SaleSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with status filter")
    void shouldCreateSpecificationWithStatusFilter() {
        SaleSearchDto dto = SaleSearchDto.builder()
                .status(Sale.SaleStatus.COMPLETED)
                .build();

        Specification<Sale> spec = SaleSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with fromDate filter")
    void shouldCreateSpecificationWithFromDateFilter() {
        SaleSearchDto dto = SaleSearchDto.builder()
                .fromDate(LocalDate.now().minusDays(7))
                .build();

        Specification<Sale> spec = SaleSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with toDate filter")
    void shouldCreateSpecificationWithToDateFilter() {
        SaleSearchDto dto = SaleSearchDto.builder()
                .toDate(LocalDate.now())
                .build();

        Specification<Sale> spec = SaleSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with keyword filter")
    void shouldCreateSpecificationWithKeywordFilter() {
        SaleSearchDto dto = SaleSearchDto.builder()
                .keyword("test")
                .build();

        Specification<Sale> spec = SaleSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with all filters")
    void shouldCreateSpecificationWithAllFilters() {
        UUID shopId = UUID.randomUUID();
        UUID customerId = UUID.randomUUID();
        SaleSearchDto dto = SaleSearchDto.builder()
                .shopId(shopId)
                .customerId(customerId)
                .paymentMethod(Sale.PaymentMethod.CASH)
                .paymentStatus(Sale.PaymentStatus.PAID)
                .status(Sale.SaleStatus.COMPLETED)
                .fromDate(LocalDate.now().minusDays(7))
                .toDate(LocalDate.now())
                .keyword("test")
                .build();

        Specification<Sale> spec = SaleSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with empty filters")
    void shouldCreateSpecificationWithEmptyFilters() {
        SaleSearchDto dto = SaleSearchDto.builder().build();

        Specification<Sale> spec = SaleSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with blank keyword")
    void shouldCreateSpecificationWithBlankKeyword() {
        SaleSearchDto dto = SaleSearchDto.builder()
                .keyword("   ")
                .build();

        Specification<Sale> spec = SaleSpecification.from(dto);
        assertNotNull(spec);
    }
}
