package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.TenantStatus;
import com.omnishop360.backend.domain.entity.User;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.domain.repository.UserRepository;
import com.omnishop360.backend.infrastructure.adapter.KeycloakAdapter;
import com.omnishop360.backend.web.dto.AdminUserResponse;
import com.omnishop360.backend.web.dto.CreateTenantRequest;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.TenantResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final KeycloakAdapter keycloakAdapter;

    @Transactional
    public TenantResponse createTenant(CreateTenantRequest request) {
        log.info("Creating tenant: {}", request.getCompanyName());

        if (userRepository.existsByEmailAndDeletedFalse(request.getAdminEmail())) {
            throw new IllegalArgumentException("Admin email already exists");
        }

        Tenant tenant = new Tenant();
        tenant.setCompanyName(request.getCompanyName());
        tenant.setContactEmail(request.getContactEmail());
        tenant.setCode(generateTenantCode(request.getCompanyName()));
        tenant.setStatus(TenantStatus.ACTIVE);
        tenant.setActive(true);
        tenant.setDeleted(false);
        tenant = tenantRepository.save(tenant);

        String keycloakId = keycloakAdapter.createUser(
                request.getAdminEmail(),
                request.getAdminFirstName(),
                request.getAdminLastName(),
                "tenant_admin"
        );

        User admin = new User();
        admin.setTenant(tenant);
        admin.setFirstName(request.getAdminFirstName());
        admin.setLastName(request.getAdminLastName());
        admin.setEmail(request.getAdminEmail());
        admin.setKeycloakId(keycloakId);
        admin.setActive(true);
        admin.setDeleted(false);
        admin = userRepository.save(admin);

        tenant.getAdmins().add(admin);

        log.info("Tenant created successfully: {} with admin: {}", tenant.getId(), admin.getId());
        return TenantResponse.from(tenant, AdminUserResponse.from(admin));
    }

    @Transactional(readOnly = true)
    public PageResponse<TenantResponse> getAllTenants(Pageable pageable, String search) {
        log.debug("Fetching tenants with pagination: page={}, size={}, search={}",
                pageable.getPageNumber(), pageable.getPageSize(), search);

        Page<Tenant> tenants = tenantRepository.findAllActiveWithSearch(search, pageable);
        Page<TenantResponse> responsePage = tenants.map(tenant -> {
            long adminCount = userRepository.countByTenantId(tenant.getId());
            TenantResponse response = TenantResponse.from(tenant);
            if (response != null) {
                response.setAdminCount((int) adminCount);
                if (response.getShops() == null) {
                    response.setShops(new ArrayList<>());
                }
                response.setShopCount(0);
            }
            return response;
        });

        return PageResponse.from(responsePage);
    }

    @Transactional(readOnly = true)
    public TenantResponse getTenantById(UUID tenantId) {
        log.debug("Fetching tenant: {}", tenantId);

        Tenant tenant = tenantRepository.findByIdAndDeletedFalse(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));

        long adminCount = userRepository.countByTenantId(tenant.getId());
        TenantResponse response = TenantResponse.from(tenant);
        if (response != null) {
            response.setAdminCount((int) adminCount);
            if (response.getShops() == null) {
                response.setShops(new ArrayList<>());
            }
            response.setShopCount(0);
        }

        return response;
    }

    private String generateTenantCode(String companyName) {
        String filtered = companyName.toUpperCase().replaceAll("[^A-Z0-9]", "");
        
        if (filtered.isEmpty()) {
            filtered = "TENANT";
        }
        
        String baseCode = filtered.length() > 10 
                ? filtered.substring(0, 10) 
                : filtered;
        
        String code = baseCode;
        int counter = 1;
        while (tenantRepository.existsByCode(code)) {
            code = baseCode + counter;
            counter++;
            if (counter > 999) {
                code = baseCode + System.currentTimeMillis();
                break;
            }
        }
        return code;
    }

}

