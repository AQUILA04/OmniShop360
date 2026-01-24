package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.CustomerService;
import com.omnishop360.backend.web.dto.CreateCustomerRequest;
import com.omnishop360.backend.web.dto.CustomerResponse;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.UpdateCustomerRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CustomerController Tests")
class CustomerControllerTest {

    @Mock
    private CustomerService customerService;

    @InjectMocks
    private CustomerController customerController;

    private CreateCustomerRequest createRequest;
    private UpdateCustomerRequest updateRequest;
    private CustomerResponse customerResponse;
    private UUID customerId;

    @BeforeEach
    void setUp() {
        customerId = UUID.randomUUID();

        createRequest = new CreateCustomerRequest();
        createRequest.setFirstName("John");
        createRequest.setLastName("Doe");
        createRequest.setEmail("john.doe@test.com");
        createRequest.setPhone("123456789");

        updateRequest = new UpdateCustomerRequest();
        updateRequest.setFirstName("Jane");
        updateRequest.setEmail("jane.doe@test.com");

        customerResponse = CustomerResponse.builder()
                .id(customerId)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@test.com")
                .phone("123456789")
                .loyaltyPoints(0)
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should create customer successfully")
    void shouldCreateCustomerSuccessfully() {
        when(customerService.createCustomer(any(CreateCustomerRequest.class))).thenReturn(customerResponse);

        ResponseEntity<CustomerResponse> response = customerController.createCustomer(createRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(customerResponse, response.getBody());
        verify(customerService).createCustomer(any(CreateCustomerRequest.class));
    }

    @Test
    @DisplayName("Should update customer successfully")
    void shouldUpdateCustomerSuccessfully() {
        when(customerService.updateCustomer(any(UUID.class), any(UpdateCustomerRequest.class)))
                .thenReturn(customerResponse);

        ResponseEntity<CustomerResponse> response = customerController.updateCustomer(customerId, updateRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(customerResponse, response.getBody());
        verify(customerService).updateCustomer(eq(customerId), any(UpdateCustomerRequest.class));
    }

    @Test
    @DisplayName("Should delete customer successfully")
    void shouldDeleteCustomerSuccessfully() {
        doNothing().when(customerService).deleteCustomer(any(UUID.class));

        ResponseEntity<Void> response = customerController.deleteCustomer(customerId);

        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
        verify(customerService).deleteCustomer(customerId);
    }

    @Test
    @DisplayName("Should get customers successfully")
    void shouldGetCustomersSuccessfully() {
        PageResponse<CustomerResponse> pageResponse = PageResponse.<CustomerResponse>builder()
                .content(java.util.List.of(customerResponse))
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(20)
                        .number(0)
                        .totalElements(1L)
                        .totalPages(1)
                        .build())
                .build();

        when(customerService.getCustomers(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<CustomerResponse>> response = customerController.getCustomers(
                0, 20, "createdAt,desc", null, null, null, null);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getContent().size());
        verify(customerService).getCustomers(any(), any());
    }

    @Test
    @DisplayName("Should get customers with all search parameters")
    void shouldGetCustomersWithAllSearchParameters() {
        PageResponse<CustomerResponse> pageResponse = PageResponse.<CustomerResponse>builder()
                .content(java.util.List.of(customerResponse))
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(20)
                        .number(0)
                        .totalElements(1L)
                        .totalPages(1)
                        .build())
                .build();

        when(customerService.getCustomers(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<CustomerResponse>> response = customerController.getCustomers(
                0, 20, "lastName,asc", "john", "john.doe@test.com", "123456789", true);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(customerService).getCustomers(any(), any());
    }

    @Test
    @DisplayName("Should limit page size to 100")
    void shouldLimitPageSizeTo100() {
        PageResponse<CustomerResponse> pageResponse = PageResponse.<CustomerResponse>builder()
                .content(java.util.List.of())
                .page(com.omnishop360.backend.web.dto.PageResponse.PageInfo.builder()
                        .size(100)
                        .number(0)
                        .totalElements(0L)
                        .totalPages(0)
                        .build())
                .build();

        when(customerService.getCustomers(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<CustomerResponse>> response = customerController.getCustomers(
                0, 200, "createdAt,desc", null, null, null, null);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(customerService).getCustomers(any(), any());
    }

    @Test
    @DisplayName("Should get customer by id successfully")
    void shouldGetCustomerByIdSuccessfully() {
        when(customerService.getCustomerById(any(UUID.class))).thenReturn(customerResponse);

        ResponseEntity<CustomerResponse> response = customerController.getCustomerById(customerId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(customerResponse, response.getBody());
        verify(customerService).getCustomerById(customerId);
    }
}
