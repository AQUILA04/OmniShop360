package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.TenantStatus;
import com.omnishop360.backend.domain.entity.User;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.domain.repository.UserRepository;
import com.omnishop360.backend.domain.service.UserContextService;
import com.omnishop360.backend.infrastructure.adapter.KeycloakAdapter;
import com.omnishop360.backend.web.dto.CreateTenantRequest;
import com.omnishop360.backend.web.dto.TenantResponse;
import com.omnishop360.backend.web.dto.UpdateTenantPricingPolicyRequest;
import com.omnishop360.backend.web.dto.UpdateTenantRequest;
import com.omnishop360.backend.web.dto.UpdateTenantStatusRequest;
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
@DisplayName("TenantService Tests")
class TenantServiceTest {

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private KeycloakAdapter keycloakAdapter;

    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private TenantService tenantService;

    private CreateTenantRequest createTenantRequest;
    private Tenant savedTenant;
    private User savedUser;

    @BeforeEach
    void setUp() {
        createTenantRequest = new CreateTenantRequest(
                "ACME Corporation",
                "contact@acme.com",
                "John",
                "Doe",
                "john.doe@acme.com"
        );

        savedTenant = new Tenant();
        savedTenant.setId(UUID.randomUUID());
        savedTenant.setCompanyName("ACME Corporation");
        savedTenant.setContactEmail("contact@acme.com");
        savedTenant.setCode("ACMECORP");
        savedTenant.setStatus(TenantStatus.ACTIVE);
        savedTenant.setActive(true);
        savedTenant.setDeleted(false);

        savedUser = new User();
        savedUser.setId(UUID.randomUUID());
        savedUser.setTenant(savedTenant);
        savedUser.setFirstName("John");
        savedUser.setLastName("Doe");
        savedUser.setEmail("john.doe@acme.com");
        savedUser.setKeycloakId("keycloak-id-123");
        savedUser.setActive(true);
        savedUser.setDeleted(false);
    }

    @Test
    @DisplayName("Should create tenant successfully")
    void shouldCreateTenantSuccessfully() {
        when(userRepository.existsByEmailAndDeletedFalse(anyString())).thenReturn(false);
        when(tenantRepository.existsByCode(anyString())).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenReturn(savedTenant);
        when(keycloakAdapter.createUser(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("keycloak-id-123");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        TenantResponse response = tenantService.createTenant(createTenantRequest);

        assertNotNull(response);
        assertEquals("ACME Corporation", response.getCompanyName());
        assertEquals("contact@acme.com", response.getContactEmail());
        assertEquals(TenantStatus.ACTIVE, response.getStatus());
        assertNotNull(response.getAdmin());
        assertEquals("john.doe@acme.com", response.getAdmin().getEmail());

        verify(tenantRepository).save(any(Tenant.class));
        verify(keycloakAdapter).createUser(
                eq("john.doe@acme.com"),
                eq("John"),
                eq("Doe"),
                eq("tenant_admin")
        );
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when admin email already exists")
    void shouldThrowExceptionWhenAdminEmailAlreadyExists() {
        when(userRepository.existsByEmailAndDeletedFalse("john.doe@acme.com")).thenReturn(true);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> tenantService.createTenant(createTenantRequest)
        );

        assertEquals("Admin email already exists", exception.getMessage());
        verify(tenantRepository, never()).save(any(Tenant.class));
        verify(keycloakAdapter, never()).createUser(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("Should get tenant by id successfully")
    void shouldGetTenantByIdSuccessfully() {
        UUID tenantId = savedTenant.getId();
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(savedTenant));
        when(userRepository.countByTenantId(tenantId)).thenReturn(1L);

        TenantResponse response = tenantService.getTenantById(tenantId);

        assertNotNull(response);
        assertEquals(tenantId, response.getId());
        assertEquals("ACME Corporation", response.getCompanyName());
        assertEquals(1, response.getAdminCount());

        verify(tenantRepository).findByIdAndDeletedFalse(tenantId);
        verify(userRepository).countByTenantId(tenantId);
    }

    @Test
    @DisplayName("Should throw exception when tenant not found")
    void shouldThrowExceptionWhenTenantNotFound() {
        UUID tenantId = UUID.randomUUID();
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.empty());

        assertThrows(
                jakarta.persistence.EntityNotFoundException.class,
                () -> tenantService.getTenantById(tenantId)
        );

        verify(tenantRepository).findByIdAndDeletedFalse(tenantId);
        verify(userRepository, never()).countByTenantId(any());
    }

    @Test
    @DisplayName("Should get all tenants with pagination")
    void shouldGetAllTenantsWithPagination() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Tenant> tenantPage = new PageImpl<>(List.of(savedTenant), pageable, 1);

        when(tenantRepository.findAllActiveWithSearch(null, pageable)).thenReturn(tenantPage);
        when(userRepository.countByTenantId(savedTenant.getId())).thenReturn(1L);

        var response = tenantService.getAllTenants(pageable, null);

        assertNotNull(response);
        assertNotNull(response.getContent());
        assertEquals(1, response.getContent().size());
        assertEquals(1, response.getPage().getTotalElements());
        assertEquals(0, response.getPage().getNumber());

        verify(tenantRepository).findAllActiveWithSearch(null, pageable);
        verify(userRepository).countByTenantId(savedTenant.getId());
    }

    @Test
    @DisplayName("Should generate tenant code with special characters")
    void shouldGenerateTenantCodeWithSpecialCharacters() {
        CreateTenantRequest request = new CreateTenantRequest(
                "ACME-Corp & Co.!",
                "contact@acme.com",
                "John",
                "Doe",
                "john.doe@acme.com"
        );

        when(userRepository.existsByEmailAndDeletedFalse(anyString())).thenReturn(false);
        when(tenantRepository.existsByCode("ACMECORPCO")).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenReturn(savedTenant);
        when(keycloakAdapter.createUser(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("keycloak-id-123");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        TenantResponse response = tenantService.createTenant(request);

        assertNotNull(response);
        verify(tenantRepository).existsByCode("ACMECORPCO");
    }

    @Test
    @DisplayName("Should generate tenant code with empty filtered name")
    void shouldGenerateTenantCodeWithEmptyFilteredName() {
        CreateTenantRequest request = new CreateTenantRequest(
                "!!!",
                "contact@acme.com",
                "John",
                "Doe",
                "john.doe@acme.com"
        );

        when(userRepository.existsByEmailAndDeletedFalse(anyString())).thenReturn(false);
        when(tenantRepository.existsByCode("TENANT")).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenReturn(savedTenant);
        when(keycloakAdapter.createUser(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("keycloak-id-123");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        TenantResponse response = tenantService.createTenant(request);

        assertNotNull(response);
        verify(tenantRepository).existsByCode("TENANT");
    }

    @Test
    @DisplayName("Should generate tenant code with long company name")
    void shouldGenerateTenantCodeWithLongCompanyName() {
        CreateTenantRequest request = new CreateTenantRequest(
                "Very Long Company Name That Exceeds Ten Characters",
                "contact@acme.com",
                "John",
                "Doe",
                "john.doe@acme.com"
        );

        when(userRepository.existsByEmailAndDeletedFalse(anyString())).thenReturn(false);
        when(tenantRepository.existsByCode("VERYLONGCO")).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenReturn(savedTenant);
        when(keycloakAdapter.createUser(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("keycloak-id-123");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        TenantResponse response = tenantService.createTenant(request);

        assertNotNull(response);
        verify(tenantRepository).existsByCode("VERYLONGCO");
    }

    @Test
    @DisplayName("Should generate tenant code with counter when code exists")
    void shouldGenerateTenantCodeWithCounterWhenCodeExists() {
        CreateTenantRequest request = new CreateTenantRequest(
                "ACME Corporation",
                "contact@acme.com",
                "John",
                "Doe",
                "john.doe@acme.com"
        );

        when(userRepository.existsByEmailAndDeletedFalse(anyString())).thenReturn(false);
        lenient().when(tenantRepository.existsByCode("ACMECORPORA")).thenReturn(true);
        lenient().when(tenantRepository.existsByCode("ACMECORPORA1")).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenReturn(savedTenant);
        when(keycloakAdapter.createUser(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("keycloak-id-123");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        TenantResponse response = tenantService.createTenant(request);

        assertNotNull(response);
        verify(tenantRepository, atLeastOnce()).existsByCode(anyString());
    }

    @Test
    @DisplayName("Should update pricing policy successfully")
    void shouldUpdatePricingPolicySuccessfully() {
        UUID tenantId = savedTenant.getId();
        UpdateTenantPricingPolicyRequest request = new UpdateTenantPricingPolicyRequest("LOCAL_ALLOWED");

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(savedTenant));
        when(tenantRepository.save(any(Tenant.class))).thenReturn(savedTenant);

        TenantResponse response = tenantService.updatePricingPolicy(request);

        assertNotNull(response);
        verify(tenantRepository).save(any(Tenant.class));
    }

    @Test
    @DisplayName("Should update tenant successfully")
    void shouldUpdateTenantSuccessfully() {
        UUID tenantId = savedTenant.getId();
        UpdateTenantRequest request = new UpdateTenantRequest("New Company Name", "newcontact@acme.com");
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(savedTenant));
        when(tenantRepository.save(any(Tenant.class))).thenReturn(savedTenant);
        when(userRepository.countByTenantId(tenantId)).thenReturn(1L);

        TenantResponse response = tenantService.updateTenant(tenantId, request);

        assertNotNull(response);
        verify(tenantRepository).save(any(Tenant.class));
        verify(tenantRepository).findByIdAndDeletedFalse(tenantId);
    }

    @Test
    @DisplayName("Should throw when update tenant not found")
    void shouldThrowWhenUpdateTenantNotFound() {
        UUID tenantId = UUID.randomUUID();
        UpdateTenantRequest request = new UpdateTenantRequest("New Name", "new@acme.com");
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.empty());

        assertThrows(jakarta.persistence.EntityNotFoundException.class,
                () -> tenantService.updateTenant(tenantId, request));
        verify(tenantRepository, never()).save(any(Tenant.class));
    }

    @Test
    @DisplayName("Should update tenant status to SUSPENDED successfully")
    void shouldUpdateTenantStatusToSuspendedSuccessfully() {
        UUID tenantId = savedTenant.getId();
        UpdateTenantStatusRequest request = new UpdateTenantStatusRequest(TenantStatus.SUSPENDED);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(savedTenant));
        when(tenantRepository.save(any(Tenant.class))).thenReturn(savedTenant);
        when(userRepository.countByTenantId(tenantId)).thenReturn(1L);

        TenantResponse response = tenantService.updateTenantStatus(tenantId, request);

        assertNotNull(response);
        verify(tenantRepository).save(any(Tenant.class));
    }

    @Test
    @DisplayName("Should throw when update status with DELETED")
    void shouldThrowWhenUpdateStatusWithDeleted() {
        UUID tenantId = savedTenant.getId();
        UpdateTenantStatusRequest request = new UpdateTenantStatusRequest(TenantStatus.DELETED);

        assertThrows(IllegalArgumentException.class,
                () -> tenantService.updateTenantStatus(tenantId, request));
        verify(tenantRepository, never()).save(any(Tenant.class));
    }

    @Test
    @DisplayName("Should throw when update status tenant not found")
    void shouldThrowWhenUpdateStatusTenantNotFound() {
        UUID tenantId = UUID.randomUUID();
        UpdateTenantStatusRequest request = new UpdateTenantStatusRequest(TenantStatus.ACTIVE);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.empty());

        assertThrows(jakarta.persistence.EntityNotFoundException.class,
                () -> tenantService.updateTenantStatus(tenantId, request));
        verify(tenantRepository, never()).save(any(Tenant.class));
    }

    @Test
    @DisplayName("Should delete tenant successfully")
    void shouldDeleteTenantSuccessfully() {
        UUID tenantId = savedTenant.getId();
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(savedTenant));
        when(tenantRepository.save(any(Tenant.class))).thenReturn(savedTenant);

        tenantService.deleteTenant(tenantId);

        verify(tenantRepository).save(any(Tenant.class));
    }

    @Test
    @DisplayName("Should throw when delete tenant not found")
    void shouldThrowWhenDeleteTenantNotFound() {
        UUID tenantId = UUID.randomUUID();
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.empty());

        assertThrows(jakarta.persistence.EntityNotFoundException.class,
                () -> tenantService.deleteTenant(tenantId));
        verify(tenantRepository, never()).save(any(Tenant.class));
    }
}

