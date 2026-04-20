package com.omnishop360.backend.domain.repository.specification;

import com.omnishop360.backend.domain.entity.Stock;
import com.omnishop360.backend.web.dto.StockSearchDto;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class StockSpecification {

    private static final String PRODUCT = "product";
    private static final String VARIANT = "variant";

    private StockSpecification() {
    }

    public static Specification<Stock> from(StockSearchDto dto) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (dto == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }
            applyExactFilters(dto, root, cb, predicates);
            applyTextFilters(dto, root, cb, predicates);
            applyKeywordFilter(dto, root, cb, predicates);
            applyLowStockFilter(dto, root, cb, predicates);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void applyExactFilters(StockSearchDto dto, jakarta.persistence.criteria.Root<Stock> root,
                                          jakarta.persistence.criteria.CriteriaBuilder cb, List<Predicate> predicates) {
        if (dto.shopId() != null) {
            predicates.add(cb.equal(root.get("shop").get("id"), dto.shopId()));
        }
        if (dto.productId() != null) {
            predicates.add(cb.equal(root.get(PRODUCT).get("id"), dto.productId()));
        }
        if (dto.variantId() != null) {
            predicates.add(cb.equal(root.get(VARIANT).get("id"), dto.variantId()));
        }
        if (dto.categoryId() != null) {
            predicates.add(cb.equal(root.get(PRODUCT).get("category").get("id"), dto.categoryId()));
        }
    }

    private static void applyTextFilters(StockSearchDto dto, jakarta.persistence.criteria.Root<Stock> root,
                                         jakarta.persistence.criteria.CriteriaBuilder cb, List<Predicate> predicates) {
        if (dto.productCode() != null && !dto.productCode().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get(PRODUCT).get("sku")), "%" + dto.productCode().trim().toLowerCase() + "%"));
        }
        if (dto.productName() != null && !dto.productName().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get(PRODUCT).get("name")), "%" + dto.productName().trim().toLowerCase() + "%"));
        }
    }

    private static void applyKeywordFilter(StockSearchDto dto, jakarta.persistence.criteria.Root<Stock> root,
                                           jakarta.persistence.criteria.CriteriaBuilder cb, List<Predicate> predicates) {
        String keyword = dto.keyword();
        if (keyword == null || keyword.isBlank()) {
            return;
        }
        String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
        List<Predicate> orPreds = new ArrayList<>();
        orPreds.add(cb.like(cb.lower(root.get(PRODUCT).get("name")), searchPattern));
        orPreds.add(cb.like(cb.lower(root.get(PRODUCT).get("sku")), searchPattern));
        orPreds.add(cb.like(cb.lower(root.get(PRODUCT).get("category").get("name")), searchPattern));
        var variantJoin = root.join(VARIANT, jakarta.persistence.criteria.JoinType.LEFT);
        orPreds.add(cb.like(cb.lower(variantJoin.get("name")), searchPattern));
        orPreds.add(cb.like(cb.lower(variantJoin.get("sku")), searchPattern));
        predicates.add(cb.or(orPreds.toArray(new Predicate[0])));
    }

    private static void applyLowStockFilter(StockSearchDto dto, jakarta.persistence.criteria.Root<Stock> root,
                                            jakarta.persistence.criteria.CriteriaBuilder cb, List<Predicate> predicates) {
        if (dto.lowStock() == null || !dto.lowStock()) {
            return;
        }
        predicates.add(cb.and(
                cb.isNotNull(root.get("minStockLevel")),
                cb.isNotNull(root.get("availableQuantity")),
                cb.lessThanOrEqualTo(root.get("availableQuantity"), root.get("minStockLevel"))
        ));
    }
}
