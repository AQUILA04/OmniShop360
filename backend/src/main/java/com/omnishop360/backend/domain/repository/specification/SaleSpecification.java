package com.omnishop360.backend.domain.repository.specification;

import com.omnishop360.backend.domain.entity.Sale;
import com.omnishop360.backend.web.dto.SaleSearchDto;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class SaleSpecification {

    private static final String CUSTOMER = "customer";

    private SaleSpecification() {
    }

    public static Specification<Sale> from(SaleSearchDto dto) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            applyBasicFilters(dto, root, cb, predicates);
            applyDateFilters(dto, root, cb, predicates);
            applyKeywordFilter(dto, root, cb, predicates);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void applyBasicFilters(SaleSearchDto dto, jakarta.persistence.criteria.Root<Sale> root,
                                          jakarta.persistence.criteria.CriteriaBuilder cb, List<Predicate> predicates) {
        if (dto.shopId() != null) {
            predicates.add(cb.equal(root.get("shop").get("id"), dto.shopId()));
        }

        if (dto.customerId() != null) {
            predicates.add(cb.equal(root.get(CUSTOMER).get("id"), dto.customerId()));
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
    }

    private static void applyDateFilters(SaleSearchDto dto, jakarta.persistence.criteria.Root<Sale> root,
                                         jakarta.persistence.criteria.CriteriaBuilder cb, List<Predicate> predicates) {
        if (dto.fromDate() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("saleDate"), dto.fromDate().atStartOfDay()));
        }

        if (dto.toDate() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("saleDate"), dto.toDate().atTime(LocalTime.MAX)));
        }
    }

    private static void applyKeywordFilter(SaleSearchDto dto, jakarta.persistence.criteria.Root<Sale> root,
                                           jakarta.persistence.criteria.CriteriaBuilder cb, List<Predicate> predicates) {
        String keyword = dto.keyword();
        if (keyword == null || keyword.isBlank()) {
            return;
        }
        String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
        List<Predicate> orPreds = new ArrayList<>();
        orPreds.add(cb.like(cb.lower(root.get("saleNumber")), searchPattern));
        orPreds.add(cb.like(cb.lower(root.get(CUSTOMER).get("firstName")), searchPattern));
        orPreds.add(cb.like(cb.lower(root.get(CUSTOMER).get("lastName")), searchPattern));
        orPreds.add(cb.like(cb.lower(root.get(CUSTOMER).get("email")), searchPattern));
        orPreds.add(cb.like(cb.lower(root.get(CUSTOMER).get("phone")), searchPattern));
        predicates.add(cb.or(orPreds.toArray(new Predicate[0])));
    }
}
