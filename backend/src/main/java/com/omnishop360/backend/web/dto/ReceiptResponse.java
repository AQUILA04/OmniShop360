package com.omnishop360.backend.web.dto;

import lombok.Builder;

@Builder
public record ReceiptResponse(
        ReceiptFormat format,
        SaleResponse sale
) {
}
