package com.omnishop360.backend.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omnishop360.backend.domain.service.CustomerService;
import com.omnishop360.backend.web.dto.CreateCustomerRequest;
import com.omnishop360.backend.web.dto.CustomerResponse;
import com.omnishop360.backend.web.dto.PageResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CustomerControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CustomerService customerService;

    @Test
    @WithMockUser(authorities = "ROLE_cashier")
    @DisplayName("POST /v1/customers should return created")
    void shouldCreateCustomer() throws Exception {
        UUID customerId = UUID.randomUUID();
        CreateCustomerRequest request = new CreateCustomerRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        CustomerResponse response = CustomerResponse.builder().id(customerId).firstName("John").lastName("Doe").active(true).build();
        when(customerService.createCustomer(any())).thenReturn(response);

        mockMvc.perform(post("/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(customerId.toString()));
    }

    @Test
    @WithMockUser(authorities = "ROLE_cashier")
    @DisplayName("GET /v1/customers should return page")
    void shouldGetCustomers() throws Exception {
        PageResponse<CustomerResponse> page = PageResponse.<CustomerResponse>builder()
                .content(List.of(CustomerResponse.builder().id(UUID.randomUUID()).firstName("Client").lastName("Divers").build()))
                .page(PageResponse.PageInfo.builder().size(20).number(0).totalElements(1L).totalPages(1).build())
                .build();
        when(customerService.getCustomers(any(), any())).thenReturn(page);

        mockMvc.perform(get("/v1/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }
}
