package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.TenantStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTenantStatusRequest {

    @NotNull(message = "Status is required")
    private TenantStatus status;
}
