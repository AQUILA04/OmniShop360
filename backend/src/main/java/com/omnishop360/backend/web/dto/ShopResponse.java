package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Shop;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopResponse {

    private UUID id;
    private String name;
    private String code;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String postalCode;
    private String country;
    private Boolean active;
    private Boolean allowSaleWithoutStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer userCount;

    public static ShopResponse from(Shop shop) {
        if (shop == null) {
            return null;
        }
        return ShopResponse.builder()
                .id(shop.getId())
                .name(shop.getName())
                .code(shop.getCode())
                .email(shop.getEmail())
                .phone(shop.getPhone())
                .address(shop.getAddress())
                .city(shop.getCity())
                .postalCode(shop.getPostalCode())
                .country(shop.getCountry())
                .active(shop.getActive())
                .allowSaleWithoutStock(shop.getAllowSaleWithoutStock())
                .createdAt(shop.getCreatedAt())
                .updatedAt(shop.getUpdatedAt())
                .build();
    }
}

