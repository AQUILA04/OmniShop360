package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Shop;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.User;
import com.omnishop360.backend.domain.repository.ShopRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.domain.repository.UserRepository;
import com.omnishop360.backend.infrastructure.adapter.KeycloakAdapter;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserContextService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final ShopRepository shopRepository;
    private final KeycloakAdapter keycloakAdapter;

    @Transactional
    public User getCurrentUser() {
        Optional<String> keycloakId = SecurityUtils.getCurrentUserKeycloakId();
        if (keycloakId.isEmpty()) {
            throw new EntityNotFoundException("Current user not found in security context");
        }

        return userRepository.findByKeycloakIdAndDeletedFalse(keycloakId.get())
                .orElseGet(() -> {
                    log.info("User not found in local database, synchronizing from Keycloak: {}", keycloakId.get());
                    return synchronizeUserFromKeycloak(keycloakId.get());
                });
    }

    private User synchronizeUserFromKeycloak(String keycloakId) {
        try {
            UserRepresentation keycloakUser = keycloakAdapter.getUserById(keycloakId);
            
            String tenantIdStr = keycloakAdapter.getUserAttribute(keycloakId, "tenant_id");
            if (tenantIdStr == null || tenantIdStr.isEmpty()) {
                throw new EntityNotFoundException("User does not have tenant_id attribute in Keycloak. User must be created through tenant creation process.");
            }

            UUID tenantId = UUID.fromString(tenantIdStr);
            Tenant tenant = tenantRepository.findByIdAndDeletedFalse(tenantId)
                    .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));

            String shopIdStr = keycloakAdapter.getUserAttribute(keycloakId, "shop_id");
            Shop shop = null;
            if (shopIdStr != null && !shopIdStr.isEmpty()) {
                UUID shopId = UUID.fromString(shopIdStr);
                shop = shopRepository.findByIdAndDeletedFalse(shopId)
                        .filter(s -> s.getTenant().getId().equals(tenantId))
                        .orElse(null);
            }

            User user = new User();
            user.setTenant(tenant);
            user.setShop(shop);
            user.setFirstName(keycloakUser.getFirstName());
            user.setLastName(keycloakUser.getLastName());
            user.setEmail(keycloakUser.getEmail());
            user.setKeycloakId(keycloakId);
            user.setActive(keycloakUser.isEnabled());
            user.setDeleted(false);

            user = userRepository.save(user);
            log.info("User synchronized from Keycloak: {} for tenant: {}", user.getId(), tenantId);
            return user;
        } catch (Exception e) {
            log.error("Error synchronizing user from Keycloak: {}", keycloakId, e);
            throw new EntityNotFoundException("Failed to synchronize user from Keycloak: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public UUID getCurrentUserTenantId() {
        User user = getCurrentUser();
        return user.getTenant().getId();
    }

    @Transactional(readOnly = true)
    public Optional<UUID> getCurrentUserShopId() {
        try {
            User user = getCurrentUser();
            if (user.getShop() != null) {
                return Optional.of(user.getShop().getId());
            }
            return Optional.empty();
        } catch (EntityNotFoundException e) {
            return Optional.empty();
        }
    }
}

