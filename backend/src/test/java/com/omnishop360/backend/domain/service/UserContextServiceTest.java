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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserContextService Tests")
class UserContextServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private ShopRepository shopRepository;

    @Mock
    private KeycloakAdapter keycloakAdapter;

    @InjectMocks
    private UserContextService userContextService;

    private String keycloakId;
    private User user;
    private Tenant tenant;
    private Shop shop;

    @BeforeEach
    void setUp() {
        keycloakId = UUID.randomUUID().toString();
        
        tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        tenant.setCompanyName("Test Company");

        shop = new Shop();
        shop.setId(UUID.randomUUID());
        shop.setTenant(tenant);

        user = new User();
        user.setId(UUID.randomUUID());
        user.setTenant(tenant);
        user.setShop(shop);
        user.setKeycloakId(keycloakId);
        user.setEmail("test@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
    }

    @Test
    @DisplayName("Should get current user successfully")
    void shouldGetCurrentUserSuccessfully() {
        try (MockedStatic<SecurityUtils> securityUtilsMock = mockStatic(SecurityUtils.class)) {
            securityUtilsMock.when(SecurityUtils::getCurrentUserKeycloakId)
                    .thenReturn(Optional.of(keycloakId));
            when(userRepository.findByKeycloakIdAndDeletedFalse(keycloakId))
                    .thenReturn(Optional.of(user));

            User result = userContextService.getCurrentUser();

            assertNotNull(result);
            assertEquals(user.getId(), result.getId());
            assertEquals(keycloakId, result.getKeycloakId());
        }
    }

    @Test
    @DisplayName("Should throw exception when keycloak id not found in security context")
    void shouldThrowExceptionWhenKeycloakIdNotFound() {
        try (MockedStatic<SecurityUtils> securityUtilsMock = mockStatic(SecurityUtils.class)) {
            securityUtilsMock.when(SecurityUtils::getCurrentUserKeycloakId)
                    .thenReturn(Optional.empty());

            assertThrows(EntityNotFoundException.class, () -> userContextService.getCurrentUser());
        }
    }

    @Test
    @DisplayName("Should throw exception when user not found in database")
    void shouldThrowExceptionWhenUserNotFound() {
        try (MockedStatic<SecurityUtils> securityUtilsMock = mockStatic(SecurityUtils.class)) {
            securityUtilsMock.when(SecurityUtils::getCurrentUserKeycloakId)
                    .thenReturn(Optional.of(keycloakId));
            when(userRepository.findByKeycloakIdAndDeletedFalse(keycloakId))
                    .thenReturn(Optional.empty());

            assertThrows(EntityNotFoundException.class, () -> userContextService.getCurrentUser());
        }
    }

    @Test
    @DisplayName("Should synchronize user from Keycloak when not found in database")
    void shouldSynchronizeUserFromKeycloakWhenNotFound() {
        String tenantIdStr = tenant.getId().toString();
        String shopIdStr = shop.getId().toString();
        
        UserRepresentation keycloakUser = new UserRepresentation();
        keycloakUser.setId(keycloakId);
        keycloakUser.setEmail("test@example.com");
        keycloakUser.setFirstName("Test");
        keycloakUser.setLastName("User");
        keycloakUser.setEnabled(true);

        Map<String, List<String>> attributes = new HashMap<>();
        attributes.put("tenant_id", List.of(tenantIdStr));
        attributes.put("shop_id", List.of(shopIdStr));
        keycloakUser.setAttributes(attributes);

        try (MockedStatic<SecurityUtils> securityUtilsMock = mockStatic(SecurityUtils.class)) {
            securityUtilsMock.when(SecurityUtils::getCurrentUserKeycloakId)
                    .thenReturn(Optional.of(keycloakId));
            when(userRepository.findByKeycloakIdAndDeletedFalse(keycloakId))
                    .thenReturn(Optional.empty())
                    .thenReturn(Optional.of(user));
            when(keycloakAdapter.getUserById(keycloakId)).thenReturn(keycloakUser);
            when(keycloakAdapter.getUserAttribute(keycloakId, "tenant_id")).thenReturn(tenantIdStr);
            when(keycloakAdapter.getUserAttribute(keycloakId, "shop_id")).thenReturn(shopIdStr);
            when(tenantRepository.findByIdAndDeletedFalse(tenant.getId())).thenReturn(Optional.of(tenant));
            when(shopRepository.findByIdAndDeletedFalse(shop.getId())).thenReturn(Optional.of(shop));
            when(userRepository.save(any(User.class))).thenReturn(user);

            User result = userContextService.getCurrentUser();

            assertNotNull(result);
            verify(keycloakAdapter).getUserById(keycloakId);
            verify(keycloakAdapter).getUserAttribute(keycloakId, "tenant_id");
            verify(userRepository).save(any(User.class));
        }
    }

    @Test
    @DisplayName("Should get current user tenant id successfully")
    void shouldGetCurrentUserTenantIdSuccessfully() {
        try (MockedStatic<SecurityUtils> securityUtilsMock = mockStatic(SecurityUtils.class)) {
            securityUtilsMock.when(SecurityUtils::getCurrentUserKeycloakId)
                    .thenReturn(Optional.of(keycloakId));
            when(userRepository.findByKeycloakIdAndDeletedFalse(keycloakId))
                    .thenReturn(Optional.of(user));

            UUID result = userContextService.getCurrentUserTenantId();

            assertNotNull(result);
            assertEquals(tenant.getId(), result);
        }
    }

    @Test
    @DisplayName("Should get current user shop id when shop exists")
    void shouldGetCurrentUserShopIdWhenShopExists() {
        try (MockedStatic<SecurityUtils> securityUtilsMock = mockStatic(SecurityUtils.class)) {
            securityUtilsMock.when(SecurityUtils::getCurrentUserKeycloakId)
                    .thenReturn(Optional.of(keycloakId));
            when(userRepository.findByKeycloakIdAndDeletedFalse(keycloakId))
                    .thenReturn(Optional.of(user));

            Optional<UUID> result = userContextService.getCurrentUserShopId();

            assertTrue(result.isPresent());
            assertEquals(shop.getId(), result.get());
        }
    }

    @Test
    @DisplayName("Should return empty when user has no shop")
    void shouldReturnEmptyWhenUserHasNoShop() {
        user.setShop(null);
        
        try (MockedStatic<SecurityUtils> securityUtilsMock = mockStatic(SecurityUtils.class)) {
            securityUtilsMock.when(SecurityUtils::getCurrentUserKeycloakId)
                    .thenReturn(Optional.of(keycloakId));
            when(userRepository.findByKeycloakIdAndDeletedFalse(keycloakId))
                    .thenReturn(Optional.of(user));

            Optional<UUID> result = userContextService.getCurrentUserShopId();

            assertTrue(result.isEmpty());
        }
    }
}

