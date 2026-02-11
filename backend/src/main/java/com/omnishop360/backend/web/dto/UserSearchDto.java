package com.omnishop360.backend.web.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record UserSearchDto(
        String keyword,
        String email,
        Boolean active,
        UUID tenantId,
        UUID shopId
) {
}
