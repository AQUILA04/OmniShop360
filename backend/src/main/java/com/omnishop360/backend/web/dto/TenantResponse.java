package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.TenantStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantResponse {

    private UUID id;
    private String companyName;
    private String contactEmail;
    private TenantStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private AdminUserResponse admin;
    private List<AdminUserResponse> admins;
    private Integer adminCount;
    private List<Object> shops;
    private Integer shopCount;

    public static TenantResponse from(Tenant tenant) {
        if (tenant == null) {
            return null;
        }
        
        TenantResponse.TenantResponseBuilder builder = TenantResponse.builder()
                .id(tenant.getId())
                .companyName(tenant.getCompanyName())
                .contactEmail(tenant.getContactEmail())
                .status(tenant.getStatus())
                .createdAt(tenant.getCreatedAt())
                .updatedAt(tenant.getUpdatedAt());

        if (tenant.getAdmins() != null && !tenant.getAdmins().isEmpty()) {
            builder.admin(AdminUserResponse.from(tenant.getAdmins().get(0)))
                   .admins(tenant.getAdmins().stream()
                           .map(AdminUserResponse::from)
                           .collect(Collectors.toList()))
                   .adminCount(tenant.getAdmins().size());
        } else {
            builder.adminCount(0);
        }

        builder.shops(new ArrayList<>())
               .shopCount(0);

        return builder.build();
    }

    public static TenantResponse from(Tenant tenant, AdminUserResponse admin) {
        TenantResponse response = from(tenant);
        if (response != null) {
            response.setAdmin(admin);
            if (admin != null) {
                response.setAdminCount(1);
            }
        }
        return response;
    }
}

