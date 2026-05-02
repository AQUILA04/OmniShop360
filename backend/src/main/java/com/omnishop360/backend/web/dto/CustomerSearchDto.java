package com.omnishop360.backend.web.dto;

import java.util.UUID;

public record CustomerSearchDto(
        UUID customerId,
        String keyword,
        String email,
        String phone,
        Boolean active
) {
}
