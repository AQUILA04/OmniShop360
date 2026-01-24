package com.omnishop360.backend.domain.repository.specification;

import com.omnishop360.backend.domain.entity.Sale;
import com.omnishop360.backend.web.dto.SaleSearchDto;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class SaleSpecification {

    public static Specification<Sale> from(SaleSearchDto dto) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (dto.shopId() != null) {
                predicates.add(cb.equal(root.get("shop").get("id"), dto.shopId()));
            }

            if (dto.customerId() != null) {
                predicates.add(cb.equal(root.get("customer").get("id"), dto.customerId()));
            }

            if (dto.paymentMethod() != null) {
                predicates.add(cb.equal(root.get("paymentMethod"), dto.paymentMethod()));
            }

            if (dto.paymentStatus() != null) {
                predicates.add(cb.equal(root.get("paymentStatus"), dto.paymentStatus()));
            }

            if (dto.status() != null) {
                predicates.add(cb.equal(root.get("status"), dto.status()));
            }

            if (dto.fromDate() != null) {
                LocalDateTime startOfDay = dto.fromDate().atStartOfDay();
                predicates.add(cb.greaterThanOrEqualTo(root.get("saleDate"), startOfDay));
            }

            if (dto.toDate() != null) {
                LocalDateTime endOfDay = dto.toDate().atTime(LocalTime.MAX);
                predicates.add(cb.lessThanOrEqualTo(root.get("saleDate"), endOfDay));
            }

            String keyword = dto.keyword();
            if (keyword != null && !keyword.isBlank()) {
                keyword = keyword.trim();
                List<Predicate> orPreds = new ArrayList<>();
                orPreds.add(cb.like(cb.lower(root.get("saleNumber")), "%" + keyword.toLowerCase() + "%"));
                if (root.get("customer") != null) {
                    orPreds.add(cb.like(cb.lower(root.get("customer").get("firstName")), "%" + keyword.toLowerCase() + "%"));
                    orPreds.add(cb.like(cb.lower(root.get("customer").get("lastName")), "%" + keyword.toLowerCase() + "%"));
                    orPreds.add(cb.like(cb.lower(root.get("customer").get("email")), "%" + keyword.toLowerCase() + "%"));
                    orPreds.add(cb.like(cb.lower(root.get("customer").get("phone")), "%" + keyword.toLowerCase() + "%"));
                }
                predicates.add(cb.or(orPreds.toArray(new Predicate[0])));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
