package com.omnishop360.backend.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantRequest {

    @NotBlank(message = "Variant SKU is required")
    @Size(min = 1, max = 100, message = "Variant SKU must be between 1 and 100 characters")
    private String sku;

    @NotBlank(message = "Variant name is required")
    @Size(min = 2, max = 255, message = "Variant name must be between 2 and 255 characters")
    private String name;

    @Size(max = 100, message = "Barcode must not exceed 100 characters")
    private String barcode;

    @DecimalMin(value = "0.0", inclusive = true, message = "Cost price must be greater than or equal to 0")
    private BigDecimal costPrice;

    @DecimalMin(value = "0.0", inclusive = false, message = "Selling price must be greater than 0")
    private BigDecimal sellingPrice;
}

