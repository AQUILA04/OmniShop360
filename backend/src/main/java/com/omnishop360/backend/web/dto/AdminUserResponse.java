package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String keycloakId;

    public static AdminUserResponse from(User user) {
        if (user == null) {
            return null;
        }
        return AdminUserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .keycloakId(user.getKeycloakId())
                .build();
    }
}

