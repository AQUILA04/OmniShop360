package com.omnishop360.backend.domain.repository.specification;

import com.omnishop360.backend.domain.entity.Stock;
import com.omnishop360.backend.web.dto.StockSearchDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("StockSpecification Tests")
class StockSpecificationTest {

    @Test
    @DisplayName("Should create specification with shopId filter")
    void shouldCreateSpecificationWithShopIdFilter() {
        UUID shopId = UUID.randomUUID();
        StockSearchDto dto = StockSearchDto.builder()
                .shopId(shopId)
                .build();

        Specification<Stock> spec = StockSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with productId filter")
    void shouldCreateSpecificationWithProductIdFilter() {
        UUID productId = UUID.randomUUID();
        StockSearchDto dto = StockSearchDto.builder()
                .productId(productId)
                .build();

        Specification<Stock> spec = StockSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with variantId filter")
    void shouldCreateSpecificationWithVariantIdFilter() {
        UUID variantId = UUID.randomUUID();
        StockSearchDto dto = StockSearchDto.builder()
                .variantId(variantId)
                .build();

        Specification<Stock> spec = StockSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with keyword filter")
    void shouldCreateSpecificationWithKeywordFilter() {
        StockSearchDto dto = StockSearchDto.builder()
                .keyword("test")
                .build();

        Specification<Stock> spec = StockSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with lowStock filter")
    void shouldCreateSpecificationWithLowStockFilter() {
        StockSearchDto dto = StockSearchDto.builder()
                .lowStock(true)
                .build();

        Specification<Stock> spec = StockSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with all filters")
    void shouldCreateSpecificationWithAllFilters() {
        UUID shopId = UUID.randomUUID();
        UUID productId = UUID.randomUUID();
        UUID variantId = UUID.randomUUID();
        StockSearchDto dto = StockSearchDto.builder()
                .shopId(shopId)
                .productId(productId)
                .variantId(variantId)
                .keyword("test")
                .lowStock(true)
                .build();

        Specification<Stock> spec = StockSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with empty filters")
    void shouldCreateSpecificationWithEmptyFilters() {
        StockSearchDto dto = StockSearchDto.builder().build();

        Specification<Stock> spec = StockSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with blank keyword")
    void shouldCreateSpecificationWithBlankKeyword() {
        StockSearchDto dto = StockSearchDto.builder()
                .keyword("   ")
                .build();

        Specification<Stock> spec = StockSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with null lowStock")
    void shouldCreateSpecificationWithNullLowStock() {
        StockSearchDto dto = StockSearchDto.builder()
                .lowStock(null)
                .build();

        Specification<Stock> spec = StockSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with lowStock false")
    void shouldCreateSpecificationWithLowStockFalse() {
        StockSearchDto dto = StockSearchDto.builder()
                .lowStock(false)
                .build();

        Specification<Stock> spec = StockSpecification.from(dto);
        assertNotNull(spec);
    }
}
