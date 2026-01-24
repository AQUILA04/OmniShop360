package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Customer;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.repository.CustomerRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.web.dto.CreateCustomerRequest;
import com.omnishop360.backend.web.dto.CustomerResponse;
import com.omnishop360.backend.web.dto.CustomerSearchDto;
import com.omnishop360.backend.web.dto.UpdateCustomerRequest;
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
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CustomerService Tests")
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private CustomerService customerService;

    private UUID tenantId;
    private Tenant tenant;
    private Customer customer;
    private CreateCustomerRequest createRequest;
    private UpdateCustomerRequest updateRequest;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        tenant = new Tenant();
        tenant.setId(tenantId);
        tenant.setCompanyName("Test Company");

        customer = new Customer();
        customer.setId(UUID.randomUUID());
        customer.setTenant(tenant);
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setEmail("john.doe@test.com");
        customer.setPhone("123456789");
        customer.setAddress("123 Test Street");
        customer.setCity("Test City");
        customer.setPostalCode("12345");
        customer.setCountry("Test Country");
        customer.setLoyaltyPoints(0);
        customer.setActive(true);
        customer.setDeleted(false);

        createRequest = new CreateCustomerRequest();
        createRequest.setFirstName("John");
        createRequest.setLastName("Doe");
        createRequest.setEmail("john.doe@test.com");
        createRequest.setPhone("123456789");
        createRequest.setAddress("123 Test Street");
        createRequest.setCity("Test City");
        createRequest.setPostalCode("12345");
        createRequest.setCountry("Test Country");

        updateRequest = new UpdateCustomerRequest();
        updateRequest.setFirstName("Jane");
        updateRequest.setEmail("jane.doe@test.com");
    }

    @Test
    @DisplayName("Should create customer successfully")
    void shouldCreateCustomerSuccessfully() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        CustomerResponse response = customerService.createCustomer(createRequest);

        assertNotNull(response);
        assertEquals(customer.getEmail(), response.getEmail());
        assertEquals(customer.getFirstName(), response.getFirstName());
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    @DisplayName("Should throw exception when tenant not found")
    void shouldThrowExceptionWhenTenantNotFound() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> customerService.createCustomer(createRequest));
    }

    @Test
    @DisplayName("Should update customer successfully")
    void shouldUpdateCustomerSuccessfully() {
        UUID customerId = customer.getId();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId))
                .thenReturn(Optional.of(customer));
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        CustomerResponse response = customerService.updateCustomer(customerId, updateRequest);

        assertNotNull(response);
        assertEquals("Jane", customer.getFirstName());
        assertEquals("jane.doe@test.com", customer.getEmail());
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    @DisplayName("Should update customer with all fields")
    void shouldUpdateCustomerWithAllFields() {
        UUID customerId = customer.getId();
        UpdateCustomerRequest fullUpdateRequest = new UpdateCustomerRequest();
        fullUpdateRequest.setFirstName("Jane");
        fullUpdateRequest.setLastName("Smith");
        fullUpdateRequest.setEmail("jane.smith@test.com");
        fullUpdateRequest.setPhone("987654321");
        fullUpdateRequest.setAddress("456 New Street");
        fullUpdateRequest.setCity("New City");
        fullUpdateRequest.setPostalCode("54321");
        fullUpdateRequest.setCountry("New Country");
        fullUpdateRequest.setActive(false);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId))
                .thenReturn(Optional.of(customer));
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        CustomerResponse response = customerService.updateCustomer(customerId, fullUpdateRequest);

        assertNotNull(response);
        assertEquals("Jane", customer.getFirstName());
        assertEquals("Smith", customer.getLastName());
        assertEquals("jane.smith@test.com", customer.getEmail());
        assertEquals("987654321", customer.getPhone());
        assertEquals("456 New Street", customer.getAddress());
        assertEquals("New City", customer.getCity());
        assertEquals("54321", customer.getPostalCode());
        assertEquals("New Country", customer.getCountry());
        assertFalse(customer.getActive());
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    @DisplayName("Should update customer with partial fields")
    void shouldUpdateCustomerWithPartialFields() {
        UUID customerId = customer.getId();
        UpdateCustomerRequest partialUpdateRequest = new UpdateCustomerRequest();
        partialUpdateRequest.setPhone("999999999");

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId))
                .thenReturn(Optional.of(customer));
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        CustomerResponse response = customerService.updateCustomer(customerId, partialUpdateRequest);

        assertNotNull(response);
        assertEquals("999999999", customer.getPhone());
        assertEquals("John", customer.getFirstName());
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    @DisplayName("Should throw exception when customer not found for update")
    void shouldThrowExceptionWhenCustomerNotFoundForUpdate() {
        UUID customerId = UUID.randomUUID();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId))
                .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> customerService.updateCustomer(customerId, updateRequest));
    }

    @Test
    @DisplayName("Should delete customer successfully")
    void shouldDeleteCustomerSuccessfully() {
        UUID customerId = customer.getId();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId))
                .thenReturn(Optional.of(customer));
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        customerService.deleteCustomer(customerId);

        verify(customerRepository).save(any(Customer.class));
        assertTrue(customer.getDeleted());
    }

    @Test
    @DisplayName("Should throw exception when customer not found for delete")
    void shouldThrowExceptionWhenCustomerNotFoundForDelete() {
        UUID customerId = UUID.randomUUID();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId))
                .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> customerService.deleteCustomer(customerId));
    }

    @Test
    @DisplayName("Should get customers successfully")
    @SuppressWarnings({"unchecked", "rawtypes"})
    void shouldGetCustomersSuccessfully() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Customer> customerPage = new PageImpl<>(List.of(customer));
        CustomerSearchDto searchDto = new CustomerSearchDto(null, null, null, null, null);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(customerRepository.findAll((Specification) any(Specification.class), eq(pageable)))
                .thenReturn(customerPage);

        var response = customerService.getCustomers(searchDto, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }

    @Test
    @DisplayName("Should get customers with keyword search")
    @SuppressWarnings({"unchecked", "rawtypes"})
    void shouldGetCustomersWithKeywordSearch() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Customer> customerPage = new PageImpl<>(List.of(customer));
        CustomerSearchDto searchDto = new CustomerSearchDto(null, "john", null, null, null);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(customerRepository.findAll((Specification) any(Specification.class), eq(pageable)))
                .thenReturn(customerPage);

        var response = customerService.getCustomers(searchDto, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }

    @Test
    @DisplayName("Should get customers with email filter")
    @SuppressWarnings({"unchecked", "rawtypes"})
    void shouldGetCustomersWithEmailFilter() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Customer> customerPage = new PageImpl<>(List.of(customer));
        CustomerSearchDto searchDto = new CustomerSearchDto(null, null, "john.doe@test.com", null, null);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(customerRepository.findAll((Specification) any(Specification.class), eq(pageable)))
                .thenReturn(customerPage);

        var response = customerService.getCustomers(searchDto, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }

    @Test
    @DisplayName("Should get customers with active filter")
    @SuppressWarnings({"unchecked", "rawtypes"})
    void shouldGetCustomersWithActiveFilter() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Customer> customerPage = new PageImpl<>(List.of(customer));
        CustomerSearchDto searchDto = new CustomerSearchDto(null, null, null, null, true);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(customerRepository.findAll((Specification) any(Specification.class), eq(pageable)))
                .thenReturn(customerPage);

        var response = customerService.getCustomers(searchDto, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }

    @Test
    @DisplayName("Should get customer by id successfully")
    void shouldGetCustomerByIdSuccessfully() {
        UUID customerId = customer.getId();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId))
                .thenReturn(Optional.of(customer));

        CustomerResponse response = customerService.getCustomerById(customerId);

        assertNotNull(response);
        assertEquals(customer.getEmail(), response.getEmail());
    }

    @Test
    @DisplayName("Should throw exception when customer not found")
    void shouldThrowExceptionWhenCustomerNotFound() {
        UUID customerId = UUID.randomUUID();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId))
                .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> customerService.getCustomerById(customerId));
    }
}
