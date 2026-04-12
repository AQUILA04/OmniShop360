package com.omnishop360.backend.domain.repository.specification;

import com.omnishop360.backend.domain.entity.Stock;
import com.omnishop360.backend.web.dto.StockSearchDto;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class StockSpecification {

    public static Specification<Stock> from(StockSearchDto dto) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (dto.shopId() != null) {
                predicates.add(cb.equal(root.get("shop").get("id"), dto.shopId()));
            }

            if (dto.productId() != null) {
                predicates.add(cb.equal(root.get("product").get("id"), dto.productId()));
            }

            if (dto.variantId() != null) {
                predicates.add(cb.equal(root.get("variant").get("id"), dto.variantId()));
            }

            String keyword = dto.keyword();
            if (keyword != null && !keyword.isBlank()) {
                keyword = keyword.trim();
                String searchPattern = "%" + keyword.toLowerCase() + "%";
                List<Predicate> orPreds = new ArrayList<>();
                orPreds.add(cb.like(cb.lower(root.get("product").get("name")), searchPattern));
                orPreds.add(cb.like(cb.lower(root.get("product").get("sku")), searchPattern));
                var variantJoin = root.join("variant", jakarta.persistence.criteria.JoinType.LEFT);
                orPreds.add(cb.like(cb.lower(variantJoin.get("name")), searchPattern));
                orPreds.add(cb.like(cb.lower(variantJoin.get("sku")), searchPattern));
                predicates.add(cb.or(orPreds.toArray(new Predicate[0])));
            }

            if (dto.lowStock() != null && dto.lowStock()) {
                predicates.add(cb.and(
                        cb.isNotNull(root.get("minStockLevel")),
                        cb.isNotNull(root.get("availableQuantity")),
                        cb.lessThanOrEqualTo(root.get("availableQuantity"), root.get("minStockLevel"))
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
