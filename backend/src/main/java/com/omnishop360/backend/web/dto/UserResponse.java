package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.User;
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
public class UserResponse {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String keycloakId;
    private Boolean active;
    private UUID tenantId;
    private String tenantCompanyName;
    private UUID shopId;
    private String shopName;
    private LocalDateTime createdAt;
    private String role;

    public static UserResponse from(User user) {
        return from(user, null);
    }

    public static UserResponse from(User user, String role) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .keycloakId(user.getKeycloakId())
                .active(user.getActive())
                .tenantId(user.getTenant() != null ? user.getTenant().getId() : null)
                .tenantCompanyName(user.getTenant() != null ? user.getTenant().getCompanyName() : null)
                .shopId(user.getShop() != null ? user.getShop().getId() : null)
                .shopName(user.getShop() != null ? user.getShop().getName() : null)
                .createdAt(user.getCreatedAt())
                .role(role)
                .build();
    }
}
