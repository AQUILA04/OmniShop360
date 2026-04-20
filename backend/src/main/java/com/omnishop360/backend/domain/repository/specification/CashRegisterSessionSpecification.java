package com.omnishop360.backend.domain.repository.specification;

import com.omnishop360.backend.domain.entity.CashRegisterSession;
import com.omnishop360.backend.web.dto.CashRegisterSessionSearchDto;
import org.springframework.data.jpa.domain.Specification;

public class CashRegisterSessionSpecification {

    private CashRegisterSessionSpecification() {
    }

    public static Specification<CashRegisterSession> from(CashRegisterSessionSearchDto dto) {
        return (root, query, cb) -> {
            if (dto == null || dto.status() == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("status"), dto.status());
        };
    }
}
