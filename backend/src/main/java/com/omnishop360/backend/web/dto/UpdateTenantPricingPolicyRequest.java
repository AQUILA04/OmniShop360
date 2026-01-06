package com.omnishop360.backend.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTenantPricingPolicyRequest {

    @NotBlank(message = "Pricing policy is required")
    @Pattern(regexp = "GLOBAL_ENFORCED|LOCAL_ALLOWED", message = "Pricing policy must be either GLOBAL_ENFORCED or LOCAL_ALLOWED")
    private String pricingPolicy;
}

