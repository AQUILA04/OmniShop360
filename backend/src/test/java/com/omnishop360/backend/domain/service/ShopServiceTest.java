package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Shop;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.User;
import com.omnishop360.backend.domain.repository.ShopRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.domain.repository.UserRepository;
import com.omnishop360.backend.infrastructure.adapter.KeycloakAdapter;
import com.omnishop360.backend.web.dto.CreateCashierRequest;
import com.omnishop360.backend.web.dto.CreateShopAdminRequest;
import com.omnishop360.backend.web.dto.CreateShopRequest;
import com.omnishop360.backend.web.dto.ShopResponse;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ShopService Tests")
class ShopServiceTest {

    @Mock
    private ShopRepository shopRepository;

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private KeycloakAdapter keycloakAdapter;

    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private ShopService shopService;

    private UUID tenantId;
    private Tenant tenant;
    private CreateShopRequest createShopRequest;
    private Shop shop;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        tenant = new Tenant();
        tenant.setId(tenantId);
        tenant.setCompanyName("Test Company");

        createShopRequest = new CreateShopRequest();
        createShopRequest.setName("Test Shop");
        createShopRequest.setAddress("123 Test Street");
        createShopRequest.setCity("Test City");
        createShopRequest.setPostalCode("12345");
        createShopRequest.setCountry("Test Country");
        createShopRequest.setPhone("123456789");
        createShopRequest.setEmail("shop@test.com");

        shop = new Shop();
        shop.setId(UUID.randomUUID());
        shop.setTenant(tenant);
        shop.setName("Test Shop");
        shop.setCode("TESTSHOP");
        shop.setAddress("123 Test Street");
        shop.setCity("Test City");
        shop.setPostalCode("12345");
        shop.setCountry("Test Country");
        shop.setPhone("123456789");
        shop.setEmail("shop@test.com");
        shop.setActive(true);
        shop.setDeleted(false);
    }

    @Test
    @DisplayName("Should create shop successfully")
    void shouldCreateShopSuccessfully() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.existsByTenantIdAndCodeAndDeletedFalse(any(), anyString())).thenReturn(false);
        when(shopRepository.save(any(Shop.class))).thenReturn(shop);

        ShopResponse response = shopService.createShop(createShopRequest);

        assertNotNull(response);
        assertEquals(shop.getName(), response.getName());
        assertEquals(shop.getCode(), response.getCode());
        verify(shopRepository).save(any(Shop.class));
    }

    @Test
    @DisplayName("Should throw exception when tenant not found")
    void shouldThrowExceptionWhenTenantNotFound() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> shopService.createShop(createShopRequest));
    }

    @Test
    @DisplayName("Should get all shops successfully")
    void shouldGetAllShopsSuccessfully() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Shop> shopPage = new PageImpl<>(List.of(shop));

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(shopRepository.findByTenantIdAndDeletedFalse(tenantId, pageable)).thenReturn(shopPage);
        when(userRepository.countByShopId(shop.getId())).thenReturn(2L);

        var response = shopService.getAllShops(pageable, null);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals(2, response.getContent().get(0).getUserCount());
    }

    @Test
    @DisplayName("Should get shop by id successfully")
    void shouldGetShopByIdSuccessfully() {
        UUID shopId = shop.getId();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(userRepository.countByShopId(shopId)).thenReturn(1L);

        ShopResponse response = shopService.getShopById(shopId);

        assertNotNull(response);
        assertEquals(shop.getName(), response.getName());
        assertEquals(1, response.getUserCount());
    }

    @Test
    @DisplayName("Should throw exception when shop not found")
    void shouldThrowExceptionWhenShopNotFound() {
        UUID shopId = UUID.randomUUID();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> shopService.getShopById(shopId));
    }

    @Test
    @DisplayName("Should throw exception when shop belongs to different tenant")
    void shouldThrowExceptionWhenShopBelongsToDifferentTenant() {
        UUID shopId = shop.getId();
        UUID differentTenantId = UUID.randomUUID();
        Tenant differentTenant = new Tenant();
        differentTenant.setId(differentTenantId);
        shop.setTenant(differentTenant);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));

        assertThrows(EntityNotFoundException.class, () -> shopService.getShopById(shopId));
    }

    @Test
    @DisplayName("Should create shop admin successfully")
    void shouldCreateShopAdminSuccessfully() {
        UUID shopId = shop.getId();
        CreateShopAdminRequest request = new CreateShopAdminRequest();
        request.setShopId(shopId);
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john.doe@test.com");

        String keycloakId = "keycloak-id-123";
        User admin = new User();
        admin.setId(UUID.randomUUID());
        admin.setTenant(tenant);
        admin.setShop(shop);
        admin.setFirstName("John");
        admin.setLastName("Doe");
        admin.setEmail("john.doe@test.com");
        admin.setKeycloakId(keycloakId);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(userRepository.existsByEmailAndDeletedFalse(request.getEmail())).thenReturn(false);
        when(keycloakAdapter.createUser(anyString(), anyString(), anyString(), anyString())).thenReturn(keycloakId);
        doNothing().when(keycloakAdapter).setUserAttribute(anyString(), anyString(), anyString());
        when(userRepository.save(any(User.class))).thenReturn(admin);

        User result = shopService.createShopAdmin(request);

        assertNotNull(result);
        assertEquals(admin.getEmail(), result.getEmail());
        verify(keycloakAdapter).createUser(eq("john.doe@test.com"), eq("John"), eq("Doe"), eq("shop_admin"));
        verify(keycloakAdapter).setUserAttribute(eq(keycloakId), eq("shop_id"), eq(shopId.toString()));
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when email already exists for shop admin")
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        UUID shopId = shop.getId();
        CreateShopAdminRequest request = new CreateShopAdminRequest();
        request.setShopId(shopId);
        request.setEmail("existing@test.com");

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(userRepository.existsByEmailAndDeletedFalse(request.getEmail())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> shopService.createShopAdmin(request));
    }

    @Test
    @DisplayName("Should create cashier successfully")
    void shouldCreateCashierSuccessfully() {
        UUID shopId = shop.getId();
        CreateCashierRequest request = new CreateCashierRequest();
        request.setFirstName("Marie");
        request.setLastName("Martin");
        request.setEmail("marie.martin@test.com");

        String keycloakId = "keycloak-id-456";
        User cashier = new User();
        cashier.setId(UUID.randomUUID());
        cashier.setTenant(tenant);
        cashier.setShop(shop);
        cashier.setFirstName("Marie");
        cashier.setLastName("Martin");
        cashier.setEmail("marie.martin@test.com");
        cashier.setKeycloakId(keycloakId);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.empty());
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(userRepository.existsByEmailAndDeletedFalse(request.getEmail())).thenReturn(false);
        when(keycloakAdapter.createUser(anyString(), anyString(), anyString(), anyString())).thenReturn(keycloakId);
        doNothing().when(keycloakAdapter).setUserAttribute(anyString(), anyString(), anyString());
        when(userRepository.save(any(User.class))).thenReturn(cashier);

        User result = shopService.createCashier(shopId, request);

        assertNotNull(result);
        assertEquals(cashier.getEmail(), result.getEmail());
        verify(keycloakAdapter).createUser(eq("marie.martin@test.com"), eq("Marie"), eq("Martin"), eq("cashier"));
        verify(keycloakAdapter).setUserAttribute(eq(keycloakId), eq("shop_id"), eq(shopId.toString()));
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should create cashier successfully by shop admin for own shop")
    void shouldCreateCashierSuccessfullyByShopAdminForOwnShop() {
        UUID shopId = shop.getId();
        CreateCashierRequest request = new CreateCashierRequest();
        request.setFirstName("Marie");
        request.setLastName("Martin");
        request.setEmail("marie.martin@test.com");

        String keycloakId = "keycloak-id-456";
        User cashier = new User();
        cashier.setId(UUID.randomUUID());
        cashier.setTenant(tenant);
        cashier.setShop(shop);
        cashier.setFirstName("Marie");
        cashier.setLastName("Martin");
        cashier.setEmail("marie.martin@test.com");
        cashier.setKeycloakId(keycloakId);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(userRepository.existsByEmailAndDeletedFalse(request.getEmail())).thenReturn(false);
        when(keycloakAdapter.createUser(anyString(), anyString(), anyString(), anyString())).thenReturn(keycloakId);
        doNothing().when(keycloakAdapter).setUserAttribute(anyString(), anyString(), anyString());
        when(userRepository.save(any(User.class))).thenReturn(cashier);

        User result = shopService.createCashier(shopId, request);

        assertNotNull(result);
        assertEquals(cashier.getEmail(), result.getEmail());
        verify(keycloakAdapter).createUser(eq("marie.martin@test.com"), eq("Marie"), eq("Martin"), eq("cashier"));
    }

    @Test
    @DisplayName("Should throw exception when shop admin tries to create cashier for different shop")
    void shouldThrowExceptionWhenShopAdminTriesToCreateCashierForDifferentShop() {
        UUID shopId = shop.getId();
        UUID differentShopId = UUID.randomUUID();
        CreateCashierRequest request = new CreateCashierRequest();
        request.setFirstName("Marie");
        request.setLastName("Martin");
        request.setEmail("marie.martin@test.com");

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(differentShopId));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));

        assertThrows(IllegalArgumentException.class, () -> shopService.createCashier(shopId, request));
    }

    @Test
    @DisplayName("Should throw exception when email already exists for cashier")
    void shouldThrowExceptionWhenEmailAlreadyExistsForCashier() {
        UUID shopId = shop.getId();
        CreateCashierRequest request = new CreateCashierRequest();
        request.setEmail("existing@test.com");

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.empty());
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(userRepository.existsByEmailAndDeletedFalse(request.getEmail())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> shopService.createCashier(shopId, request));
    }
}

