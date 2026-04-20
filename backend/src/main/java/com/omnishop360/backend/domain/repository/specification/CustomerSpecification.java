package com.omnishop360.backend.domain.repository.specification;

import com.omnishop360.backend.domain.entity.Customer;
import com.omnishop360.backend.web.dto.CustomerSearchDto;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CustomerSpecification {

    private CustomerSpecification() {
    }

    public static Specification<Customer> from(CustomerSearchDto dto) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (dto.customerId() != null) {
                predicates.add(cb.equal(root.get("id"), dto.customerId()));
            }

            if (dto.email() != null && !dto.email().isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("email")), dto.email().toLowerCase().trim()));
            }

            if (dto.phone() != null && !dto.phone().isBlank()) {
                predicates.add(cb.equal(root.get("phone"), dto.phone().trim()));
            }

            if (dto.active() != null) {
                predicates.add(cb.equal(root.get("active"), dto.active()));
            }

            String keyword = dto.keyword();
            if (keyword != null && !keyword.isBlank()) {
                keyword = keyword.trim();
                String searchPattern = "%" + keyword.toLowerCase() + "%";
                List<Predicate> orPreds = new ArrayList<>();
                orPreds.add(cb.like(cb.lower(root.get("firstName")), searchPattern));
                orPreds.add(cb.like(cb.lower(root.get("lastName")), searchPattern));
                orPreds.add(cb.like(cb.lower(root.get("email")), searchPattern));
                orPreds.add(cb.like(cb.lower(root.get("phone")), searchPattern));
                predicates.add(cb.or(orPreds.toArray(new Predicate[0])));
            }

            predicates.add(cb.equal(root.get("deleted"), false));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
